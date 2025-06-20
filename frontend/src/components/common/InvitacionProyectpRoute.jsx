import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import NoTenerCuenta from "../common/NoTenerCuenta";

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
    );
  }

  if (isAuthenticated) {
    return <Navigate to={`/dashboard-create-project`} replace />;
  }

  // PASA EL ID COMO QUERY PARAM EN NEXT
  return <NoTenerCuenta next={`/dashboard-create-project?id_proyecto=${id}`} />;
};

export default InvitacionProyectoRoute;