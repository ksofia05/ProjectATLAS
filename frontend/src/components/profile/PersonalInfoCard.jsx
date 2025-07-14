import React from "react";
import Input from "../common/Input";

const PersonalInfoCard = ({ nombres, apellidos, correo }) => {
  return (
    <div className="bg-gradient-to-br from-[#181825] via-[#1e1e2e] to-[#232335] border border-gray-700/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
          <i className="bi bi-person-fill text-purple-400 text-xl"></i>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Información Personal</h3>
          <p className="text-gray-400 text-sm">Datos básicos de tu cuenta</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-gray-300 text-sm font-medium">
            Nombres
          </label>
          <Input
            value={nombres}
            readOnly
            className="bg-gray-800/50 border-gray-600/50 text-gray-300 cursor-not-allowed"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-gray-300 text-sm font-medium">
            Apellidos
          </label>
          <Input
            value={apellidos}
            readOnly
            className="bg-gray-800/50 border-gray-600/50 text-gray-300 cursor-not-allowed"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="block text-gray-300 text-sm font-medium">
            Correo Electrónico
          </label>
          <Input
            value={correo}
            readOnly
            className="bg-gray-800/50 border-gray-600/50 text-gray-300 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoCard;
