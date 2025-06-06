import React, { useState, useEffect } from "react";
import construccionImg from "../../assets/LogoSinProyecto.png";
import ModalNewProject from "../layout/ModalNewProject";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import Searchbar from "./Searchbar";
import CardProjects from "../layout/cardProjects";

const CreateProjectPanel = ({ onCreate }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isAuthenticated, isLoading } = useAuth();

useEffect(() => {
  const fetchUserProjects = async () => {
    console.log("Ejecutando fetchUserProjects");
    console.log("user:", user);

    // Obtener el correo electrónico del usuario
    const email = user?.email || user?.user_metadata?.email;
    console.log("email:", email);

    try {
      setLoadingProjects(true);

      // Validar si el correo electrónico está disponible
      if (!email) {
        setProjects([]);
        setLoadingProjects(false);
        return;
      }

      // 1. Obtener el usuario por correo electrónico
      const usuarioResponse = await axios.get(
        `http://localhost:8000/tasks/api/v1/usuarios/?correoelectronico=${email}`
      );
      console.log("usuarioResponse.data:", usuarioResponse.data);

      const usuarioDb = usuarioResponse.data[0];

      // Validar si el usuario existe en la base de datos
      if (!usuarioDb || !usuarioDb.idusuario) {
        setProjects([]);
        setLoadingProjects(false);
        return;
      }

      const usuarioId = usuarioDb.idusuario;

      // 2. Obtener los proyectos del usuario por su ID
      console.log("Consultando proyectos para usuarioId:", usuarioId);
      const proyectosResponse = await axios.get(
        `http://localhost:8000/tasks/api/v1/Proyecto/?id_usuario=${usuarioId}`
      );
      console.log("proyectosResponse.data:", proyectosResponse.data);

      // Actualizar el estado con los proyectos obtenidos
      setProjects(proyectosResponse.data);
      console.log("Proyectos recibidos:", proyectosResponse.data);
    } catch (error) {
      console.error("Error al obtener proyectos:", error);
      setProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  };

  // Ejecutar la función solo si el usuario está autenticado
  if (user) fetchUserProjects();
}, [user]);

const handleCreate = (nuevoProyecto) => {
  setProjects((prevProjects) => [...prevProjects, nuevoProyecto]); // Agrega solo el nuevo proyecto
};

  const getUserDisplayName = () => {
    if (!user) return "Usuario";
    return user.user_metadata?.nombre || user.email || "Usuario";
  };

  //  La busqueda del proyecto se realiza por medio de su nombre
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

      {/* Sin proyectos */}
       {!loadingProjects ? (
         filteredProjects.length > 0 ? (
           <CardProjects projects={filteredProjects} />
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