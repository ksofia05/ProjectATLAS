import React, { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import UpdateProfilePhotoModal from "./UpdateProfilePhotoModal";
import userAtlas from "../../assets/atlasUser.png";
export default function SidebarProfile({ isOpen = false, onClose }) {
  const { user } = useAuth();
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  // datos del user
  const nombres = user?.user_metadata?.nombre || "";
  const apellidos = user?.user_metadata?.apellido || "";
  const fotoPerfil =
    user?.user_metadata?.fotosPerfiles &&
    user.user_metadata.fotosPerfiles.trim() !== ""
      ? user.user_metadata.fotosPerfiles
      : userAtlas;

  React.useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (
        !e.target.closest(".sidebar-profile") &&
        !e.target.closest(".sidebar-toggle-btn")
      ) {
        onClose && onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`sidebar-profile fixed left-0 top-0 bg-gradient-to-b from-[#08080e] via-[#0a0a12] to-[#0c0c14] text-white w-72 h-screen flex flex-col py-8 px-6 shadow-lg border-r border-slate-800/40 overflow-y-auto z-40 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        <div className="flex-1">
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <img
                src={fotoPerfil}
                alt="Perfil"
                className="relative w-32 h-32 rounded-full object-cover border-4 border-slate-700/50 mb-4 transition-transform duration-300 hover:scale-105"
                title="Foto de perfil"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = userAtlas;
                }}
              />
              <div
                className="absolute bottom-6 right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors shadow-lg"
                onClick={() => setShowPhotoModal(true)}
                title="Actualizar foto de perfil"
              >
                <i className="bi bi-camera-fill text-white text-sm"></i>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-white mb-2">
              {nombres} {apellidos}
            </h2>
            <p className="text-purple-400 text-sm font-medium mb-2">
              Mi perfil
            </p>
            <hr className="w-2/3 border-purple-800/30 my-2" />
          </div>

          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50 text-center mt-4">
            <i className="bi bi-shield-lock-fill text-purple-400 text-xl mb-2"></i>
            <p className="text-white text-sm font-medium mt-2">
              Por tu seguridad, recuerda actualizar tu contraseña regularmente.
            </p>
          </div>

          <hr className="my-4 border-purple-800/30" />
        </div>

        <footer className="text-xs text-gray-500 border-t border-slate-700/50 pt-4 text-center relative z-10">
          <span className="text-purple-400 font-medium">
            &copy; 2025 AtlasCo.
          </span>
        </footer>
        {showPhotoModal && (
          <UpdateProfilePhotoModal
            onClose={() => setShowPhotoModal(false)}
            onSave={() => setShowPhotoModal(false)}
            user={user}
          />
        )}
      </aside>
    </>
  );
}
