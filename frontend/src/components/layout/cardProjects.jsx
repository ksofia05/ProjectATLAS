import React from 'react'
import { Users, Edit, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const InventoryCard = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/dashboard');
  };

  return (
    <button 
      onClick={handleClick}
      className="rounded-2xl p-10 border border-white/50 shadow-lg max-w-sm hover:border-white/70 transition-colors duration-200"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-2xl font-bold font-['Nunito']">Inventario Área Computo</h2>
      </div>
      
      <div className="flex items-center gap-6 mb-3">
        <div className="flex items-center gap-2 text-gray-400">
          <Users size={18} />
          <span className="text-sm">3 Miembros</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Edit size={18} />
          <span className="text-sm">12 Pendientes</span>
        </div>
      </div>
      <hr className="border-gray-700 border-t mb-3" />
      
      <div className="text-gray-400 text-sm">
        <span className="text-white font-medium">Última Actividad:</span> Ayer, 4:24 PM
      </div>
    </button>
  );
};



const CreateProjectCard = () => {

    const handleClick = () => {
    console.log('Click en "Crear nuevo proyecto"');
  };

  return (
    <div className="rounded-2xl px-22 py-8 border-3 border-dashed border-purple-500/50 hover:border-purple-400/70 transition-colors duration-200  flex flex-col items-center justify-center cursor-pointer group" onClick={handleClick}>
      <div className="flex items-center justify-between w-full px-6 mb-4">
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-600/30 transition-colors duration-200">
          <Plus size={24} className="text-purple-400" />
        </div>
        
        <h3 className="text-white text-xl font-semibold mb-2 justify-center">Crear nuevo proyecto</h3>
        <p className="text-gray-400 text-sm">Haz clic para comenzar</p>
      </div>
    </div>
  );
};
 
const CardProjects = () => {
  return (
    <div className="p-0">
      <div className="flex flex-col sm:flex-row gap-10 items-start">
        <InventoryCard />
        <CreateProjectCard />
      </div>
    </div>
  );
};

export default CardProjects;