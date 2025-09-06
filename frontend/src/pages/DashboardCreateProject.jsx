import React, { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import CreateProjectPanel from "../components/layout/CreateProjectPanel";
import ProjectList from "../components/layout/ProjectList";
import { useAuth } from "../context/AuthProvider";

const DashboardCreateProject = () => {
  const { user, userProfile, isLoading, isAuthenticated } = useAuth();
  const [refreshProjects, setRefreshProjects] = React.useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Sidebar content
  let projectsBlock = null;
  if (!userProfile) {
    projectsBlock = <div className="text-white p-4">Cargando usuario...</div>;
  } else if (userProfile.rol_idRol === 1) {
    projectsBlock = (
      <div className="mb-8">
        <h3 className="font-semibold mb-4 text-white">Mis Proyectos</h3>
        <ProjectList isColaborador={false} refreshProjects={refreshProjects} />
      </div>
    );
  } else if (userProfile.rol_idRol === 2) {
    projectsBlock = (
      <div>
        <h3 className="font-semibold mb-4 text-white">Mis Colaboraciones</h3>
        <ProjectList />
      </div>
    );
  } else {
    projectsBlock = (
      <div>
        <h3 className="font-semibold mb-4 text-white">Proyectos</h3>
        <div className="p-4 bg-[#1a1a2e]/50 rounded-lg border border-yellow-500/20">
          <p className="text-sm text-yellow-400 mb-2">⚠️ Sin acceso</p>
          <p className="text-xs text-gray-400">
            Aún no formas parte de ningún proyecto.
            <br />
            Contacta a un administrador para obtener acceso.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      {/* Sidebar */}
      <Sidebar
        showLogo={true}
        showProjectsBlock={true}
        projectsBlock={projectsBlock}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* Contenido principal */}
      <div className="sm:ml-0 md:ml-0 lg:ml-72 flex-1 flex flex-col min-h-screen">
        {/* Navbar */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-[#1a1a2e]/50">
          <Navbar
            showShareButton={false}
            showUpgradeButton={true}
            title="Gestión de Proyectos"
            subtitle="Administra y organiza tus espacios de trabajo"
            onSidebarToggle={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
        </div>

        
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <CreateProjectPanel
            disableCreate={userProfile?.rol_idRol !== 1}
            onProjectUpdate={() => setRefreshProjects((prev) => prev + 1)}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardCreateProject;
