import React from "react";
import { useNavigate } from "react-router-dom";
import {client} from '../../supabase/client'
import { useAuth } from "../../hooks/useAuth";
import ButtonGrey from "../common/ButtonGrey";

const UserMenu = ({ visible, onClose }) => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const handleLogout = async () => {
    try{
      const { error } = await client.auth.signOut();
      if (error) {
        console.error("Error al cerrar sesión:", error);
        return;
      }
      localStorage.removeItem('token');
      localStorage.clear();
      if(onClose) onClose();
      navigate('/iniciar-sesion', {replace: true})
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const getUserName = () => {
    if(!user) return "Loading...";
    const metaData = user.user_metadata;
    return `${metaData.nombre} ${metaData.apellido}`
  };

  const getUserEmail = () => {
    if(!user) return "Loading...";
    const metaData = user.user_metadata;
    return metaData.email;
  }

  if (!visible) return null;

  return (
        <div className="absolute right-0 top-14 z-50 w-80 bg-gradient-to-br from-[#29293f] via-[#1d1d2c] via-[#1a1a27] via-[#1a1a27] to-[#1a1a27] rounded-2xl shadow-2xl border border-gray-700 p-4">
      {/* Perfil */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg" //esto tambien hay que cambiarlo xd
          alt="Usuario"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="text-lg font-semibold text-white">{getUserName()}</div>
          <div className="text-xs text-gray-400"> {getUserEmail()} </div>
        </div>
        <ButtonGrey onClick={() => navigate("/perfil")}>Ver perfil</ButtonGrey>
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