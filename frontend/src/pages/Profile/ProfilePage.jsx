import React from "react";
import SidebarProfile from "../../components/layout/SidebarProfile";
import BackButton from "../../components/common/BackButton";
import Button from "../../components/common/Button";
import PasswordInput from "../../components/common/PasswordInput";
import Input from "../../components/common/Input";
import { useAuth } from "../../hooks/useAuth";
import UpdateProfilePhotoModal from "../../components/layout/UpdateProfilePhotoModal";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  // Extrae los datos del usuario según cómo los guardes en Supabase/Auth
  const nombres = user?.user_metadata?.nombre || "";
  const apellidos = user?.user_metadata?.apellido || "";
  const correo = user?.email || user?.user_metadata?.email || "";
  const telefono = user?.user_metadata?.telefono || "";
  // Contraseña: por seguridad, nunca la traes del backend, solo para edición
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPhotoModal, setShowPhotoModal] = React.useState(false);

  if (isLoading) {
    return <div className="text-white text-center mt-10">Cargando...</div>;
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-gray-950 to-zinc-950 relative">
      <SidebarProfile onPhotoClick={() => setShowPhotoModal(true)} />
      <div className="flex-1 flex flex-col relative">
        <main className="flex-1 flex flex-col py-16 px-18">
          {/* Encabezado: botón y título */}
          <div className="w-full max-w-5xl flex items-center justify-left gap-4 mb-9">
            <BackButton
              className="w-12 h-12 flex items-center justify-center bg-[#232336] hover:bg-[#2d2d44] text-white rounded-full shadow-lg transition-colors duration-200"
              iconClassName="text-2xl"
            />
            <h2 className="text-3xl font-bold text-white">Editar perfil</h2>
          </div>
          <div className="w-full max-w-8xl flex flex-col md:flex-row gap-12">
            <section className="flex-1">
              <hr className="border-gray-700 mb-12" />
              <div className="max-w-5xl ml-60 mr-60 mt-20 bg-gradient-to-tr from-[#181825] via-[#181825] to-[#232335] border border-gray-700 rounded-3xl p-10 shadow-2xl">
                <form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <label className="block text-gray-300 mb-2">Nombres:</label>
                      <Input value={nombres} readOnly />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Apellidos:</label>
                      <Input value={apellidos} readOnly />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Correo Electrónico:</label>
                      <Input value={correo} readOnly />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Numero Telefónico:</label>
                      <Input value={telefono} placeholder="Registra un número" readOnly />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Contraseña:</label>
                      <PasswordInput
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="********"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Confirmar Contraseña:</label>
                      <PasswordInput
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="********"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row justify-end gap-4">
                    <Button className="bg-gradient-to-r from-purple-700  to-purple-600 hover:from-purple-600 via-purple-500 hover:to-purple-500 px-8 py-3 rounded-xl font-bold text-white">
                      Actualizar contraseña
                    </Button>
                    <Button className="bg-gradient-to-r from-purple-700  to-purple-600 hover:from-purple-600 via-purple-500 hover:to-purple-500 px-8 py-3 rounded-xl font-bold text-white">
                      Guardar Cambios
                    </Button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </main>
      </div>
      {showPhotoModal && (
        <UpdateProfilePhotoModal
          onClose={() => setShowPhotoModal(false)}
          onSave={() => setShowPhotoModal(false)}
        />
      )}
    </div>
  );
}