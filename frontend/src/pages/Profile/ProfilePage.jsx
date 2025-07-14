import React from "react";
import SidebarProfile from "../../components/layout/SidebarProfile";
import BackButton from "../../components/common/BackButton";
import Button from "../../components/common/Button";
import PasswordInput from "../../components/common/PasswordInput";
import Input from "../../components/common/Input";
import { useAuth } from "../../hooks/useAuth";
import UpdateProfilePhotoModal from "../../components/layout/UpdateProfilePhotoModal";
import {
  showErrorToast,
  showSuccessToast,
} from "../../components/common/popUp/Loading";
import { client } from "../../supabase/client";
import CancelProfileConfigModal from "./CancelProfileConfigModal";
import { useNavigate } from "react-router-dom";

// Función para validar la contraseña según los requisitos del registro
function isPasswordValid(password) {
  const lengthValid = password.length >= 8;
  const upperCase = /[A-Z]/.test(password);
  const lowerCase = /[a-z]/.test(password);
  const number = /[0-9]/.test(password);
  const special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  return lengthValid && upperCase && lowerCase && number && special;
}

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  const nombres = user?.user_metadata?.nombre || "";
  const apellidos = user?.user_metadata?.apellido || "";
  const correo = user?.email || user?.user_metadata?.email || "";

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPhotoModal, setShowPhotoModal] = React.useState(false);
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = React.useState(false);

  // Validaciones
  const passwordValid = isPasswordValid(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const canSave = passwordValid && passwordsMatch;

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!canSave) {
      showErrorToast(
        !passwordValid
          ? "La contraseña no cumple con los requisitos"
          : "Las contraseñas no coinciden"
      );
      return;
    }
    const { error } = await client.auth.updateUser({ password });
    if (error) {
      showErrorToast("Error al actualizar la contraseña: " + error.message);
    } else {
      showSuccessToast("Contraseña actualizada correctamente");
      setPassword("");
      setConfirmPassword("");
      setIsSaved(true);
    }
  };

  // Si el usuario da click cuando el botón está deshabilitado
  const handleDisabledClick = (e) => {
    e.preventDefault();
    showErrorToast(
      !passwordValid
        ? "La contraseña no cumple con los requisitos"
        : "Las contraseñas no coinciden"
    );
  };

  if (isLoading) {
    return <div className="text-white text-center mt-10">Cargando...</div>;
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-950 via-zinc-950 to-slate-900 relative">
      {/* Efectos de fondo decorativos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <SidebarProfile onPhotoClick={() => setShowPhotoModal(true)} />

      <div className="flex-1 flex flex-col relative z-10">
        <main className="flex-1 flex flex-col py-6 px-6">
          {/* Encabezado: botón y título */}
          <div className="w-full max-w-5xl flex flex-col gap-4 mb-8 px-4">
            
            <div className="flex items-center text-sm text-gray-400">
              <span>Dashboard</span>
              <i className="bi bi-chevron-right mx-2"></i>
              <span className="text-purple-400">Mi Perfil</span>
            </div>

            {/* Header principal */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <BackButton
                  className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-[#232336] to-[#2d2d44] hover:from-[#2d2d44] hover:to-[#383856] text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
                  iconClassName="text-xl"
                  onClick={() => {
                    if (
                      (password !== "" || confirmPassword !== "") &&
                      !isSaved
                    ) {
                      setShowCancelModal(true);
                    } else {
                      navigate(-1);
                    }
                  }}
                />
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    Editar perfil
                  </h2>
                  <p className="text-gray-400 mt-1">
                    Actualiza tu información personal
                  </p>
                </div>
              </div>

              {/* Botón de estado */}
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Perfil Activo</span>
              </div>
            </div>
          </div>
          <div className="w-full max-w-8xl flex flex-col md:flex-row gap-12 ">
            <section className="flex-1">
              <hr className="border-gray-700 mb-12" />
              <div className="max-w-5xl w-full mx-auto space-y-6">
                {/* Card de Información Personal */}
                <div className="bg-gradient-to-br from-[#181825] via-[#1e1e2e] to-[#232335] border border-gray-700/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <i className="bi bi-person-fill text-purple-400 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Información Personal
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Datos básicos de tu cuenta
                      </p>
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

                {/* Card de Seguridad */}
                <div className="bg-gradient-to-br from-[#181825] via-[#1e1e2e] to-[#232335] border border-gray-700/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <i className="bi bi-shield-lock-fill text-red-400 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Seguridad
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Actualiza tu contraseña
                      </p>
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
                        className="bg-gray-900/50 border-gray-600/50 focus:border-purple-500/50 focus:ring-purple-500/20"
                      />
                      {password && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                password.length >= 8
                                  ? "bg-green-400"
                                  : "bg-red-400"
                              }`}
                            ></div>
                            <span
                              className={
                                password.length >= 8
                                  ? "text-green-400"
                                  : "text-red-400"
                              }
                            >
                              Mínimo 8 caracteres
                            </span>
                          </div>
                          {/* Más indicadores de validación */}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-gray-300 text-sm font-medium">
                        Confirmar Contraseña
                      </label>
                      <PasswordInput
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirma tu contraseña"
                        className="bg-gray-900/50 border-gray-600/50 focus:border-purple-500/50 focus:ring-purple-500/20"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      type="submit"
                      disabled={!canSave}
                      className={`
                      px-8 py-3 rounded-xl font-semibold transition-all duration-200
                      ${
                        canSave
                          ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-purple-500/25 hover:scale-105"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed opacity-50"
                      }
                    `}
                      onClick={
                        canSave ? handlePasswordUpdate : handleDisabledClick
                      }
                    >
                      <i className="bi bi-check-circle-fill mr-2"></i>
                      Actualizar Contraseña
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
      {showPhotoModal && (
        <UpdateProfilePhotoModal
          onClose={() => setShowPhotoModal(false)}
          onSave={() => setShowPhotoModal(false)}
          user={user}
        />
      )}
      {showCancelModal && (
        <CancelProfileConfigModal
          onClose={() => setShowCancelModal(false)}
          onSave={() => {
            setShowCancelModal(false);
            navigate(-1);
          }}
        />
      )}
    </div>
  );
}
