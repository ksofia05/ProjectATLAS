import React, { useEffect, useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import CreateProjectPanel from "../components/layout/CreateProjectPanel";
import ProjectList from "../components/layout/ProjectList";
import { useAuth } from "../context/AuthProvider";
import WarningModal from "../components/dashboard/WarningModal";

const DashboardCreateProject = () => {
    const { user, userProfile, isLoading, isAuthenticated, recheckAuth } = useAuth();
    const [refreshProjects, setRefreshProjects] = React.useState(0);
    const [showProjectLimitModal, setShowProjectLimitModal]=React.useState(false);
    const [projectLimitMessage, setProjectLimitMessage]=React.useState("");
    const [showInstructionsModal, setShowInstructionsModal] = React.useState(false);
    console.log("Estado en DashboardCreateProject:", {
      user,
      userProfile, 
      isLoading, 
      isAuthenticated 
    });
    useEffect(()=> {
      const shouldShow = localStorage.getItem("showProjectLimitModal");
      const message = localStorage.getItem("projectLimitMessage");
      if (shouldShow === "1"){
        setShowProjectLimitModal(true);
        setProjectLimitMessage(
          message || "Actualmente ya formas parte de otro proyecto. Si deseas unirte a este, primero debes eliminar tu proyecto actual desde la sección de proyectos. Luego vuelve a aceptar la invitación."
        );
        localStorage.removeItem("showProjectLimitModal");
        localStorage.removeItem("projectLimitMessage");
      }
    }, []);

    
  useEffect(()=>{
    window.refreshUserAndProjects=async()=>{
      setRefreshProjects((prev) => prev + 1);
    };
    return()=> {window.refreshUserAndProjects=null;};
  }, []);

  let projectsBlock = null;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
      setIsSidebarOpen(false);
    };

  if (!userProfile) {
    projectsBlock = <div className="text-white p-4">Cargando usuario...</div>;
  } else if (userProfile.rol_idRol === 1) {
    projectsBlock = (
      <div className="mb-8">
        <h3 className="font-semibold mb-2 text-white">Mis Proyectos (Admin)</h3>
        <ProjectList isColaborador={false} refreshProjects={refreshProjects} />
        <ul className="text-sm text-gray-300 list-decimal list-inside pl-2 mt-2">
          <li className="cursor-pointer hover:text-[#7c2ae8]">
            Haz clic en "Nuevo Proyecto"
          </li>
        </ul>
      </div>
    );
  } else if (userProfile.rol_idRol === 2) {
    projectsBlock = (
      <div>
        <h3 className="font-semibold mb-2 text-white">
          Mis Proyectos (Colaborador)
        </h3>
        <ProjectList
          isColaborador={userProfile.rol_idRol === 2}
          refreshProjects={refreshProjects}   
        />
      </div>
    );
  } else {
    projectsBlock = (
      <div>
        <h3 className="font-semibold mb-2 text-white">
          Mis Proyectos 
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
    <div className="min-h-screen flex bg-black">
      <WarningModal
        visible={showProjectLimitModal}
        title="No puedes unirte a este proyecto"
        message={projectLimitMessage}
        confirmText="Cerrar"
        onClose={()=>{
          setShowProjectLimitModal(false)
          setTimeout(()=> setShowInstructionsModal(true),200);
        }}
        showCloseIcon={false}
      />
      <WarningModal
        visible={showInstructionsModal}
        title="¿Qué debes hacer ahora?"
        message="Debes eliminar el proyecto al que ya perteneces desde la sección de proyectos. Luego, cierra sesión y vuelve a ingresar desde el enlace de invitación que recibiste."
        confirmText="Entendido"
        onClose={() => setShowInstructionsModal(false)}
        showCloseIcon={false}
      />
      <Sidebar
        showLogo={true}
        showProjectsBlock={true}
        projectsBlock={projectsBlock}
        refreshProjects={refreshProjects}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />
      <div className="sm:ml-0 md:ml-0 lg:ml-72 flex-1 flex flex-col">
        {" "}
        {/* Agregué ml-72 aquí */}
        <div className="pt-4 px-6">
          <Navbar
            showShareButton={false}
            showUpgradeButton={true}
            title="Proyectos"
            subtitle="Organiza tus espacios de trabajo."
            onSidebarToggle={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
        </div>
        <div className="flex-1 sm:p-0 px-8 pb-8 pt-2">
          <CreateProjectPanel disableCreate={userProfile?.rol_idRol === 2}
          onProjectUpdate={() => setRefreshProjects((prev) => prev + 1)}
          refreshProjects={refreshProjects}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardCreateProject;
