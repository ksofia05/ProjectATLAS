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
  collaboratorsCount = 0, // ---------
  pendingTasksCount = 0, // ----------
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
      await fetch(
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
      toast.dismiss(toastId);
      showSuccessToast("Has salido del proyecto.");
      setShowDeleteModal(false);
      if (onProjectUpdate) onProjectUpdate();
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
        className="bg-[#1a1a2e]/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 hover:border-purple-400/50 hover:bg-[#1a1a2e]/70 transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10"
        onClick={handleCardClick}
        tabIndex={0}
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-white text-lg font-semibold group-hover:text-purple-300 transition-colors line-clamp-2 flex-1 mr-2">
            {project.nombreproyecto}
          </h3>
          {isColaborador && (
            <button
              type="button"
              className="p-1.5 rounded-lg hover:bg-red-500/20 transition-all text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
              title="Salir del proyecto"
            >
              <i className="bi bi-box-arrow-right text-sm"></i>
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1.5 text-gray-300">
            <div className="w-6 h-6 bg-blue-500/20 rounded-md flex items-center justify-center">
              <Users size={12} className="text-blue-400" />
            </div>
            <span>{collaboratorsCount}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-300">
            <div className="w-6 h-6 bg-orange-500/20 rounded-md flex items-center justify-center">
              <Edit size={12} className="text-orange-400" />
            </div>
            <span>{pendingTasksCount}</span>
          </div>
        </div>

        <div className="border-t border-gray-700/50 pt-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Última actividad</p>
              <p className="text-xs text-gray-300">Ayer, 4:24 PM</p>
            </div>

            {isColaborador && estado === "Inactivo" && (
              <div className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-md">
                <span className="text-red-400 text-xs font-medium">
                  Inactivo
                </span>
              </div>
            )}
          </div>
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

const CreateProjectCard = ({ onCreateClick, disableCreate }) => {
  const handleClick = () => {
    if (!disableCreate && onCreateClick) {
      onCreateClick();
    }
  };

  if (disableCreate) return null;

  return (
    <div
      className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 backdrop-blur-sm border-2 border-dashed border-purple-500/40 rounded-xl p-6 hover:border-purple-400/60 hover:bg-gradient-to-br hover:from-purple-900/30 hover:to-purple-800/20 transition-all duration-300 cursor-pointer group hover:scale-[1.02] flex flex-col items-center justify-center text-center min-h-[180px]"
      onClick={handleClick}
    >
      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
        <Plus size={20} className="text-white" />
      </div>

      <h3 className="text-white text-base font-semibold mb-2 group-hover:text-purple-200 transition-colors">
        Crear nuevo proyecto
      </h3>

      <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
        Comenzar un nuevo espacio de trabajo
      </p>
    </div>
  );
};

const CardProjects = ({
  projects = [],
  projectStates = {},
  userRole,
  onProjectClick,
  onProjectsUpdate,
  onCreateClick,
  disableCreate,
  projectsData = {}, // Nuevo prop para datos dinámicos
}) => {
  return (
    <>
      {/* Proyectos existentes */}
      {projects.map((project) => (
        <InventoryCard
          key={project.id || project.id_proyecto}
          project={project}
          isColaborador={userRole === 2}
          estado={projectStates[project.id_proyecto] || "Activo"}
          onProjectClick={onProjectClick}
          onProjectUpdate={onProjectsUpdate}
          collaboratorsCount={
            projectsData[project.id_proyecto]?.collaboratorsCount || 0
          }
          pendingTasksCount={
            projectsData[project.id_proyecto]?.pendingTasksCount || 0
          }
        />
      ))}

      {/* Tarjeta para crear nuevo proyecto al final */}
      <CreateProjectCard
        onCreateClick={onCreateClick}
        disableCreate={disableCreate}
      />
    </>
  );
};

export default CardProjects;
