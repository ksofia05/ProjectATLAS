import React from "react";
import { Users, Edit, Plus } from "lucide-react";
import {
  showErrorToast,
  showSuccessToast,
  showLoadingToast,
} from "../common/popUp/Loading";
import useUserStore from "../../stores/useUserStore";
import WarningModal from "../dashboard/WarningModal";
import toast from "react-hot-toast";
import { actualizarHistorialColaborador } from "../common/historialColaboradores";

const InventoryCard = ({
  project,
  isColaborador = false,
  estado = "Activo",
  onProjectClick,
  onProjectUpdate,
}) => {
  const user = useUserStore((state) => state.user);

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleCardClick = async (e) => {
    e.preventDefault();
    if (onProjectClick) {
      await onProjectClick(project);
    } else {
      showErrorToast("No se ha definido acción para este proyecto.");
    }
  };

  const handleRemoveAsCollaborator = async () => {
    setLoading(true);
    const toastId = showLoadingToast("Eliminando proyecto...");
    try {
      const response = await fetch(
        "http://localhost:8000/tasks/api/v1/quitar_colaborador_de_proyecto/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_usuario: user.idUsuario,
            id_proyecto: project.id_proyecto,
          }),
        }
      );
      const data = await response.json();
      toast.dismiss(toastId);
      if (response.ok && data.success) {
        showSuccessToast("Has salido del proyecto.");
        await actualizarHistorialColaborador(
          Number(user.idUsuario),
          Number(project.id_proyecto),
          "eliminado"
        );
        setShowDeleteModal(false);
        if (window.refreshUserAndProjects) {
          await window.refreshUserAndProjects();
        }
        if (onProjectUpdate) onProjectUpdate();
      } else {
        showErrorToast(data.error || "Error al eliminar proyecto.");
      }
    } catch (error) {
      toast.dismiss(toastId);
      showErrorToast("Error al eliminar proyecto.");
    } finally {
      setLoading(false);
    }
  };

  if (!project) return null;

  return (
    <>
      <div
        key={project.id_proyecto}
        onClick={() => onProjectClick(project)}
        className="group relative overflow-hidden bg-gradient-to-br from-[#08080e]/95 to-[#0c0c14]/95 via-[#0a0a12]/95 backdrop-blur-md border border-slate-800/40 rounded-3xl p-6 cursor-pointer transition-all duration-500 hover:scale-105 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/15 min-h-[280px]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="w-16 h-16 bg-slate-800/40 border border-purple-500/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-slate-800/50 transition-all duration-300">
            <i className="bi bi-folder text-purple-400 text-2xl group-hover:text-purple-300"></i>
          </div>

          {/* Información del proyecto */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300 line-clamp-2">
              {project.nombreproyecto}
            </h3>

            {/* Estadísticas del proyecto */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                <i className="bi bi-people text-sm"></i>
                <span className="text-sm">
                  {project.miembros || 0} Miembros
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                <i className="bi bi-list-task text-sm"></i>
                <span className="text-sm">
                  {project.tareas_pendientes || 0} Pendientes
                </span>
              </div>
            </div>
          </div>

          {/* Footer de la tarjeta (linea)*/}
          <div className="mt-auto">
            <div className="flex items-center justify-between text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
              <span>Última actividad</span>
              <span>{project.ultima_actividad || "Hoy"}</span>
            </div>

            {/* Barra de progreso visual */}
            <div className="mt-4 w-full h-1 bg-slate-800/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          <div className="absolute top-4 right-4 w-6 h-6 border border-purple-500/20 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
          <div className="absolute bottom-4 left-4 w-4 h-4 border border-purple-400/15 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
        </div>
      </div>

      {showDeleteModal && (
        <WarningModal
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="¿Estás seguro que quieres salir del proyecto?"
          message="Esta acción es irreversible. Si sales, perderás el acceso al proyecto."
          confirmText="Salir del proyecto"
          showConfirm={true}
          onConfirm={handleRemoveAsCollaborator}
        />
      )}
    </>
  );
};

const CardProjects = ({
  projects = [],
  projectStates = {},
  userRole,
  onProjectClick,
  onProjectsUpdate,
}) => {
  return (
    <>
      {projects.map((project) => (
        <InventoryCard
          key={project.id || project.id_proyecto}
          project={project}
          isColaborador={userRole === 2}
          estado={projectStates[project.id_proyecto] || "Activo"}
          onProjectClick={onProjectClick}
          onProjectUpdate={onProjectsUpdate}
        />
      ))}
    </>
  );
};

export default CardProjects;
