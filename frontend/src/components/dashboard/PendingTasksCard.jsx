import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import AdminPendingTasksCard from "./AdminPendingTasksCard";
import CollaboratorPendingTasksCard from "./CollaboratorPendingTasksCard";

export default function PendingTasksCard({ className }) {
  const { userProfile } = useContext(AuthContext);

  if (!userProfile) {
    return (
      <div
        className={`bg-[#14141e] rounded-3xl border border-slate-700/50 px-9 py-8 no-backdrop-filter w-full max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${className}`}
      >
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

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
