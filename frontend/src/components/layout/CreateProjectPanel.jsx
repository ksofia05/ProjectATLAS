import React, { useState, useEffect } from "react";
import construccionImg from "../../assets/LogoSinProyecto.png";
import ModalNewProject from "../layout/ModalNewProject";
import axios from "axios";
import Searchbar from "./Searchbar";
import CardProjects from "../layout/cardProjects";
import useUserStore from "../../stores/useUserStore";
import { showLoadingToast, showErrorToast } from "../common/popUp/Loading";
import { openDashboardIfActive } from "../../utils/openDashboardIfActive";
import Loader from "../common/Loader";
import Navbar from "./Navbar";

const CreateProjectPanel = ({ disableCreate, refreshProjects }) => {
  const user = useUserStore((state) => state.user);

  const [modalOpen, setModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectStates, setProjectStates] = useState({});
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserProjects = async () => {
      setLoadingProjects(true);
      const email =
        user?.correoElectronico || user?.user_metadata?.correoElectronico;
      try {
        if (!user || !email) {
          setProjects([]);
          setLoadingProjects(false);
          setUserRole(null);
          return;
        }

        const usuarioResponse = await axios.get(
          `http://localhost:8000/tasks/api/v1/usuarios/?correoelectronico=${email}`
        );
        const usuarioDb = usuarioResponse.data[0];
        if (!usuarioDb || !usuarioDb.idusuario) {
          setProjects([]);
          setLoadingProjects(false);
          setUserRole(null);
          return;
        }
        setUserRole(usuarioDb.rol_idrol);
        const usuarioId = usuarioDb.idusuario;

        if (usuarioDb.rol_idrol === 1) {
          const proyectosResponse = await axios.get(
            `http://localhost:8000/tasks/api/v1/Proyecto/?id_usuario=${usuarioId}`
          );
          setProjects(proyectosResponse.data);
        } else if (usuarioDb.rol_idrol === 2) {
          const colaboradorResponse = await axios.get(
            `http://localhost:8000/tasks/api/v1/proyectos_colaboradores/?id_usuario=${usuarioId}`
          );
          const proyectos = colaboradorResponse.data.proyectos || [];
          setProjects(proyectos);

          const estados = {};
          for (const proyecto of proyectos) {
            try {
              const res = await axios.get(
                `http://localhost:8000/tasks/api/v1/filtro_colaborador/?id_proyecto=${proyecto.id_proyecto}`
              );
              const colaborador = res.data.colaboradores.find(
                (c) => c.correo === email
              );
              estados[proyecto.id_proyecto] = colaborador
                ? colaborador.estado
                : "Inactivo";
            } catch {
              estados[proyecto.id_proyecto] = "Inactivo";
            }
          }
          setProjectStates(estados);
        }
      } catch (error) {
        setProjects([]);
        setUserRole(null);
      } finally {
        setLoadingProjects(false);
      }
    };

    if (user) fetchUserProjects();
  }, [user, refreshProjects]);

  const getUserDisplayName = () => {
    return user?.nombre || user?.email || "Usuario";
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.nombreproyecto &&
      project.nombreproyecto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProjectClick = async (project) => {
    if (user?.rol_idrol === 1 || user?.rol_idRol === 1) {
      window.open(`/dashboard/${project.id_proyecto}`, "_blank");
      return;
    }
    const toastId = showLoadingToast("Verificando acceso...");
    try {
      await openDashboardIfActive(project.id_proyecto, user, toastId);
    } finally {
      toastId.dismiss(toastId);
    }
  };

  const handleCreateProject = () => {
    // Verificar si el usuario ya tiene proyectos
    if (projects.length > 0) {
      showErrorToast(
        "No puedes crear más proyectos. Ya tienes un proyecto asociado a tu cuenta."
      );
      return;
    }
    setModalOpen(true);
  };

  const handleCreate = (nuevoProyecto) => {
    setProjects((prevProjects) => [...prevProjects, nuevoProyecto]);
  };

  return (
    <div className="bg-[#0a0a12] min-h-screen">
      {/* Navbar (necesito arreglar el ancho) */}
      <div className="relative z-50 px-6 py-4">
        <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/40 rounded-2xl mx-4 shadow-2xl overflow-visible">
          <Navbar
            title="Proyectos"
            subtitle="Organiza tus espacios de trabajo."
            showUpgradeButton={false}
          />
        </div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Emcabrzao*/}
          <div className="text-center mb-8">
            <style jsx>{`
              @keyframes sparkle {
                0%, 100% { 
                  transform: rotate(0deg) scale(1); 
                  filter: brightness(1);
                }
                25% { 
                  transform: rotate(90deg) scale(1.1); 
                  filter: brightness(1.3);
                }
                50% { 
                  transform: rotate(180deg) scale(1.2); 
                  filter: brightness(1.5);
                }
                75% { 
                  transform: rotate(270deg) scale(1.1); 
                  filter: brightness(1.3);
                }
              }
              .sparkle {
                animation: sparkle 3s ease-in-out infinite;
              }
            `}</style>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Hola, {getUserDisplayName()}
              <span className="inline-block ml-3 text-purple-400 sparkle">
                <i className="bi bi-stars text-4xl"></i>
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Organiza tus espacios de trabajo con estilo
            </p>
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="bi bi-search text-gray-400 text-lg"></i>
                </div>
                <input
                  type="text"
                  className="w-full pl-12 pr-6 py-4 bg-slate-800/30 backdrop-blur-md border border-slate-700/40 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                  placeholder="Buscar proyectos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Projects Grid - Proyectos primero, botón crear al final */}
          {loadingProjects ? (
            <div className="flex justify-center items-center py-20">
              <Loader text="Cargando tus proyectos..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Tarjetas de proyectos existentes PRIMERO */}
              <CardProjects
                projects={filteredProjects}
                projectStates={projectStates}
                userRole={userRole}
                onProjectClick={handleProjectClick}
                onProjectsUpdate={() => {
                  if (refreshProjects) {
                    setTimeout(() => refreshProjects(), 500);
                  }
                }}
              />

              {/* Aun estoy organizando el orden de las tarjetas de los proyectos*/}
              <div
                onClick={handleCreateProject}
                className="group relative overflow-hidden from-[#14141e] to-[#14141e] via-[#181825] border-2 border-dashed border-purple-500/30 rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:scale-105 hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-500/20 backdrop-blur-sm min-h-[280px]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  <div className="w-16 h-16 bg-slate-700/30 border border-purple-500/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-slate-700/40 transition-all duration-300">
                    <i className="bi bi-plus text-purple-400 text-2xl font-bold group-hover:text-purple-300"></i>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 text-center group-hover:text-purple-300 transition-colors duration-300">
                    Crear Nuevo Proyecto
                  </h3>

                  <p className="text-gray-400 text-sm text-center group-hover:text-gray-300 transition-colors duration-300 mb-4">
                    Comienza algo increíble
                  </p>

                  <div className="flex items-center gap-2 text-purple-400/70 text-xs group-hover:text-purple-300 transition-colors duration-300">
                    <i className="bi bi-arrow-right"></i>
                    <span>Haz clic para empezar</span>
                  </div>

                  <div className="mt-6 w-full h-1 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Posible cambio, son solo estilos*/}
                <div className="absolute top-4 right-4 w-6 h-6 border border-purple-500/20 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 border border-purple-400/15 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
              </div>
            </div>
          )}

          {/* Esto es para renderizar a  la hora de buscar*/}
          {!loadingProjects &&
            filteredProjects.length === 0 &&
            projects.length > 0 &&
            searchTerm && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-slate-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="bi bi-search text-slate-400 text-3xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  No se encontraron proyectos
                </h3>
                <p className="text-gray-400 text-lg">
                  Prueba con otro término de búsqueda
                </p>
              </div>
            )}

          {!loadingProjects && projects.length === 0 && !searchTerm && (
            <div className="text-center py-20">
              <div
                onClick={handleCreateProject}
                className="group max-w-md mx-auto bg-slate-800/20 border-2 border-dashed border-purple-500/30 rounded-3xl p-12 cursor-pointer transition-all duration-500 hover:scale-105 hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-500/20 backdrop-blur-sm"
              >
                <div className="w-20 h-20 bg-slate-700/30 border border-purple-500/30 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group_hover:bg-slate-700/40 transition-all duration-300">
                  <i className="bi bi-plus text-purple-400 text-3xl font-bold group-hover:text-purple-300"></i>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">
                  ¡Crea tu primer proyecto!
                </h3>

                <p className="text-gray-400 text-lg group-hover:text-gray-300 transition-colors duration-300 mb-6">
                  Comienza organizando tu trabajo de manera eficiente
                </p>

                <div className="flex items-center justify-center gap-2 text-purple-400/70 group-hover:text-purple-300 transition-colors duration-300">
                  <i className="bi bi-arrow-right"></i>
                  <span>Haz clic para empezar</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Modal */}
      <ModalNewProject
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default CreateProjectPanel;
