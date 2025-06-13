import React from "react";
import { useParams, Navigate } from "react-router-dom";
import NoTenerCuenta from "./notenercuenta";
import { useAuth } from "../../hooks/useAuth";

const InvitacionProyectoRoute = () => {
  const { id } = useParams();
  const { isAuthenticated, isLoading } = useAuth({ redirectOnAuth: false });

  if (isLoading) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Validando...</p>
        </div>
  </div>
      );}

  if (isAuthenticated) {
    return <Navigate to={`/dashboard/${id}`} replace />;
  }

  // Si no está autenticado, mostrar NoTenerCuenta con el next
  return <NoTenerCuenta next={`/dashboard/${id}`} />;
};

export default InvitacionProyectoRoute;