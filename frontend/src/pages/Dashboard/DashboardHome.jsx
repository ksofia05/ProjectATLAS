import React, { useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { Outlet, useParams } from "react-router-dom";
import useUserStore from "../../stores/useUserStore";
import useCollaboratorsStore from "../../stores/useCollaboratorsStore";
import useProjectStore from "../../stores/useProjectsStore";
import { useProjectAccess } from "../../hooks/useProjectAccess";
import Loader from "../../components/common/Loader";

const DashboardLayout = () => {
  const user = useUserStore((state) => state.user);
  const { isValidating, hasAccess } = useProjectAccess();
  const { id: projectId } = useParams(); // Renombrar para claridad

  // Pre-cargar (zustand) datos del proyecto y colaboradores
  const { fetchProjectInfo } = useProjectStore();
  const { fetchCollaborators } = useCollaboratorsStore();

  // Pre-cargar datos cuando ingresa al dashboard
  useEffect(() => {
    if (projectId && user && !isValidating && hasAccess) {
      console.log("Pre-cargando datos del proyecto:", projectId);

      // Cargar en paralelo
      Promise.all([
        fetchProjectInfo(projectId),
        fetchCollaborators(projectId)
      ]).then(() => {
        console.log("Datos pre-cargados exitosamente");
      }).catch(error => {
        console.error("Error pre-cargando datos:", error);
      });
    }
  }, [projectId, user, isValidating, hasAccess, fetchProjectInfo, fetchCollaborators]);

  // Debido a complicaciones, tuve que obtener el nombre del usuario de diferentes maneras xd
  const firstName =
    user?.user_metadata?.nombre?.split(" ")[0] ||
    user?.nombre?.split(" ")[0] ||
    "";

  const baseMenuItems = [
    {
      label: "Dashboard",
      icon: "bi bi-house-fill",
      to: `/dashboard/${projectId}`,
    },
    {
      label: "Calendario",
      icon: "bi bi-calendar-event",
      to: `/dashboard/${projectId}/calendario`,
    },
    {
      label: "Cliente / Inventario",
      icon: "bi bi-archive-fill",
      to: `/dashboard/${projectId}/inventario`,
    },
  ];

  const adminOnlyItem = {
    label: "Colaboradores",
    icon: "bi bi-people-fill",
    to: `/dashboard/${projectId}/colaboradores`,
  };

  const getMenuItems = () => {
    const rol = user?.rol_idRol ?? user?.rol_idrol;
    if (rol === 2) {
      return baseMenuItems;
    }
    if (rol === 1) {
      return [
        ...baseMenuItems.slice(0, 2),
        adminOnlyItem,
        ...baseMenuItems.slice(2),
      ];
    }
    return baseMenuItems;
  };

  // Estamos mostrando el loader mientras validamos el acceso
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f15]">
        <Loader text="Validando acceso..." />
      </div>
    );
  }

  // No renderizar nada si no tiene acceso
  if (!hasAccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar showLogo={true} menuItems={getMenuItems()} footerLinks={true} />
      <div className="ml-72 flex flex-col min-h-screen">
        {/* Navbar flotante con margen igual al contenido */}
        <div className="sticky top-0 z-10 pt-6 bg-slate-950">
          <div className="px-8">
            <Navbar
              showShareButton={true}
              showUpgradeButton={false}
              title={`Bienvenido/a${firstName ? " " + firstName : ""}`}
              subtitle="Aquí, Las estadísticas de esta semana!"
            />
          </div>
        </div>
        {/* Unico apartado donde hay scroll de manera general */}
        <div className="flex-1 px-8 pb-6 pt-4 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
