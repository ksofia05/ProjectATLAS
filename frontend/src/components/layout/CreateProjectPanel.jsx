import React, { useState, useEffect } from "react";
import construccionImg from "../../assets/LogoSinProyecto.png";
import ModalNewProject from "./ModalNewProject";
import CardProjects from "../cardProjects";
import { useAuth } from "../../hooks/useAuth"; // Ajusta la ruta según tu estructura

const CreateProjectPanel = ({ onCreate }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  //hook de autenticación
  const { user, isAuthenticated, isLoading } = useAuth();

  // Cargar proyectos del usuario autenticado
  useEffect(() => {
    const fetchUserProjects = async () => {
      if (!isAuthenticated || !user) {
        setProjects([]);
        setLoadingProjects(false);
        return;
      }

      try {
        setLoadingProjects(true);
        //aqui se hara la logica para obtener los proyectos del usuario
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchUserProjects();
  }, [isAuthenticated, user]);

  const handleCreate = (nombreProyecto) => {
    setModalOpen(false);
    if (onCreate) onCreate(nombreProyecto);
  };

  //obtener el nombre del usuario
  const getUserDisplayName = () => {
    if (!user) return "Usuario";
    // retorno el nombre del usuario desde user_metadata
    return user.user_metadata?.nombre 
  };

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="bg-gradient-to-tr from-[#181825] via-[#181825] to-[#29293f] border border-gray-700 rounded-2xl shadow-2xl px-14 py-10 w-full max-w-6xl">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-300 text-lg">Cargando...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // // Mostrar mensaje de no autenticado
  // if (!isAuthenticated) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-[80vh]">
  //       <div className="bg-gradient-to-tr from-[#181825] via-[#181825] to-[#29293f] border border-gray-700 rounded-2xl shadow-2xl px-14 py-10 w-full max-w-6xl">
  //         <div className="text-center py-20">
  //           <h2 className="text-3xl font-bold text-white mb-4">
  //             Acceso Restringido
  //           </h2>
  //           <p className="text-lg text-gray-300 mb-6">
  //             Debes iniciar sesión para ver tus proyectos
  //           </p>
  //           <button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition">
  //             Iniciar Sesión
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-10 px-4">
      <div className="bg-gradient-to-tr from-[#181825] via-[#181825] to-[#29293f] border border-gray-700 rounded-2xl shadow-2xl px-14 py-10 w-full max-w-6xl">
        {/* Título y subtítulo dinámicos */}
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2 text-left">
          Hola, {getUserDisplayName()} <span className="text-2xl">👋</span>
        </h2>
        <p className="text-lg text-gray-300 mb-8 text-left">
          Organiza tus espacios de trabajo.
        </p>
        
        {/* Botón de nuevo proyecto */}
        <div className="flex mb-10">
          <button
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg text-xl transition"
            onClick={() => setModalOpen(true)}
          >
            <i className="bi bi-plus-circle text-2xl"></i>
            Nuevo Proyecto
          </button>
        </div>

        {/* Panel de proyectos - condicional ¡ modificar de acuerdo a como se manejen los proyectos !*/}
        {loadingProjects ? (
          <div className="border-2 border-dashed border-[#7c2ae8] rounded-2xl p-12 flex flex-col items-center bg-[#232336]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-gray-300 text-center text-lg">
              Cargando tus proyectos...
            </p>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <CardProjects 
                key={project.id} 
                project={project}
                userId={user.id}
              />
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-[#7c2ae8] rounded-2xl p-12 flex flex-col items-center bg-[#232336]">
            <img
              src={construccionImg}
              alt="Sin proyectos"
              className="w-32 mb-6"
            />
            <h3 className="text-2xl font-bold text-white mb-2 text-center">
              Sin proyectos creados
            </h3>
            <p className="text-gray-300 text-center text-lg">
              Crea tu primer proyecto para comenzar a colaborar con tu equipo.
            </p>
            <ModalNewProject
              visible={modalOpen}
              onClose={() => setModalOpen(false)}
              onCreate={handleCreate}
              user={user} // Pasar usuario al modal si lo necesitas
            />
          </div>
        )}
      </div>      
    </div>
  );
};

export default CreateProjectPanel;