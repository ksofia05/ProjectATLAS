import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import AdminPendingTasksCard from "./AdminPendingTasksCard";
import CollaboratorPendingTasksCard from "./CollaboratorPendingTasksCard";

export default function PendingTasksCard({ className }) {
  const { userProfile } = useContext(AuthContext);

  if (!userProfile) {
    return (
      <div
        className={`from-[#14141e] to-[#14141e] via-[#181825] rounded-3xl border border-slate-700/50 px-9 py-8 w-[400px] shadow-lg ${className}`}
      >
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  // Esto posibolemente lo cambie (da errores con la obtencion del rol :b)
  const isAdmin =
    userProfile.rol_idRol === 1 ||
    userProfile.rol_idrol === 1 ||
    userProfile.tipoUsuario === "admin";

  if (isAdmin) {
    return <AdminPendingTasksCard className={className} />;
  }

  // Si es colaborador, mostrar la tarjeta de colaborador
  return <CollaboratorPendingTasksCard className={className} />;
}
