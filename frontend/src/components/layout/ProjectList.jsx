import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import useUserStore from "../../stores/useUserStore";

const ProjectList = ({isColaborador =false}) => {
const user = useUserStore((state) => state.user);

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectError, setProjectError] = useState(null);

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
        const uuidSupabase = user?.auth_user_id || user?.id;        
        const response = await axios.get(
          `http://localhost:8000/tasks/api/v1/ProyectoUUID/?uuid_supabase=${uuidSupabase}`
        );
        const projectsData = response.data;
        setProjects(projectsData && projectsData.length > 0 ? projectsData : []);
      } catch (error) {
        console.error("Error al cargar proyectos del usuario:", error);
        setProjectError(error.message || "Error al cargar proyectos.");
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchUserProjects();
  }, [user]);

  if (!user) {
    return (
      <ul className="text-sm text-gray-300 pl-2">
        <li>Cargando proyectos...</li>
      </ul>
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

  return (
    <ul className="text-sm text-gray-300 pl-2">
      {projects.map((project) => (
        <li key={project.id_proyecto}>
          <div>
            <a
              onClick={() =>
                window.open(`/dashboard/${project.id_proyecto}`, "_blank")
              }
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