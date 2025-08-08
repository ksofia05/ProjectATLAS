import React, { useState, useRef, useEffect } from "react";
import UserMenu from "./UserMenu";
import { useAuth } from "../../hooks/useAuth";
import SendColaboration from "./SendColaborations";
import ButtonGrey from "../common/ButtonGrey";
import { useParams } from "react-router-dom";
import userAtlas from "../../assets/atlasUser.png";
import { useNavbarTitle } from "../../context/NavbarTitleContext";

const Navbar = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const userRef = useRef(null);

  const { user } = useAuth();

  const params = useParams();
  const projectId = params.id;

  const { title, subtitle } = useNavbarTitle();

  const getUserName = () => {
    if (!user) return "Loading...";
    const metadata = user.user_metadata;
    return `${metadata.nombre} ${metadata.apellido}`;
  };

  const handleClose = () => setShowShareModal(false);
  const userName = getUserName();

  // Obtener la foto de perfil del usuario (desde Supabase o default Atlas)
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
      <nav className="bg-gradient-to-l from-[#181825]/80 via-[#181825]/80 to-[#14141e]/80 backdrop-blur-md py-4 relative border border-slate-700/50 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between px-8 lg:px-8">
          {/* Título y subtítulo */}
          <div className="min-w-0 flex-1 mr-4">
            <h1 className="text-xl lg:text-2xl font-bold text-white truncate">
              {title || props.title}
            </h1>
            {subtitle && (
              <p className="text-gray-400 text-sm lg:text-base truncate">
                {subtitle}
              </p>
            )}
          </div>

          {/* Botones y perfil */}
          <div className="flex items-center gap-4 md:gap-8">
            {" "}
            {/* Responsive gap */}
            {/* Botón Compartir */}
            {props.showShareButton && (
              <>
                <ButtonGrey
                  onClick={() => setShowShareModal(true)}
                  className="px-5 py-2 text-base font-semibold"
                >
                  Compartir
                </ButtonGrey>
                <SendColaboration
                  open={showShareModal}
                  onClose={handleClose}
                  userName={userName}
                  projectId={projectId}
                />
                <div className="h-6 border-l border-gray-500/30 mx-3"></div>
              </>
            )}
            {/* Botón Actualizar Plan */}
            {props.showUpgradeButton && (
              <ButtonGrey className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold px-4 md:px-6 py-2 rounded-xl shadow transition-all text-sm md:text-base">
                <span className="hidden sm:inline">Actualizar Plan</span>
                <span className="sm:hidden">Plan</span>
              </ButtonGrey>
            )}
            {/* Perfil de usuario */}
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
              {/* Menú desplegable */}
              <UserMenu
                visible={menuOpen}
                onClose={() => setMenuOpen(false)}
                fotoPerfil={fotoPerfil}
              />
            </div>
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

export default Navbar;
