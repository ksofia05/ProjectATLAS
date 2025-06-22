import React, { useState, useEffect } from "react";
import construccionImg from "../../assets/LogoSinProyecto.png";
import ModalNewProject from "../layout/ModalNewProject";
import axios from "axios";
import Searchbar from "./Searchbar";
import CardProjects from "../layout/cardProjects";
import useUserStore from "../../stores/useUserStore";
import { showLoadingToast } from "../common/popUp/Loading";
import { openDashboardIfActive } from "../../utils/openDashboardIfActive"; // Ajusta la ruta si es necesario

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
      const email = user?.correoElectronico || user?.user_metadata?.correoElectronico;
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
              estados[proyecto.id_proyecto] = colaborador ? colaborador.estado : "Inactivo";
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
    project =>
      project.nombreproyecto &&
      project.nombreproyecto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Maneja el clic en un proyecto
  const handleProjectClick = async (project) => {
    const toastId = showLoadingToast("Verificando acceso...");
    try {
      await openDashboardIfActive(project.id_proyecto, user, toastId); // <-- PASA EL toastId AQUÍ
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-10 px-4">
      <div className="bg-gradient-to-tr from-[#181825] via-[#181825] to-[#29293f] border border-gray-700 rounded-2xl shadow-2xl px-14 py-10 w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2 text-left">
          Hola, {getUserDisplayName()} <span className="text-2xl">👋</span>
        </h2>
        <p className="text-lg text-gray-300 mb-8 text-left">
          Organiza tus espacios de trabajo.
        </p>

        {/* Searchbar */}
        <div className="mb-8">
          <Searchbar
            placeholder="Busca un proyecto por nombre..."
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredProjects={filteredProjects}
          />
        </div>

        {/* Botón de nuevo proyecto */}
        <div className="flex mb-10">
          <button
            className={`flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg text-xl transition
              ${disableCreate ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !disableCreate && setModalOpen(true)}
            disabled={disableCreate}
          >
            <i className="bi bi-plus-circle text-2xl"></i>
            Nuevo Proyecto
          </button>
        </div>

        {/* Este es */}
        {!loadingProjects ? (
          projects.length === 0 ? (
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
            </div>
          ) : filteredProjects.length > 0 ? (
            <CardProjects
              projects={filteredProjects}
              projectStates={projectStates}
              isColaborador={user?.rol_idrol === 2}
              onProjectClick={handleProjectClick}
            />
          ) : (
            <div className="border-2 border-dashed border-[#7c2ae8] rounded-2xl p-12 flex flex-col items-center bg-[#232336]">
              <h3 className="text-2xl font-bold text-white mb-2 text-center">
                No se encontraron proyectos
              </h3>
              <p className="text-gray-300 text-center text-lg">
                Prueba con otro nombre o revisa tu búsqueda.
              </p>
            </div>
          )
        ) : (
          <div className="border-2 border-dashed border-[#7c2ae8] rounded-2xl p-12 flex flex-col items-center bg-[#232336]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-gray-300 text-center text-lg">
              Cargando tus proyectos...
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