import { useParams } from 'react-router-dom';
import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import PendingTasksCard from '../components/dashboard/PendingTasksCard';

const menuItems = [
  { label: "Dashboard", icon: "bi bi-house-door-fill", to: "/dashboard" },
  { label: "Calendario", icon: "bi bi-calendar-event", to: "/dashboard/calendario" },
  { label: "Colaboradores", icon: "bi bi-people-fill", to: "/dashboard/colaboradores" },
  { label: "Cliente / Inventario", icon: "bi bi-archive-fill", to: "/dashboard/inventario" },
];

const Dashboard = () => {
  const { id } = useParams();
  return (
    <div className="min-h-screen flex bg-gradient-to-b from-gray-950 to-zinc-950 ">
      <Sidebar showLogo={true} menuItems={menuItems} footerLinks={true} />
      <div className="flex-1 flex flex-col">
        <Navbar showShareButton={true} showUpgradeButton={false} />
        <div className="flex-1 p-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Dashbord - Inventario Área Computo
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