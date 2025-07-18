import React, { useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import CreateProjectPanel from "../components/layout/CreateProjectPanel";
import ProjectList from "../components/layout/ProjectList";
import useUserStore from "../stores/useUserStore";

const DashboardCreateProject = () => {
  const user = useUserStore((state) => state.user);
  useEffect(() => {
    const hasRefreshed = localStorage.getItem("hasRefreshed");
    if (user && !hasRefreshed) {
      localStorage.setItem("hasRefreshed", "true");
      window.location.reload();
    }
  }, [user]);
  let projectsBlock = null;

  if (!user) {
    projectsBlock = <div className="text-white p-4">Cargando usuario...</div>;
  } else if (user.rol_idRol === 1) {
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
  } else if (user.rol_idRol === 2) {
    projectsBlock = (
      <div>
        <h3 className="font-semibold mb-2 text-white">
          Mis Proyectos (Colaborador)
        </h3>
        <ProjectList isColaborador={true} />
      </div>
    );
  } else {
    projectsBlock = (
      <div>
        <h3 className="font-semibold mb-2 text-white">
          Mis Proyectos (Colaborador)
        </h3>
        <p className="text-sm text-gray-400">
          Aún no formas parte de ningún proyecto.
          <br />
          Pide acceso a un administrador.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-950">
      <Sidebar
        showLogo={true}
        showProjectsBlock={true}
        projectsBlock={projectsBlock}
      />
      <div className="ml-72 flex-1 flex flex-col">
        {" "}
        {/* Agregué ml-72 aquí */}
        <div className="pt-4 px-6">
          <Navbar
            showShareButton={false}
            showUpgradeButton={true}
            title="Proyectos"
            subtitle="Organiza tus espacios de trabajo."
          />
        </div>
        <div className="flex-1 px-8 pb-8 pt-2">
          <CreateProjectPanel disableCreate={user?.rol_idRol === 2} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCreateProject;
