import React, { useState } from 'react';
import { 
  Home, 
  Calendar, 
  Users, 
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';


const Dashboard = () => {

  return (
        <div className="min-h-screen flex bg-gradient-to-b from-gray-950 to-zinc-950 ">
        <Sidebar />
        <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 text-white flex items-center justify-center">
            <h1>Simulacion del dashboard - SOON</h1>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;