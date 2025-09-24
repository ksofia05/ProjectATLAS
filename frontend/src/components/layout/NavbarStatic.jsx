import React, { useState, useRef, useEffect } from "react";
import UserMenu from "./UserMenu";
import { useAuth } from "../../context/AuthProvider";
import ButtonGrey from "../common/ButtonGrey";
import userAtlas from "../../assets/atlasUser.png";
import ButtonSidebar from "../buttonSidebar";

const NavbarStatic = ({
  onSidebarToggle,
  isSidebarOpen,
  backButton,
  hideUserMenu = false,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const userRef = useRef(null);

  const { user, userProfile, isLoading } = useAuth();

  const getUserName = () => {
    if (!user) return isLoading ? "Cargando..." : "Invitado";
    const metadata = user.user_metadata || user.nombre;
    return `${metadata.nombre} ${metadata.apellido}`;
  };

  const fotoPerfil =
    user?.user_metadata?.fotosPerfiles &&
    user.user_metadata.fotosPerfiles.trim() !== ""
      ? user.user_metadata.fotosPerfiles
      : userAtlas;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="bg-gradient-to-r from-[#08080e]/95 via-[#0a0a12]/95 to-[#0c0c14]/95 backdrop-blur-md py-4 relative border border-slate-800/40 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-8 lg:px-8">
          <div className="min-w-0 flex-1 mr-4 flex items-center gap-4">
            <div className="lg:hidden">
              <ButtonSidebar
                onClick={onSidebarToggle}
                isOpen={isSidebarOpen}
                className="bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-700 hover:to-purple-900 relative"
              />
            </div>
            {backButton && <div>{backButton}</div>}
            <div className="min-w-0">
              <h1 className="text-xl lg:text-2xl font-bold text-white truncate">
                Proyectos
              </h1>
              <p className="text-gray-400 text-sm lg:text-base truncate">
                Organiza tus espacios de trabajo.
              </p>
            </div>
          </div>
          <div className="flex items-center sm:gap-2 md:gap-8">
            {/* Perfil de usuario */}
            {!hideUserMenu && (
              <div
                className="flex items-center gap-3 cursor-pointer relative hover:bg-white/5 rounded-3xl px-2 py-1 transition-colors"
                ref={userRef}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <img
                  src={fotoPerfil}
                  alt="Usuario"
                  className="w-11 h-11 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = userAtlas;
                  }}
                />
                <div className="text-right min-w-0 hidden sm:block">
                  <div className="text-base font-semibold text-white text-right truncate flex items-center gap-2">
                    {getUserName()}
                    <i
                      className={`bi bi-chevron-down text-sm text-gray-400 hover:text-purple-400 transition-transform duration-200 ${
                        menuOpen ? "rotate-180" : ""
                      }`}
                    ></i>
                  </div>
                </div>
                <UserMenu
                  visible={menuOpen}
                  onClose={() => setMenuOpen(false)}
                  fotoPerfil={fotoPerfil}
                />
              </div>
            )}
            {/* Notificación */}
            <div className="relative cursor-pointer hover:bg-white/5 rounded-lg p-2 transition-colors">
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <i className="bi bi-bell text-xl text-white hover:text-purple-400 transition-colors"></i>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavbarStatic;
