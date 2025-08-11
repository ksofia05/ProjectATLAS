// frontend/src/context/AuthProvider.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { client } from '../supabase/client';
import { getUserProfile } from '../services/userService';
import useUserStore from '../stores/useUserStore';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const initialized = useRef(false);
  const isLoggingOut = useRef(false);
  const lastEventTime = useRef(0);

  // maneja sesiones de usuario (mover arriba para reutilizar)
  const handleUserSession = async (session) => {
    try {
      const profile = await getUserProfile(session.user.id);
      
      if (profile) {
        console.log('Perfil obtenido en AuthProvider:', profile.nombre);
        
        const fullUserData = {
          ...profile,
          auth_user_id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata
        };
        
        setUser(session.user);
        setUserProfile(fullUserData);
        setIsAuthenticated(true);
        
        // Sincronizar con store (evita duplicar si ya está)
        const currentUser = useUserStore.getState().user;
        if (!currentUser || currentUser.auth_user_id !== session.user.id) {
          useUserStore.getState().setUser(fullUserData);
          console.log('Usuario sincronizado AuthProvider -> Store');
        } else {
          console.log('Store ya tiene el usuario correcto');
        }
      } else {
        console.warn('No se encontró perfil para el usuario');
        setUser(session.user);
        setIsAuthenticated(true);
        
        useUserStore.getState().setUser({
          auth_user_id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata
        });
      }
    } catch (profileError) {
      console.error('Error obteniendo perfil:', profileError);
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

  const value = {
    user,
    userProfile,
    isAuthenticated,
    isLoading,
    logout,
    recheckAuth
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