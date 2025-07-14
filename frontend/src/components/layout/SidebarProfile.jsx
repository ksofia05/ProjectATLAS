import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import UpdateProfilePhotoModal from "./UpdateProfilePhotoModal";
import userAtlas from "../../assets/atlasUser.png";
import { Link } from "react-router-dom";

export default function SidebarProfile() {
  const { user, isLoading } = useAuth();
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  // Extraer datos del usuario
  const nombres = user?.user_metadata?.nombre || "";
  const apellidos = user?.user_metadata?.apellido || "";
  const correo = user?.email || user?.user_metadata?.email || "";
  const telefono = user?.user_metadata?.telefono || "";
  const fotoPerfil =
    user?.user_metadata?.fotosPerfiles &&
    user.user_metadata.fotosPerfiles.trim() !== ""
      ? user.user_metadata.fotosPerfiles
      : userAtlas;

  return (
    <aside className="fixed left-0 top-0 bg-gradient-to-b from-[#181825] via-[#1a1a2e] to-[#14141e] text-white w-72 h-screen flex flex-col justify-between py-8 px-6 border-r border-gray-800/50 shadow-lg z-40 overflow-y-auto">
      <div>
        {/* Header mejorado */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <img
              src={fotoPerfil}
              alt="Perfil"
              className="relative w-32 h-32 rounded-full object-cover border-4 border-gray-700/50 mb-4 transition-transform duration-300 hover:scale-105"
              title="Foto de perfil"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = userAtlas;
              }}
            />
            <div
              className="absolute bottom-6 right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors"
              onClick={() => setShowPhotoModal(true)}
              title="Actualizar foto de perfil"
            >
              <i className="bi bi-camera-fill text-white text-sm"></i>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            {nombres} {apellidos}
          </h2>
          <p className="text-purple-400 text-sm font-medium">Mi perfil</p>
        </div>

        {/* Cards de información */}
        <div className="space-y-4 mb-8">
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <i className="bi bi-info-circle-fill text-purple-400"></i>
              Información
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="bi bi-person-fill text-purple-400 text-sm"></i>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Nombre
                  </p>
                  <p className="text-white font-medium truncate">
                    {nombres} {apellidos}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="bi bi-envelope-fill text-blue-400 text-sm"></i>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Email
                  </p>
                  <p className="text-white font-medium truncate">{correo}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas o información adicional */}
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <i className="bi bi-graph-up text-green-400"></i>
              Actividad
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Última conexión</span>
                <span className="text-white text-sm">Hace 2 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Perfil creado</span>
                <span className="text-white text-sm">Ene 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-xs text-gray-500 border-t border-gray-700/50 pt-4 relative z-10">
        <div className="mb-3 text-center">
          <span className="text-purple-400 font-medium">
            &copy; 2025 AtlasCo.
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            to="/terminos"
            state={{ from: "/perfil" }}
            className="hover:text-purple-400 transition-colors cursor-pointer"
          >
            Términos
          </Link>
          <span>•</span>
          <Link
            to="/politica-de-privacidad"
            state={{ from: "/perfil" }}
            className="hover:text-purple-400 transition-colors cursor-pointer"
          >
            Privacidad
          </Link>
          <span>•</span>
          <Link
            to="/sobre-nosotros"
            className="hover:text-purple-400 transition-colors cursor-pointer"
          >
            Acerca de
          </Link>
        </div>
      </footer>
      {showPhotoModal && (
        <UpdateProfilePhotoModal
          onClose={() => setShowPhotoModal(false)}
          onSave={() => setShowPhotoModal(false)}
          user={user}
        />
      )}
    </aside>
  );
}
