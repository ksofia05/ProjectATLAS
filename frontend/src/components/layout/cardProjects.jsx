import React from 'react'
import { Users, Edit, Plus } from 'lucide-react';
import { showErrorToast, showSuccessToast, showLoadingToast } from '../common/popUp/Loading';
import useUserStore from "../../stores/useUserStore";
import WarningModal from '../dashboard/WarningModal';
import toast from 'react-hot-toast';

const InventoryCard = ({
  project,
  isColaborador = false,
  estado = "Activo",
  onProjectClick,
  onProjectUpdate
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
    const toastId=showLoadingToast("Eliminando proyecto...");
    try {
      const response = await fetch("http://localhost:8000/tasks/api/v1/quitar_colaborador_de_proyecto/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: user.idUsuario,
          id_proyecto: project.id_proyecto,
        })
      });
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
  }

  if (!project) return null;
  return (
    <>
    <div
      type="button"
      className={`rounded-2xl p-10 border border-white/50 shadow-lg max-w-sm transition-colors duration-200 block text-left
        ${isColaborador && estado === "Inactivo" ? "opacity-50 cursor-not-allowed" : "hover:border-white/70 cursor-pointer"}`}
      style={{ textDecoration: "none" }}
      onClick={handleCardClick}
      tabIndex={0}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-2xl font-bold font-['Nunito']">{project.nombreproyecto}</h2>
      </div>
      <div className="flex items-center gap-6 mb-3">
        <div className="flex items-center gap-2 text-gray-400">
          <Users size={18} />
          <span className="text-sm">3 Miembros</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Edit size={18} />
          <span className="text-sm">12 Pendientes</span>
        </div>
      </div>
      <hr className="border-gray-700 border-t mb-3" />
      <div className="text-gray-400 text-sm flex items-center ">
          <span>
            <span className="text-white font-medium">Última Actividad:</span> Ayer, 4:24 PM
          </span>
          {isColaborador &&(
            <button
              type="button"
              className='ml-2  rounded-full hover:bg-red-100/10 transition text-gray-400 hover:text-red-500'
              onClick={e=> {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
              title='Eliminar todo'
            >
              <i className='bi bi-trash text-base'></i>
            </button>
          )}
      </div>
      
      {isColaborador && estado === "Inactivo" && (
        <div className="mt-4 text-red-400 font-semibold">
          Estado: Inactivo
        </div>
      )}
    </div>
  {showDeleteModal && (
    <WarningModal
      visible={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      title='¿Estas seguro que quieres salir del proyecto?'
      message='Esta accion es irreversible. Si sales, perderas el acceso al proyecto.'
      confirmText='Cancelar'
      showConfirm={true}
      onConfirm={handleRemoveAsCollaborator}
    />
    )}
    </>
  );
};

const CreateProjectCard = () => {
  const handleClick = () => {
    console.log('Click en "Crear nuevo proyecto"');
  };

  return (
    <div className="rounded-2xl px-22 py-8 border-3 border-dashed border-purple-500/50 hover:border-purple-400/70 transition-colors duration-200  flex flex-col items-center justify-center cursor-pointer group" onClick={handleClick}>
      <div className="flex items-center justify-between w-full px-6 mb-4">
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-600/30 transition-colors duration-200">
          <Plus size={24} className="text-purple-400" />
        </div>
        <h3 className="text-white text-xl font-semibold mb-2 justify-center">Crear nuevo proyecto</h3>
        <p className="text-gray-400 text-sm">Haz clic para comenzar</p>
      </div>
    </div>
  );
};

const CardProjects = ({ projects = [], projectStates = {}, userRole, onProjectClick, onProjectsUpdate }) => {
  return (
    <div className="p-0">
      <div className="flex flex-col sm:flex-row gap-10 items-start">
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
        <CreateProjectCard />
      </div>
    </div>
  );
};

export default CardProjects;