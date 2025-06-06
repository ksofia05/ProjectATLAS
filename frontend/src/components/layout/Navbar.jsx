import React, { useState, useRef, useEffect } from "react";
import UserMenu from "./UserMenu";
import { useAuth } from "../../hooks/useAuth";
import SendColaboration from "./SendColaborations";
import ButtonGrey from "../common/ButtonGrey";
import { useParams } from "react-router-dom";

const Navbar = ({
  showShareButton = false,
  showUpgradeButton = true,
  title = "Proyectos",
  subtitle = "",
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const userRef = useRef(null);

  const { user } = useAuth();

  const params = useParams();
  const projectId = params.id;

  // Define la función antes de usarla
  const getUserName = () => {
    if (!user) return "Loading...";
    const metadata = user.user_metadata;
    return `${metadata.nombre} ${metadata.apellido}`;
  };

  const handleClose = () => setShowShareModal(false);
  const userName = getUserName();

  // Cierra el menú de usuario al hacer clic fuera
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
    <nav className="w-full bg-gray-950 border-b border-gray-800 px-10 pr-12 py-6 flex items-center justify-between relative mb-2">
      {/* Título y subtítulo */}
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && (
          <p className="text-gray-400 text-base">{subtitle}</p>
        )}
      </div>

      {/* Botones y perfil */}
      <div className="flex items-center gap-8">
        {/* Botón Compartir */}
        {showShareButton && (
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
            <div className="h-8 border-l border-gray-700 mx-3"></div>
          </>
        )}

        {/* Botón Actualizar Plan */}
        {showUpgradeButton && (
          <ButtonGrey
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold px-6 py-2 rounded-xl shadow transition-all text-base"
          >
            Actualizar Plan
          </ButtonGrey>
        )}

        {/* Perfil de usuario */}
        <div
          className="flex items-center gap-2 cursor-pointer relative"
          ref={userRef}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Usuario"
            className="w-11 h-11 rounded-full object-cover"
          />
          <div className="text-right">
            <div className="text-base font-semibold text-white text-right">
              {getUserName()}
            </div>
          </div>
          {/* Menú desplegable */}
          <UserMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
        </div>

        {/* Notificación */}
        <div className="relative">
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          <i className="bi bi-bell text-2xl text-white"></i>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;