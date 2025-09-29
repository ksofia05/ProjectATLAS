import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getUserProfile, getCompleteUserProfile } from '../services/userService'; 
import { client } from '../supabase/client';
import useUserStore from '../stores/useUserStore';
import { showErrorToast } from "../components/common/popUp/Loading"; 

export const AuthContext = createContext({});
// Mover las constantes que NO son hooks fuera del componente
const MAX_RECONNECT_ATTEMPTS = 3;

export const AuthProvider = ({ children }) => {
  // Mover todos los useRef dentro del componente
  const reconnectAttempts = useRef(0);
  const reconnectTimer = useRef(null);
  const heartbeatInterval = useRef(null);
  
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const initialized = useRef(false);
  const isLoggingOut = useRef(false);
  const lastEventTime = useRef(0);


  const setupHeartbeat = () => {
    // Limpiar heartbeat anterior si existe
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
    }

    // Configurar nuevo heartbeat cada 10 minutos (ajusta según necesidad)
    heartbeatInterval.current = setInterval(async () => {
      if (!isAuthenticated || !user) {
        clearInterval(heartbeatInterval.current);
        return;
      }

      console.log('💓 Heartbeat: verificando sesión...');
      try {
        // Intentar refrescar el token de forma preventiva
        const { data, error } = await client.auth.refreshSession();

        if (error) {
          console.error('Error en heartbeat:', error);
          if (error.message.includes('Refresh Token Not Found') ||
            error.message.includes('Invalid Refresh Token')) {
            console.log('Token de refresco inválido, intentando reconexión...');
            attemptReconnect();
          }
        } else if (data.session) {
          console.log('Sesión refrescada correctamente');
        }
      } catch (error) {
        console.error('Error en heartbeat:', error);
        if (navigator.onLine) {
          attemptReconnect();
        }
      }
    }, 540000); // 9 minutos (menor que el tiempo de expiración típico de 1 hora)
  };

  // Definir attemptReconnect antes de usarlo en setupHeartbeat
  const attemptReconnect = async () => {
    if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
      console.log('Máximo de intentos de reconexión alcanzado');
      showErrorToast("Se perdió la conexión. Por favor, recarga la página.");
      return;
    }

    reconnectAttempts.current += 1;
    console.log(`Intento de reconexión ${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS}`);

    try {
      const { data: refreshData, error: refreshError } = await client.auth.refreshSession();
      if (!refreshError && refreshData.session) {
        console.log('Sesión refrescada exitosamente en reconexión');
        await handleUserSession(refreshData.session);
        reconnectAttempts.current = 0;
        return;
      }

      const { data: { session }, error } = await client.auth.getSession();

      if (session) {
        console.log('Reconexión exitosa, restaurando sesión');
        await handleUserSession(session);
        reconnectAttempts.current = 0;
      } else {
        // No hay sesión, probablemente expiró
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
        useUserStore.getState().clearUser();
        showErrorToast("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      }
    } catch (error) {
      console.error('Error durante reconexión:', error);

      // Programar otro intento después de un tiempo
      if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
        reconnectTimer.current = setTimeout(attemptReconnect, 3000);
      } else {
        showErrorToast("No se pudo restablecer la conexión. Por favor, recarga la página.");
      }
    }
  };

  // maneja sesiones de usuario (mover arriba para reutilizar)
  const handleUserSession = async (session) => {
    try {
      // Usar la nueva función que combina Supabase + Django
      const profile = await getCompleteUserProfile(
        session.user.id, 
        session.user.email
      );
      
      if (profile) {
        console.log('Perfil completo obtenido en AuthProvider:', {
          nombre: profile.nombre,
          rol: profile.rol_idRol,
          fuente: profile.idusuario ? 'django+supabase' : 'solo-supabase'
        });
        
        const fullUserData = {
          ...profile,
          auth_user_id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata
        };
        
        setUser(session.user);
        setUserProfile(fullUserData);
        setIsAuthenticated(true);
        
        // Sincronizar con store
        const currentUser = useUserStore.getState().user;
        if (!currentUser || currentUser.auth_user_id !== session.user.id || 
            currentUser.rol_idRol !== fullUserData.rol_idRol) {
          useUserStore.getState().setUser(fullUserData);
          console.log('Usuario sincronizado AuthProvider -> Store con rol:', fullUserData.rol_idRol);
        } else {
          console.log('Store ya tiene el usuario correcto');
        }
      } else {
        console.warn('No se encontró perfil para el usuario');
        // Fallback sin perfil completo
        setUser(session.user);
        setIsAuthenticated(true);
        
        useUserStore.getState().setUser({
          auth_user_id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata
        });
      }
      setupHeartbeat();
    } catch (profileError) {
      console.error('Error obteniendo perfil completo:', profileError);
      // Fallback al comportamiento original
      setUser(session.user);
      setIsAuthenticated(true);
      
      useUserStore.getState().setUser({
        auth_user_id: session.user.id,
        email: session.user.email,
        user_metadata: session.user.user_metadata
      });
    }
  };

  // forzar re-check desde Login
  const recheckAuth = async () => {
    console.log('Recheckando autenticación por solicitud externa...');
    setIsLoading(true);
    
    try {
      // PEQUEÑO DELAY para que Supabase confirme la sesión
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const { data: { session }, error } = await client.auth.getSession();
      
      if (error) {
        console.error('Error en getSession durante recheck:', error);
        throw error;
      }
      
      if (session?.user && !isLoggingOut.current) {
        console.log('Sesión encontrada en recheck');
        await handleUserSession(session);
      } else {
        console.log('No hay sesión en recheck');
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error en recheck:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    let subscription = null;

    const handleConnectionChange = () => {
      if (navigator.onLine) {
        console.log('🌐 Conexión a internet restaurada');
        if (user && !userProfile) {
          console.log('Intentando recuperar sesión después de recuperar conexión');
          attemptReconnect();
        }
      } else {
        console.log('❌ Conexión a internet perdida');
      }
    };

    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    const initAuth = async () => {
      try {
        console.log('Iniciando validación de autenticación...');
        
        // ✅ ESPERAR tiempo para sincronización completa
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { data: { session }, error: sessionError } = await client.auth.getSession();
        
        if (sessionError) {
          console.error('Error obteniendo sesión:', sessionError);
          throw sessionError;
        }
        
        if (session?.user && !isLoggingOut.current) {
          console.log('Sesión encontrada en init, obteniendo perfil...');
          await handleUserSession(session);
        } else {
          console.log('No hay sesión activa en init');

          // Si hay datos en Zustand pero no sesión, invalidar
          const currentUser = useUserStore.getState().user;
          if (currentUser) {
            console.log('Hay usuario en store pero no sesión, limpiando...');
            useUserStore.getState().clearUser();
          }
          
          setUser(null);
          setUserProfile(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error en inicialización de auth:', error);
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
        console.log('Validación de autenticación completada');
      }
    };

    // CONFIGURAR LISTENER PRIMERO
    const { data: { subscription: authSubscription } } = client.auth.onAuthStateChange(
      async (event, session) => {
        const now = Date.now();
        if (now - lastEventTime.current < 1000) {
          console.log('Evento de auth throttled:', event);
          return;
        }
        lastEventTime.current = now;

        console.log(`Evento de auth: ${event}, isLoggingOut: ${isLoggingOut.current}`);
        
        if (isLoggingOut.current) {
          console.log('Ignorando evento durante logout');
          return;
        }
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('SIGNED_IN detectado en listener');
          setIsLoading(true);
          
          await handleUserSession(session);
          setIsLoading(false);
          
        } else if (event === 'SIGNED_OUT') {
          console.log('SIGNED_OUT detectado en listener');
          setUser(null);
          setUserProfile(null);
          setIsAuthenticated(false);
          setIsLoading(false);
          
          const store = useUserStore.getState();
          if (store.clearUser) {
            store.clearUser();
          } else {
            store.setUser(null);
          }
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token renovado automáticamente');
        }
      }
    );
    subscription = authSubscription;

    // delay "largo"
    setTimeout(initAuth, 700);

    return () => {
      console.log('🧹 Limpiando listener de auth');
      subscription?.unsubscribe();
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
    };
  }, []);

  const logout = async () => {
    try {
      console.log('Iniciando logout manual...');
      
      isLoggingOut.current = true;
      
      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      
      const store = useUserStore.getState();
      if (store.clearUser) {
        store.clearUser();
      } else {
        store.setUser(null);
      }
      
      // Limpiar localStorage
      ['user-storage', 'project-storage', 'collaborators-storage', 'token', 'hasRefreshed'].forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.warn(`No se pudo limpiar ${key}:`, e);
        }
      });
      
      const { error } = await client.auth.signOut();
      if (error) {
        console.error('Error en logout:', error);
        throw error;
      }

      console.log('Logout manual exitoso');

      setTimeout(() => {
        isLoggingOut.current = false;
      }, 2000);
      
      return { success: true };
    } catch (error) {
      console.error('Error en logout:', error);
      setTimeout(() => {
        isLoggingOut.current = false;
      }, 2000);
      return { success: false, error };
    }
  };

  const refreshUserProfile = async () => {
    if (!user?.email) return;
    
    try {
      console.log('Refrescando perfil de usuario...');
      const updatedProfile = await getCompleteUserProfile(user.id, user.email);
      
      if (updatedProfile) {
        const fullUserData = {
          ...updatedProfile,
          auth_user_id: user.id,
          email: user.email,
          user_metadata: user.user_metadata
        };
        
        setUserProfile(fullUserData);
        useUserStore.getState().setUser(fullUserData);
        console.log('Perfil actualizado con rol:', updatedProfile.rol_idRol);
      }
    } catch (error) {
      console.error('Error refrescando perfil:', error);
    }
  };

  const value = {
    user,
    userProfile,
    isAuthenticated,
    isLoading,
    logout,
    recheckAuth,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};