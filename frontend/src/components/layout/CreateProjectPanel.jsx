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
import { API_BASE } from "../../api/apiBase";

const CreateProjectPanel = ({ disableCreate ,refreshProjects }) => {
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
      const email = user?.correoElectronico || user?.user_metadata?.correoElectronico;
      try {
        if (!user || !email) {
          setProjects([]);
          setLoadingProjects(false);
          setUserRole(null);
          return;
        }
        // 1. Obtener el usuario por correo electrónico
        const usuarioResponse = await axios.get(
          `${API_BASE}tasks/api/v1/usuarios/?correoelectronico=${email}`
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
          // Admin
          const proyectosResponse = await axios.get(
            `${API_BASE}tasks/api/v1/Proyecto/?id_usuario=${usuarioId}`
          );
          setProjects(proyectosResponse.data);
        } else if (usuarioDb.rol_idrol === 2) {
          // Colaborador
          const colaboradorResponse = await axios.get(
            `${API_BASE}tasks/api/v1/proyectos_colaboradores/?id_usuario=${usuarioId}`
          );
          const proyectos = colaboradorResponse.data.proyectos || [];
          setProjects(proyectos);

          // Consultar el estado de cada proyecto
          const estados = {};
          for (const proyecto of proyectos) {
            try {
              const res = await axios.get(
                `${API_BASE}tasks/api/v1/filtro_colaborador/?id_proyecto=${proyecto.id_proyecto}`
              );
              const colaborador = res.data.colaboradores.find(
                (c) => c.correo === email
              );
              estados[proyecto.id_proyecto] = colaborador ? colaborador.estado : "Inactivo";
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
  const isColaborador = userRole === 2;
  const hasProjects= projects.length>0;
  const shouldDisableCreate = isColaborador && hasProjects;

  const handleCreate = (nuevoProyecto) => {
    setProjects((prevProjects) => [...prevProjects, nuevoProyecto]);
  };

  const getUserDisplayName = () => {
    return user?.nombre || user.email || "Usuario";
  };

  const filteredProjects = projects.filter(
    project =>
      project.nombreproyecto &&
      project.nombreproyecto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  const handleProjectClick = async (project) => {
    if (user?.rol_idrol === 1 || user?.rol_idRol === 1) { //La validacion solo se le aplica a los colaboradores
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
  console.log("userRole:", user?.rol_idrol);
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-6 sm:py-8 md:py-10 px-4">
      <div className="bg-gradient-to-tr from-[#181825] via-[#181825] to-[#29293f] border border-gray-700 rounded-2xl shadow-2xl px-6 sm:px-10 md:px-14 py-6 sm:py-8 md:py-10 w-full max-w-sm sm:max-w-4xl md:max-w-6xl">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-2 text-left">
          Hola, {getUserDisplayName()} <span className="text-lg sm:text-xl md:text-2xl">👋</span>
        </h2>
        <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-7 md:mb-8 text-left">
          Organiza tus espacios de trabajo.
        </p>

        {/* Searchbar */}
        <div className="mb-6 sm:mb-7 md:mb-8">
          <Searchbar
            placeholder="Busca un proyecto por nombre..."
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredProjects={filteredProjects}
          />
        </div>

        {/* Botón de nuevo proyecto */}
        <div className="flex mb-8 sm:mb-9 md:mb-10">
          <button
            className={`flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-xl shadow-lg text-base sm:text-lg md:text-xl transition
              ${shouldDisableCreate ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !shouldDisableCreate && setModalOpen(true)}
            disabled={shouldDisableCreate}
          >
            <i className="bi bi-plus-circle text-lg sm:text-xl md:text-2xl"></i>
            <span className="hidden sm:inline">Nuevo Proyecto</span>
          </button>
        </div>

        {/* Listado de proyectos o loader de carga */}
        {loadingProjects ? (
          <div className="border-2 border-dashed border-[#7c2ae8] rounded-2xl p-8 sm:p-10 md:p-12 flex flex-col items-center bg-[#232336]">
            <Loader text="Cargando tus proyectos..." />
          </div>
        ) : projects.length === 0 || userRole === null? (
          <div className="border-2 border-dashed border-[#7c2ae8] rounded-2xl p-8 sm:p-10 md:p-12 flex flex-col items-center bg-[#232336]">
            <img
              src={construccionImg}
              alt="Sin proyectos"
              className="w-24 sm:w-28 md:w-32 mb-4 sm:mb-5 md:mb-6"
            />
            <h3 className="text-xl sm:text-xl md:text-2xl font-bold text-white mb-2 text-center">
              Sin proyectos creados
            </h3>
            <p className="text-gray-300 text-center text-base sm:text-lg">
              Crea tu primer proyecto para comenzar a colaborar con tu equipo.
            </p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <CardProjects
            projects={filteredProjects}
            projectStates={projectStates}
            userRole={userRole}
            onProjectClick={handleProjectClick}
            onProjectsUpdate={()=>{
              if (onProjectsUpdate) {
                setTimeout(()=>onProjectsUpdate(),500)
              };
            }}
          />
        ) : (
          <div className="border-2 border-dashed border-[#7c2ae8] rounded-2xl p-8 sm:p-10 md:p-12 flex flex-col items-center bg-[#232336]">
            <h3 className="text-xl sm:text-xl md:text-2xl font-bold text-white mb-2 text-center">
              No se encontraron proyectos
            </h3>
            <p className="text-gray-300 text-center text-base sm:text-lg">
              Prueba con otro nombre o revisa tu búsqueda.
            </p>
          </div>
        )}
      </div>

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