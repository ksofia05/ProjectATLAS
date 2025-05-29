import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { client } from '../../supabase/client';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await client.auth.getUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = client.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
        setIsLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-300 text-lg">Validando...</p>
      </div>
</div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/iniciar-sesion" state={{ from: location }} replace />;
  }

  // Si está autenticado, mostrar el contenido protegido
  return children;
};

export default ProtectedRoute;