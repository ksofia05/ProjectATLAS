import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import UpdateProfilePhotoModal from "./UpdateProfilePhotoModal";
import userAtlas from "../../assets/atlasUser.png"

export default function SidebarProfile() {
  const { user, isLoading } = useAuth();
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  // Extraer datos del usuario
  const nombres = user?.user_metadata?.nombre || "";
  const apellidos = user?.user_metadata?.apellido || "";
  const correo = user?.email || user?.user_metadata?.email || "";
  const telefono = user?.user_metadata?.telefono || "";
  const fotoPerfil =
    user?.user_metadata?.fotoPerfil ||
    {userAtlas};

  return (
    <aside className="bg-gradient-to-l from-[#181825] via-[#181825] to-[#14141e] text-white w-72 min-h-screen flex flex-col justify-between py-8 px-6">
      <div>
        {/* Logo y título */}
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-8">Mi perfil</h2>
          <img
            src={userAtlas}
            alt="Perfil"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-700 mb-4 cursor-pointer"
            onClick={() => setShowPhotoModal(true)}
            title="Actualizar foto de perfil"
          />
        </div>
        <hr className="border-gray-700 w-full mb-6" />
        <div className="text-left w-full text-gray-300">
          <h3 className="text-base font-semibold mb-2">Detalles del Perfil</h3>
          <p className="mb-2">
            <span className="font-bold text-gray-300">Nombre:</span>{" "}
            {nombres} {apellidos}
          </p>
          <p className="mb-2">
            <span className="font-bold text-gray-300">Email:</span>{" "}
            {correo}
          </p>
        </div>
      </div>
      {/* Footer igual al sidebar general */}
      <footer className="text-xs text-gray-500 mt-8">
        <div className="mb-2">&copy; 2025 AtlasCo.</div>
        <div>
          <a href="/terminos" className="underline hover:text-[#7c2ae8]">
            Términos de Servicio
          </a>
          {" y "}
          <a href="/politica-de-privacidad" className="underline hover:text-[#7c2ae8]">
            Políticas de Privacidad
          </a>
        </div>
        <div>
          <a href="/sobre-nosotros" className="underline hover:text-[#7c2ae8]">
            Acerca de nosotros
          </a>
        </div>
      </footer>
      {showPhotoModal && (
        <UpdateProfilePhotoModal
          onClose={() => setShowPhotoModal(false)}
          onSave={() => setShowPhotoModal(false)}
        />
      )}
    </aside>
  );
}