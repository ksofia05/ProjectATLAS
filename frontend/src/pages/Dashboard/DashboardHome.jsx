import React from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useUserRole } from "../../hooks/useUserRole";

 const adminOnlyItem = {
    label: "Colaboradores", 
    icon: "bi bi-people-fill", 
    to: "colaboradores" 
  };
const baseMenuItems = [
    { label: "Dashboard", icon: "bi bi-house-door-fill", to: "." },
    { label: "Calendario", icon: "bi bi-calendar-event", to: "calendario" },
    { label: "Cliente / Inventario", icon: "bi bi-archive-fill", to: "inventario" },
  ];

const DashboardLayout = () => {
  const { user } = useAuth(); 
  const firstName = user?.user_metadata?.nombre?.split(" ")[0] || "";
  const {isAdmin, isLoading, error} = useUserRole();
    const getMenuItems = () => {
    if (isLoading) {
      return baseMenuItems;
    }
    
    if (isAdmin()) {
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