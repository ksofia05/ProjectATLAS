import React from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { Outlet } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", icon: "bi bi-house-door-fill", to: "." },
  { label: "Calendario", icon: "bi bi-calendar-event", to: "calendario" },
  { label: "Colaboradores", icon: "bi bi-people-fill", to: "colaboradores" },
  { label: "Cliente / Inventario", icon: "bi bi-archive-fill", to: "inventario" },
];

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex bg-gradient-to-b from-gray-950 to-zinc-950 ">
      <Sidebar showLogo={true} menuItems={menuItems} footerLinks={true} />
      <div className="flex-1 flex flex-col">
        <Navbar
          showShareButton={true}
          showUpgradeButton={false}
          title="Bienvenido/a"
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