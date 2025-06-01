import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import CreateProjectPanel from "../components/layout/CreateProjectPanel";
import ProjectList from "../components/layout/ProjectList";

const DashboardCreateProject = () => {
  return (
    <div className="min-h-screen flex bg-gradient-to-b from-gray-950 to-zinc-950 ">
      <Sidebar
        showLogo={true}
        showProjectsBlock={true}
        projectsBlock={
          <>
            <div className="mb-8">
              <h3 className="font-semibold mb-2 text-white">Mis Proyectos (Admin)</h3>
              <ProjectList />
              <ul className="text-sm text-gray-300 list-decimal list-inside pl-2 mt-2">
                <li className="cursor-pointer hover:text-[#7c2ae8]">
                  Haz clic en "Nuevo Proyecto"
                </li>
              </ul>
            </div>
            <hr className="border-t border-[#7c2ae8] opacity-40 my-6" />
            <div>
              <h3 className="font-semibold mb-2 text-white">Mis Proyectos (Colaborador)</h3>
              <p className="text-sm text-gray-400">
                Aún no formas parte de ningún proyecto.<br />
                pide acceso a un administrador.
              </p>
            </div>
          </>
        }
      />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1">
          <CreateProjectPanel />
        </div>
      </div>
    </div>
  );
};

export default DashboardCreateProject;