import React from "react";
import { useNavigate } from "react-router-dom";

const UserMenu = ({ visible, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (onClose) onClose();
    navigate("/iniciar-sesion");
  };

  if (!visible) return null;

  return (
    <div className="absolute right-0 top-14 z-50 w-80 bg-[#181825] rounded-2xl shadow-2xl border border-gray-700 p-4">
      {/* Perfil */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg" //esto tambien hay que cambiarlo xd
          alt="Usuario"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="text-lg font-semibold text-white">Luis Nuñez</div>
          <div className="text-xs text-gray-400">yundaluis4@gmail.com</div>
        </div>
        <button
          className="ml-auto bg-gray-800 text-gray-200 px-3 py-1 rounded-lg text-xs whitespace-nowrap hover:bg-[#7c2ae8] hover:text-white transition"
        >
          Ver perfil
        </button>
      </div>

      <hr className="border-gray-700 my-3" />

      {/* Cerrar sesión */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-4 text-white font-semibold px-2 py-2 rounded-lg transition hover:bg-gray-700"
      >
        <i className="bi bi-box-arrow-right text-xl"></i>
        Cerrar sesión
      </button>
    </div>
  );
};

export default UserMenu;