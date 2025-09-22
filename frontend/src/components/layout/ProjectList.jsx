import React, { useState, useEffect } from "react";
import axios from "axios";
import { openDashboardIfActive } from "../../utils/openDashboardIfActive";
import { showLoadingToast } from "../common/popUp/Loading";
import { useAuth } from "../../context/AuthProvider";
import toast from "react-hot-toast";
import useUserStore from "../../stores/useUserStore";
import { API_BASE } from "../../api/apiBase";

// import { API } from '../src/api/usuario.api';

// export const API = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

// // Crea una instancia reutilizable
// const api = axios.create({
//   baseURL: API,
//   // withCredentials: true, // descomenta si usas cookies/CSRF
// });

const ProjectList = ({ isColaborador = false, refreshProjects }) => {
  const { userProfile, isLoading } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectError, setProjectError] = useState(null);
  const [projectStates, setProjectStates] = useState({});

  const user = useUserStore((state)=>state.user);

  useEffect(() => {
    const fetchUserProjects = async () => {
      if (!user) {
        setLoadingProjects(false);
        setProjects([]);
        setProjectError(null);
        return;
      }

      setLoadingProjects(true);
      setProjectError(null);
      setProjects([]);

      try {
        const email =
          userProfile?.correoElectronico ||
          user?.correoElectronico ||
          user?.email;

        if (!email) {
          setProjects([]);
          setLoadingProjects(false);
          return;
        }
        console.log("API_BASE:", API_BASE);
        console.log("URL final:", `${API_BASE}tasks/api/v1/usuarios/?correoelectronico=${email}`);
        const usuarioResponse = await axios.get(
          `${API_BASE}tasks/api/v1/usuarios/?correoelectronico=${email}`
        );
        const usuarioDb = usuarioResponse.data[0];
        if (!usuarioDb || !usuarioDb.idusuario) {
          setProjects([]);
          setLoadingProjects(false);
          return;
        }

        const usuarioId = usuarioDb.idusuario;

        if (usuarioDb.rol_idrol === 1) {
          const proyectosResponse = await axios.get(
            `${API_BASE}tasks/api/v1/Proyecto/?id_usuario=${usuarioId}`
          );
          setProjects(proyectosResponse.data);
        } else if (usuarioDb.rol_idrol === 2) {
          const colaboradorResponse = await axios.get(
            `${API_BASE}tasks/api/v1/proyectos_colaboradores/?id_usuario=${usuarioId}`
          );
          const proyectos = colaboradorResponse.data.proyectos || [];
          setProjects(proyectos);

          const estados = {};
          for (const proyecto of proyectos) {
            try {
              const res = await axios.get(
                `${API_BASE}tasks/api/v1/filtro_colaborador/?id_proyecto=${proyecto.id_proyecto}`
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
        console.error("Error al cargar proyectos del usuario:", error);
        setProjectError(error.message || "Error al cargar proyectos.");
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchUserProjects();
  }, [user, userProfile, refreshProjects]);

  if (!user) {
    return (
      <ul className="text-sm text-gray-300 pl-2">
        <li>Cargando proyectos...</li>
      </ul>
    );
  }

  // Loader mientras carga
  if (loadingProjects) {
    return (
      <div className="text-gray-400 pl-2 animate-pulse">
        <p>Cargando proyectos...</p>
      </div>
    );
  }

  if (projectError) {
    return (
      <ul className="text-sm text-red-400 pl-2">
        <li>Error al cargar proyectos: {projectError}</li>
      </ul>
    );
  }

  if (projects.length === 0) {
    return (
      <ul className="text-sm text-gray-300 list-decimal list-inside pl-2">
        <li>Sin proyectos aún</li>
        <li>Invita a tu equipo</li>
        <li>¡A trabajar!</li>
      </ul>
    );
  }

  const handleProjectClick = async (project) => {
    if (!user || (!user.idUsuario && !user.idusuario)) {
      toast.error("Usuario no cargado. Intenta de nuevo.");
      return;
    }
    if(userProfile?.rol_idrol===1){
      window.open(`/dashboard/${project.id_proyecto}`, "_blank");
      return;
    }
    const toastId=showLoadingToast("Verificando acceso...");
    try{
      await openDashboardIfActive(project.id_proyecto,user,toastId);
    } finally{
      toast.dismiss(toastId);
    }
  };

  return (
    <ul className="text-sm text-gray-300 pl-2">
      {projects.map((project) => (
        <li key={project.id_proyecto}>
          <div>
            <a
              onClick={async ()=>{
                if (!user || !userProfile ){
                  return;
                }
                await handleProjectClick(project);
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#7c2ae8] underline cursor-pointer"
            >
              {project.nombreproyecto}
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ProjectList;
