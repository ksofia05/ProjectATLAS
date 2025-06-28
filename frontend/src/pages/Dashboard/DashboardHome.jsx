import React from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { Outlet, useParams } from "react-router-dom";
import useUserStore from "../../stores/useUserStore";

const DashboardLayout = () => {
  const user = useUserStore((state) => state.user);
  console.log("USER EN DASHBOARD:", user);

  // Debido a complicaciones, tuve que obtener el nombre del usuario de diferentes maneras xd
  const firstName =
    user?.user_metadata?.nombre?.split(" ")[0] ||
    user?.nombre?.split(" ")[0] ||
    "";

  const { id } = useParams();

  const baseMenuItems = [
    { label: "Dashboard", icon: "bi bi-house-door-fill", to: `/dashboard/${id}` },
    { label: "Calendario", icon: "bi bi-calendar-event", to: `/dashboard/${id}/calendario` },
    { label: "Cliente / Inventario", icon: "bi bi-archive-fill", to: `/dashboard/${id}/inventario` },
  ];
  const adminOnlyItem = {
    label: "Colaboradores",
    icon: "bi bi-people-fill",
    to: `/dashboard/${id}/colaboradores`
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
        ...baseMenuItems.slice(2)
      ];
    }
    return baseMenuItems;
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-gray-950 to-zinc-950 ">
      <Sidebar showLogo={true} menuItems={getMenuItems()} footerLinks={true}/>
      <div className="flex-1 flex flex-col">
        <Navbar
          showShareButton={true}
          showUpgradeButton={false}
          title={`Bienvenido/a${firstName ? " " + firstName : ""}`}
          subtitle="Aquí, Las estadísticas de esta semana!"
        />
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;