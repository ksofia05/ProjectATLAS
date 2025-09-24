import React, { useState, useEffect } from "react";
import ModalNewProject from "../layout/ModalNewProject";
import axios from "axios";
import CardProjects from "../layout/cardProjects";
import useUserStore from "../../stores/useUserStore";
import { showLoadingToast, showErrorToast } from "../common/popUp/Loading";
import { openDashboardIfActive } from "../../utils/openDashboardIfActive";
import Loader from "../common/Loader";
import NavbarStatic from "./NavbarStatic";

const CreateProjectPanel = ({
  disableCreate,
  refreshProjects,
  onSidebarToggle,
  isSidebarOpen,
}) => {
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
            } catch (err) {
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
    return user?.nombre || user?.correoElectronico || user?.email || "Usuario";
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.nombreproyecto &&
      project.nombreproyecto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProjectClick = async (project) => {
    if (Number(userRole) === 1) {
      window.open(`/dashboard/${project.id_proyecto}`, "_blank");
      return;
    }
    // Solo para colaboradores (rol 2)
    const toastId = showLoadingToast("Verificando acceso...");
    try {
      await openDashboardIfActive(project.id_proyecto, user, toastId);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleCreateProject = () => {
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
    <div className="min-h-screen w-full flex flex-col">
      <div className="sticky top-0 z-10 pt-6 w-full">
        <div className="px-8 w-full">
          <NavbarStatic
            onSidebarToggle={onSidebarToggle}
            isSidebarOpen={isSidebarOpen}
          />
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 px-8 pb-6 pt-4 overflow-y-auto w-full">
        {/* Contenedor con el ancho fijo (aun lo estoy arreglando en version mobil) */}
        <div className="w-full max-w-none mx-auto">
          {/* Encabezado */}
          <div className="text-center mb-8 w-full">
            <style jsx>{`
              @keyframes sparkle {
                0%,
                100% {
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

            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <i className="bi bi-search text-white text-lg group-focus-within:text-purple-300 transition-colors duration-300"></i>
                </div>

                <input
                  type="text"
                  className="w-full pl-12 pr-6 py-4 bg-gradient-to-br from-[#0a0a0f]/90 to-[#0f0f15]/90 via-[#0c0c12]/90 backdrop-blur-md border border-slate-800/60 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 text-base font-medium hover:border-purple-500/30"
                  placeholder="Buscar proyectos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/5 to-pink-600/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
          </div>

          <div className="w-full">
            {loadingProjects ? (
              <div className="w-full flex justify-center items-center py-20">
                <Loader text="Cargando tus proyectos..." />
              </div>
            ) : (
              <>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <CardProjects
                    projects={filteredProjects}
                    projectStates={projectStates}
                    userRole={userRole}
                    onProjectClick={handleProjectClick}
                  />

                  {(!searchTerm || projects.length === 0) && (
                    <div
                      onClick={handleCreateProject}
                      className="group relative overflow-hidden bg-gradient-to-br from-[#0a0a0f]/90 to-[#0f0f15]/90 via-[#0c0c12]/90 backdrop-blur-md border-2 border-dashed border-purple-500/30 rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:scale-105 hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-500/20 min-h-[280px]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <div className="relative z-10 flex flex-col items-center justify-center h-full">
                        <div className="w-16 h-16 bg-slate-800/40 border border-purple-500/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-slate-800/50 transition-all duration-300">
                          <i className="bi bi-plus text-purple-400 text-2xl font-bold group-hover:text-purple-300"></i>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-3 text-center group-hover:text-purple-300 transition-colors duration-300">
                          {projects.length === 0
                            ? "¡Crea tu primer proyecto!"
                            : "Crear Nuevo Proyecto"}
                        </h3>

                        <p className="text-gray-400 text-sm text-center group-hover:text-gray-300 transition-colors duration-300 mb-4">
                          {projects.length === 0
                            ? "Comienza algo increíble"
                            : "Expande tu espacio de trabajo"}
                        </p>

                        <div className="flex items-center gap-2 text-purple-400/70 text-xs group-hover:text-purple-300 transition-colors duration-300">
                          <i className="bi bi-arrow-right"></i>
                          <span>
                            {projects.length === 0
                              ? "Haz clic para empezar"
                              : "Agregar nuevo proyecto"}
                          </span>
                        </div>

                        <div className="mt-6 w-full h-1 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      <div className="absolute top-4 right-4 w-6 h-6 border border-purple-500/20 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                      <div className="absolute bottom-4 left-4 w-4 h-4 border border-purple-400/15 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
                    </div>
                  )}

                  {!loadingProjects &&
                    filteredProjects.length === 0 &&
                    projects.length > 0 &&
                    searchTerm && (
                      <div className="col-span-full flex justify-center items-center py-20">
                        <div className="text-center max-w-md">
                          <div className="w-24 h-24 bg-slate-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="bi bi-search text-slate-400 text-3xl"></i>
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2">
                            No se encontraron proyectos
                          </h3>
                          <p className="text-gray-400 text-lg">
                            Prueba con otro término de búsqueda
                          </p>
                          <button
                            onClick={() => setSearchTerm("")}
                            className="mt-4 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg transition-colors duration-300"
                          >
                            Limpiar búsqueda
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              </>
            )}
          </div>
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
