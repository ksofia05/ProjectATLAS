// hooks/useAuth.js
import { useState, useEffect } from 'react';
import { client } from '../supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Función para verificar el estado de autenticación
    const checkAuth = async () => {
      try {
        const { data: { user } } = await client.auth.getUser();
        setUser(user);
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Verificar autenticación inicial
    checkAuth();

    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = client.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setIsAuthenticated(!!session);
        setIsLoading(false);
      }
    );

    // Cleanup
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Función para cerrar sesión
  const logout = async () => {
    try {
      const { error } = await client.auth.signOut();
      if (error) throw error;
      
      // Limpiar localStorage
      localStorage.clear();
      
      return { success: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return { success: false, error };
    }
  };

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Función para registrarse
  const signUp = async (email, password, userData = {}) => {
    try {
      setIsLoading(true);
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) throw error;
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error al registrarse:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    signUp
  };
};