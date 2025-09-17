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
        onClick={handleCardClick}
        className={`group relative overflow-hidden bg-gradient-to-br from-[#14141e] to-[#14141e] via-[#181825] border-slate-700/50 border rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:scale-105 hover:border-slate-600/70 hover:shadow-2xl hover:shadow-slate-900/50 backdrop-blur-sm ${
          isColaborador && estado === "Inactivo"
            ? "opacity-75 cursor-not-allowed"
            : ""
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <i className="bi bi-folder text-white text-lg"></i>
            </div>

            <div className="flex items-center gap-3">
              {/* Estado del colaborador */}
              {isColaborador && (
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      estado === "Activo" ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span
                    className={`text-xs font-medium ${
                      estado === "Activo" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {estado}
                  </span>
                </div>
              )}

              {/* Botón de eliminar para colaboradores */}
              {isColaborador && (
                <button
                  type="button"
                  className="w-8 h-8 rounded-full hover:bg-red-500/20 transition-colors duration-200 text-gray-400 hover:text-red-400 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteModal(true);
                  }}
                  title="Salir del proyecto"
                >
                  <i className="bi bi-trash text-sm"></i>
                </button>
              )}
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
            {project.nombreproyecto}
          </h3>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <i className="bi bi-people text-blue-400"></i>
              <span>3 Miembros</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <i className="bi bi-list-task text-orange-400"></i>
              <span>12 Pendientes</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Última actividad</span>
              <span className="text-xs text-gray-400">Ayer, 4:24 PM</span>
            </div>
          </div>

          {isColaborador && estado === "Inactivo" && (
            <div className="mt-4 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
              <span className="text-red-400 text-sm font-medium">
                Estado: Inactivo
              </span>
            </div>
          )}

          <div className="mt-4 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
