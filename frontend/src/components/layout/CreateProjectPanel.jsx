import React, { useState, useEffect } from "react";
import construccionImg from "../../assets/LogoSinProyecto.png";
import ModalNewProject from "./ModalNewProject";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import Searchbar from "./Searchbar";
import InventoryCard from "../cardProjects"; // Ajusta la ruta si es necesario
import CreateProjectCard from "../cardProjects"; // Ajusta la ruta si es necesario

const CreateProjectPanel = ({ onCreate }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        setLoadingProjects(true);
        const response = await axios.get(
          "http://localhost:8000/tasks/api/v1/Proyecto/"
        );
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchUserProjects();
  }, []);

  const handleCreate = (nuevoProyecto) => {
    setModalOpen(false);
    setProjects((prevProjects) => [...prevProjects, nuevoProyecto]); // Agrega el nuevo proyecto
    if (onCreate) onCreate(nuevoProyecto);
  };

  const getUserDisplayName = () => {
    if (!user) return "Usuario";
    return user.user_metadata?.nombre;
  };

  // Filtrar proyectos según el término de búsqueda
  const filteredProjects = projects.filter(project =>
    project.nombreproyecto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        {/* ...loading UI... */}
      </div>
    );
  }

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
            placeholder="Buscar proyecto..."
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredProjects={filteredProjects}
          />
        </div>

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

        {/* Loader solo si está cargando */}
        {loadingProjects && (
          <div className="border-2 border-dashed border-[#7c2ae8] rounded-2xl p-12 flex flex-col items-center bg-[#232336]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-gray-300 text-center text-lg">
              Cargando tus proyectos...
            </p>
          </div>
        )}

        {/* Mostrar SIEMPRE el mensaje de "Sin proyectos creados" */}
        {!loadingProjects && projects.length > 0 ? (
          <div className="flex flex-wrap gap-10">
            {projects.map((project) => (
              <InventoryCard key={project.id} project={project} />
            ))}
            <CreateProjectCard />
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
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateProjectPanel;