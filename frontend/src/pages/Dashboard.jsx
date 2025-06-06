import { useParams } from 'react-router-dom';
import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import PendingTasksCard from '../components/dashboard/PendingTasksCard';
import { useUserRole } from '../hooks/useUserRole';

const Dashboard = () => {
  const { id } = useParams();
  const { isAdmin, isLoading, error } = useUserRole();

  // Menú base para todos los usuarios
  const baseMenuItems = [
    { label: "Dashboard", icon: "bi bi-house-door-fill", to: "/dashboard" },
    { label: "Calendario", icon: "bi bi-calendar-event", to: "/dashboard/calendario" },
    { label: "Cliente / Inventario", icon: "bi bi-archive-fill", to: "/dashboard/inventario" },
  ];

  // Elemento exclusivo para admin
  const adminOnlyItem = { 
    label: "Colaboradores", 
    icon: "bi bi-people-fill", 
    to: "/dashboard/colaboradores" 
  };

  // Crear el menú final basado en el rol del usuario
  const getMenuItems = () => {
    if (isLoading) {
      // Mientras carga, mostrar solo el menú base
      return baseMenuItems;
    }
    
    if (isAdmin()) {
      // Si es admin, insertar "Colaboradores" en la posición 2 (después de Calendario)
      return [
        ...baseMenuItems.slice(0, 2),
        adminOnlyItem,
        ...baseMenuItems.slice(2)
      ];
    }
    
    // Si es colaborador, solo mostrar menú base
    return baseMenuItems;
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-gray-950 to-zinc-950 ">
      <Sidebar 
        showLogo={true} 
        menuItems={getMenuItems()} 
        footerLinks={true} 
      />
      <div className="flex-1 flex flex-col">
        <Navbar showShareButton={true} showUpgradeButton={false} />
        <div className="flex-1 p-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Dashboard - Inventario Área Computo
          </h2>
          <p className="text-gray-400 mb-8">
            No puedo creer que estoy haciendo esto a las 4 de la madrugada xd
          </p>
          <div className="flex flex-wrap gap-8 mb-8">
            <PendingTasksCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;