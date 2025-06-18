import React, { use } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import CreateProjectPanel from "../components/layout/CreateProjectPanel";
import ProjectList from "../components/layout/ProjectList";
import { useUserRole } from "../hooks/useUserRole";

const DashboardCreateProject = () => {
  const {userRole,isAdmin, isLoading, error} = useUserRole();

  let projectsBlock = null;

  if (isLoading) {
    projectsBlock = (
      <div className="text-white p-4">Cargando proyectos...</div>
    );
  } else if (error) {
    projectsBlock = (
      <div className="text-red-500 p-4">Error al cargar el rol del usuario.</div>
    );
  } else if (isAdmin()) {
    projectsBlock = (
      <div className="mb-8">
        <h3 className="font-semibold mb-2 text-white">Mis Proyectos (Admin)</h3>
        <ProjectList isColaborador={false} />
        <ul className="text-sm text-gray-300 list-decimal list-inside pl-2 mt-2">
          <li className="cursor-pointer hover:text-[#7c2ae8]">
            Haz clic en "Nuevo Proyecto"
          </li>
        </ul>
      </div>
    );
  }else if (userRole === 2) {
    projectsBlock = (
      <div>
        <h3 className="font-semibold mb-2 text-white">Mis Proyectos (Colaborador)</h3>
        <ProjectList isColaborador={true} />
      </div>
    )
  }else {
    projectsBlock = (
      <div>
        <h3 className="font-semibold mb-2 text-white">Mis Proyectos (Colaborador)</h3>
        <p className="text-sm text-gray-400">
          Aún no formas parte de ningún proyecto.<br />
          Pide acceso a un administrador.
        </p>
      </div>
    );
  } 

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-gray-950 to-zinc-950 ">
      <Sidebar
        showLogo={true}
        showProjectsBlock={true}
        projectsBlock={projectsBlock}
      />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1">
          <CreateProjectPanel disableCreate={userRole === 2} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCreateProject;