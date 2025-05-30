import { useParams } from 'react-router-dom';
import React, { useState } from 'react';
import { 
  Home, 
  Calendar, 
  Users, 
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';


const Dashboard = () => {
  const { id } = useParams();
  return (
    <div className="min-h-screen flex bg-gradient-to-b from-gray-950 to-zinc-950 ">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 text-white flex items-center justify-center">
          <h1>Simulacion del dashboard - SOON</h1>
          {id && (
            <p className="ml-4 text-lg text-purple-400">Proyecto seleccionado: {id}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;