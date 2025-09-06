import React, { useState, useEffect } from "react";
import construccionImg from "../../assets/LogoSinProyecto.png";
import ModalNewProject from "../layout/ModalNewProject";
import axios from "axios";
import Searchbar from "./Searchbar";
import CardProjects from "../layout/cardProjects";
import useUserStore from "../../stores/useUserStore";
import { showLoadingToast } from "../common/popUp/Loading";
import { openDashboardIfActive } from "../../utils/openDashboardIfActive";
import Loader from "../common/Loader";

const CreateProjectPanel = ({ disableCreate }) => {
  const user = useUserStore((state) => state.user);

  const [modalOpen, setModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectStates, setProjectStates] = useState({});

  useEffect(() => {
    const fetchUserProjects = async () => {
      setLoadingProjects(true);
      const email =
        user?.correoElectronico || user?.user_metadata?.correoElectronico;
      try {
        if (!email) {
          setProjects([]);
          setLoadingProjects(false);
          return;
        }
        // 1. Obtener el usuario por correo electrónico
        const usuarioResponse = await axios.get(
          `http://localhost:8000/tasks/api/v1/usuarios/?correoelectronico=${email}`
        );
        const usuarioDb = usuarioResponse.data[0];
        if (!usuarioDb || !usuarioDb.idusuario) {
          setProjects([]);
          setLoadingProjects(false);
          return;
        }
        const usuarioId = usuarioDb.idusuario;
        if (usuarioDb.rol_idrol === 1) {
          // Admin
          const proyectosResponse = await axios.get(
            `http://localhost:8000/tasks/api/v1/Proyecto/?id_usuario=${usuarioId}`
          );
          setProjects(proyectosResponse.data);
        } else if (usuarioDb.rol_idrol === 2) {
          // Colaborador
          const colaboradorResponse = await axios.get(
            `http://localhost:8000/tasks/api/v1/proyectos_colaboradores/?id_usuario=${usuarioId}`
          );
          const proyectos = colaboradorResponse.data.proyectos || [];
          setProjects(proyectos);

          // Consultar el estado de cada proyecto
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
      } finally {
        setLoadingProjects(false);
      }
    };

    if (user) fetchUserProjects();
  }, [user]);

  const handleCreate = (nuevoProyecto) => {
    setProjects((prevProjects) => [...prevProjects, nuevoProyecto]);
  };

  const getUserDisplayName = () => {
    return user?.nombre || user.email || "Usuario";
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

  const handleCreateNewProject = () => {
    if (!disableCreate) {
      setModalOpen(true);
    }
  };

  console.log("userRole:", user?.rol_idrol);

  return (
    <div className="w-full max-w-7xl mx-auto">
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              Hola, {getUserDisplayName()} <span className="text-2xl">👋</span>
            </h1>
            <p className="text-gray-400 mt-1">
              Organiza tus espacios de trabajo y colabora con tu equipo
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md">
          <Searchbar
            placeholder="🔍 Buscar proyectos..."
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredProjects={filteredProjects}
          />
        </div>
      </div>

      {/* Projects Section */}
      {loadingProjects ? (
        <div className="bg-[#1a1a2e]/30 border border-purple-500/20 rounded-xl p-12 flex flex-col items-center backdrop-blur-sm">
          <Loader text="Cargando tus proyectos..." />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-[#1a1a2e]/30 border border-purple-500/20 rounded-xl p-12 flex flex-col items-center backdrop-blur-sm">
          <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6">
            <img
              src={construccionImg}
              alt="Sin proyectos"
              className="w-12 opacity-60"
            />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 text-center">
            Sin proyectos creados
          </h3>
          <p className="text-gray-400 text-center max-w-md">
            Crea tu primer proyecto para comenzar a colaborar con tu equipo y
            gestionar tus tareas.
          </p>
          {!disableCreate && (
            <button
              onClick={handleCreateNewProject}
              className="mt-6 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
            >
              Crear mi primer proyecto
            </button>
          )}
        </div>
      ) : filteredProjects.length > 0 || !disableCreate ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          <CardProjects
            projects={filteredProjects}
            projectStates={projectStates}
            userRole={user?.rol_idrol}
            onProjectClick={handleProjectClick}
            onCreateClick={handleCreateNewProject}
            disableCreate={disableCreate}
            onProjectsUpdate={() => {
              if (onProjectsUpdate) {
                setTimeout(() => onProjectsUpdate(), 500);
              }
            }}
          />
        </div>
      ) : (
        <div className="bg-[#1a1a2e]/30 border border-yellow-500/20 rounded-xl p-12 flex flex-col items-center backdrop-blur-sm">
          <div className="w-16 h-16 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-4">
            <i className="bi bi-search text-2xl text-yellow-400"></i>
          </div>
          <h3 className="text-xl font-bold text-white mb-2 text-center">
            No se encontraron proyectos
          </h3>
          <p className="text-gray-400 text-center">
            Prueba con otro nombre o revisa tu búsqueda.
          </p>
        </div>
      )}

      {/* Modal para crear un nuevo proyecto */}
      <ModalNewProject
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default CreateProjectPanel;
