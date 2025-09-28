import React from "react";
import PasswordInput from "../common/PasswordInput";
import Button from "../common/Button";
import PasswordValidationIndicator from "./PasswordValidationIndicator";

const SecurityCard = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  canSave,
  onPasswordUpdate,
  onDisabledClick,
}) => {
  return (
    <div className="bg-gradient-to-br from-[#08080e]/95 to-[#0c0c14]/95 via-[#0a0a12]/95 backdrop-blur-md border border-slate-800/40 rounded-3xl px-9 py-8 w-full shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
          <i className="bi bi-shield-lock-fill text-red-400 text-xl"></i>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Seguridad</h3>
          <p className="text-gray-400 text-sm">Actualiza tu contraseña</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-gray-300 text-sm font-medium">
            Nueva Contraseña
          </label>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu nueva contraseña"
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:border-slate-600/60"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-gray-300 text-sm font-medium">
            Confirmar Contraseña
          </label>
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirma tu contraseña"
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:border-slate-600/60"
          />
        </div>
      </div>

      <PasswordValidationIndicator password={password} />

      <div className="flex justify-end mt-6">
        <Button
          type="submit"
          disabled={!canSave}
          className={`
            px-8 py-3 rounded-xl font-semibold transition-all duration-200
            ${
              canSave
                ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-purple-500/25 hover:scale-105"
                : "bg-slate-700/50 text-gray-400 cursor-not-allowed opacity-50"
            }
          `}
          onClick={canSave ? onPasswordUpdate : onDisabledClick}
        >
          <i className="bi bi-check-circle-fill mr-2"></i>
          Actualizar Contraseña
        </Button>
      </div>
    </div>
  );
};

export default SecurityCard;
