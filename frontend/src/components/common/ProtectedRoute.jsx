import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requireRole = null, 
  requireAdmin = false,
  allowWithoutRole = true 
}) => {
  const { 
    isAuthenticated, 
    isLoading, 
    userRole, 
    isAdmin, 
    hasRole,
    hasAnyRole 
  } = useAuth();
  
  const location = useLocation();

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

  // Si requiere ser admin y no lo es
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/notenercuenta" replace />; // O crear una página de "sin permisos"
  }

  // Si requiere un rol específico y no lo tiene
  if (requireRole && !hasRole(requireRole)) {
    return <Navigate to="/notenercuenta" replace />;
  }

  // Si NO permite sin rol y no tiene ningún rol
  if (!allowWithoutRole && !hasAnyRole()) {
    return <Navigate to="/perfil" replace />; // Redirigir a configurar perfil
  }

  // Si pasa todas las validaciones, mostrar el contenido
  return children;
};

export default ProtectedRoute;