import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import AdminPendingTasksCard from "./AdminPendingTasksCard";
import CollaboratorPendingTasksCard from "./CollaboratorPendingTasksCard";

export default function PendingTasksCard({ className }) {
  const { userProfile } = useContext(AuthContext);

  if (!userProfile) {
    return (
      <div
        className={`bg-[#14141e] rounded-3xl border border-slate-700/50 px-9 py-8 w-[400px] shadow-lg ${className}`}
      >
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  // Cambiar tarjeta si es admin
  if (userProfile.tipoUsuario === "admin") {
    return <AdminPendingTasksCard className={className} />;
  }

  // Si es colaborador, mostrar la tarjeta de colaborador
  return <CollaboratorPendingTasksCard className={className} />;
}
