import React from "react";
import BackButton from "../common/BackButton";

const ProfileHeader = ({ onBackClick }) => {
  return (
    <div className="w-full max-w-5xl flex flex-col gap-4 mb-8 px-4">
      <div className="flex items-center text-sm text-gray-400">
        <span>Dashboard</span>
        <i className="bi bi-chevron-right mx-2"></i>
        <span className="text-purple-400">Mi Perfil</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton
            className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-[#232336] to-[#2d2d44] hover:from-[#2d2d44] hover:to-[#383856] text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
            iconClassName="text-xl"
            onClick={onBackClick}
          />
          <div>
            <h2 className="text-3xl font-bold text-white">Editar perfil</h2>
            <p className="text-gray-400 mt-1">
              Actualiza tu información personal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Perfil Activo</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
