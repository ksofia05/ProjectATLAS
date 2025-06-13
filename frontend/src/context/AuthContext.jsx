import React, { createContext, useContext, useEffect, useState } from 'react';
import { client } from '../supabase/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rol, setRol] = useState(null);


  useEffect(() => {
  const { data: listener } = client.auth.onAuthStateChange((event, session) => {
    setUser(session?.user ?? null);
    setLoading(false);
  });

  return () => listener?.subscription?.unsubscribe();
}, []);

  // Función para obtener el rol del usuario
  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await client
        .from('Usuario')
        .select('rol_idRol')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error obteniendo rol:', error);
        return null;
      }

      if (data?.rol_idRol === 1) return 'admin';
      if (data?.rol_idRol === 2) return 'colaborador';
      return null;
    } catch (error) {
      console.error('Error en fetchUserRole:', error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { user }, error } = await client.auth.getUser();
        
        if (error) {
          console.error('Error obteniendo usuario:', error);
          setUser(null);
          setIsAuthenticated(false);
          setRol(null);
          return;
        }

        setUser(user);
        setIsAuthenticated(!!user);

        if (user) {
          const userRole = await fetchUserRole(user.id);
          setRol(userRole);
        } else {
          setRol(null);
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
        setUser(null);
        setIsAuthenticated(false);
        setRol(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listener para cambios en el estado de autenticación
    const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
      const newUser = session?.user || null;
      setUser(newUser);
      setIsAuthenticated(!!newUser);

      if (newUser) {
        const userRole = await fetchUserRole(newUser.id);
        setRol(userRole);
      } else {
        setRol(null);
      }

      setIsLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email, password, userData = {}) => {
    setIsLoading(true);
    try {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { data: userData },
      });
      
      if (error) throw error;
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error al registrarse:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await client.auth.signOut();
      if (error) throw error;
      
      // Limpiar estado local
      setUser(null);
      setRol(null);
      setIsAuthenticated(false);
      
      // Limpiar localStorage si es necesario
      localStorage.clear();
      
      return { success: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    rol,
    login,
    logout,
    signUp,
    hasRole: (requiredRole) => rol === requiredRole,
    isAdmin: () => rol === 'admin',
    isColaborador: () => rol === 'colaborador'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};