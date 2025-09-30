import React, { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import CreateProjectPanel from "../components/layout/CreateProjectPanel";
import ProjectList from "../components/layout/ProjectList";
import { useAuth } from "../context/AuthProvider";
import WarningModal from "../components/dashboard/WarningModal";
import { clearProjectLimitFlags, PROJECT_LIMIT_TTL_MS } from "../utils/projectLimitModal";

const DashboardCreateProject = () => {
  const { user, userProfile } = useAuth();
  const [refreshProjects, setRefreshProjects] = useState(0);
  const [showProjectLimitModal, setShowProjectLimitModal] = useState(false);
  const [projectLimitMessage, setProjectLimitMessage] = useState("");
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const shouldShow = localStorage.getItem("showProjectLimitModal");
    const message = localStorage.getItem("projectLimitMessage");
    const who = (localStorage.getItem("projectLimitWho") || "").toLowerCase();
    const ts = Number(localStorage.getItem("projectLimitTs") || "0");

    const currentEmail =
      (user?.email || user?.correoElectronico || userProfile?.correoElectronico || "").toLowerCase();
      const isCollaborator = userProfile?.rol_idRol === 2;
      const notExpired = ts && Date.now() - ts < PROJECT_LIMIT_TTL_MS;

    if (shouldShow === "1" && !showProjectLimitModal && isCollaborator && notExpired && who === currentEmail) {
      setShowProjectLimitModal(true);
      setProjectLimitMessage(
        message ||
          "Actualmente ya formas parte de otro proyecto. Si deseas unirte a este, primero debes eliminar tu proyecto actual desde la sección de proyectos. Luego vuelve a aceptar la invitación."
      );
    }
    const handler = (e) => {
      const detailEmail = (e?.detail?.email || "").toLowerCase();
      if (!isCollaborator) return;
      if (detailEmail && detailEmail !== currentEmail) return;
      setProjectLimitMessage(
        e?.detail?.message ||
          "Actualmente ya formas parte de otro proyecto. Si deseas unirte a éste, primero elimina el actual."
      );
      setShowProjectLimitModal(true);
    };
    window.addEventListener("projectLimitViolation", handler);
    return () => window.removeEventListener("projectLimitViolation", handler);
  }, [showProjectLimitModal, user, userProfile]);

  useEffect(() => {
    window.refreshUserAndProjects = async () => {
      setRefreshProjects((prev) => prev + 1);
    };
    return () => {
      window.refreshUserAndProjects = null;
    };
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const getProjectsBlock = () => {
    if (!userProfile) {
      return <div className="text-white p-4">Cargando usuario...</div>;
    }
    if (userProfile.rol_idRol === 1) {
      return (
        <div className="mb-8">
          <h3 className="font-semibold mb-2 text-white">
            Mis Proyectos (Admin)
          </h3>
          <ProjectList
            isColaborador={false}
            refreshProjects={refreshProjects}
          />
          <ul className="text-sm text-gray-300 list-decimal list-inside pl-2 mt-2">
            <li className="cursor-pointer hover:text-[#7c2ae8]">
              Haz clic en "Nuevo Proyecto"
            </li>
          </ul>
        </div>
      );
    }
    if (userProfile.rol_idRol === 2) {
      return (
        <div>
          <h3 className="font-semibold mb-2 text-white">
            Mis Proyectos (Colaborador)
          </h3>
          <ProjectList isColaborador={true} refreshProjects={refreshProjects} />
        </div>
      );
    }
    return (
      <div>
        <h3 className="font-semibold mb-2 text-white">Mis Proyectos</h3>
        <p className="text-sm text-gray-400">
          Aún no formas parte de ningún proyecto.
          <br />
          Pide acceso a un administrador.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-black">
      <WarningModal
        visible={showProjectLimitModal}
        title="No puedes unirte a este proyecto"
        message={projectLimitMessage}
        confirmText="Cerrar"
        onClose={() => {
          setShowProjectLimitModal(false);
          clearProjectLimitFlags();
          setTimeout(() => setShowInstructionsModal(true), 200);
        }}
        showCloseIcon={false}
      />
      <WarningModal
        visible={showInstructionsModal}
        title="¿Qué debes hacer ahora?"
        message="Debes eliminar el proyecto al que ya perteneces desde la sección de proyectos. Vuelve a ingresar desde el enlace de invitación que recibiste."
        confirmText="Entendido"
        onClose={() => setShowInstructionsModal(false)}
        showCloseIcon={false}
      />
      <Sidebar
        showLogo={true}
        showProjectsBlock={true}
        projectsBlock={getProjectsBlock()}
        refreshProjects={refreshProjects}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      <div className="sm:ml-0 md:ml-0 lg:ml-72 flex flex-col min-h-screen w-full">
        <CreateProjectPanel
          disableCreate={userProfile?.rol_idRol === 2}
          onProjectUpdate={() => setRefreshProjects((prev) => prev + 1)}
          refreshProjects={refreshProjects}
          onSidebarToggle={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
      </div>
    </div>
  );
};

export default DashboardCreateProject;
