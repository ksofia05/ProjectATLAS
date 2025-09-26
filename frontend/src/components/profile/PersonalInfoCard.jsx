import React from "react";
import Input from "../common/Input";

const PersonalInfoCard = ({ nombres, apellidos, correo }) => {
  return (
    <div className="bg-gradient-to-br from-[#08080e]/95 to-[#0c0c14]/95 via-[#0a0a12]/95 backdrop-blur-md border border-slate-800/40 rounded-3xl px-9 py-8 w-full shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-[1.02] mb-8">
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
            readOnly={true}
            containerClassName="mb-0"
            inputClassName="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:border-slate-600/60 cursor-not-allowed opacity-75"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-gray-300 text-sm font-medium">
            Apellidos
          </label>
          <Input
            value={apellidos}
            readOnly={true}
            containerClassName="mb-0"
            inputClassName="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:border-slate-600/60 cursor-not-allowed opacity-75"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="block text-gray-300 text-sm font-medium">
            Correo Electrónico
          </label>
          <Input
            value={correo}
            readOnly={true}
            containerClassName="mb-0"
            inputClassName="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:border-slate-600/60 cursor-not-allowed opacity-75"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoCard;
