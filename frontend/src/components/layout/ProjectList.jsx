

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; 
import { useAuth } from '../../hooks/useAuth';

const ProjectList = () => {
  const [projects, setProjects] = useState([]); 
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectError, setProjectError] = useState(null);

  const { user, isAuthenticated, isLoading: authLoading } = useAuth(); 

  useEffect(() => {
    const fetchUserProjects = async () => {
      if (authLoading) {
        return;
      }
      if (!isAuthenticated || !user) {
        setLoadingProjects(false);
        setProjects([]);
        setProjectError(null); 
        return;
      }

      setLoadingProjects(true);
      setProjectError(null);
      setProjects([]); 

      try {
       
        const uuidSupabase= user.id;

       
        const response = await axios.get(
          `http://localhost:8000/tasks/api/v1/ProyectoUUID/?uuid_supabase=${uuidSupabase}` 
        );

        const projectsData = response.data;

        if (projectsData && projectsData.length > 0) {
          setProjects(projectsData); 
        } else {
          setProjects([]); 
        }
      } catch (error) {
        console.error('Error al cargar proyectos del usuario:', error);
        setProjectError(error.message || 'Error al cargar proyectos.');
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchUserProjects();
  }, [user, isAuthenticated, authLoading]); 
                                          


  if (authLoading || loadingProjects) {
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


  if (!isAuthenticated || projects.length === 0) {
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
      {projects.map(project => (
        <li key={project.id_proyecto}> {}
          <Link
            to={`/dashboard/${project.id_proyecto}`} 
            className="hover:text-[#7c2ae8] underline"
          >
            {project.nombreproyecto}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ProjectList;