import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import ButtonGrey from "../common/ButtonGrey";
import userAtlas from "../../assets/atlasUser.png";

const ANIMATION_DURATION = 250;

const UserMenu = ({ visible, onClose, fotoPerfil }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timeout = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, ANIMATION_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [visible, shouldRender]);

  const getUserName = () => {
    if (!user) return "";
    const metadata = user.user_metadata || {};
    const nombre = metadata.nombre || user.nombre || "";
    const apellido = metadata.apellido || user.apellido || "";
    return `${nombre} ${apellido}`.trim();
  };

  const getUserEmail = () => {
    if (!user) return "";
    return user.email || user.user_metadata?.email || "";
  };

  const handleLogout = async () => {
    setIsClosing(true);
    setTimeout(async () => {
      await logout();
      navigate("/iniciar-sesion");
      if (onClose) onClose();
    }, ANIMATION_DURATION);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, ANIMATION_DURATION);
  };

  if (!shouldRender) return null;

  return (
    <>
      <div
        className={`
          absolute right-0 top-14 z-50 min-w-[20rem] 
          bg-[#14141e] from-[#08080e]/95 border border-slate-700/50
          rounded-2xl shadow-2xl p-4
          transition-all duration-300
          ${isClosing ? "animate-fadeOutScale" : "animate-fadeInScale"}
          hover:shadow-xl hover:shadow-purple-500/10
        `}
        style={{ transformOrigin: "top right" }}
      >
        <div className="flex items-center gap-4 mb-4">
          <img
            src={fotoPerfil || userAtlas}
            alt="Usuario"
            className="w-11 h-11 rounded-full object-cover border-2 border-purple-500/30"
          />
          <div className="flex-1 min-w-0">
            <div className="text-lg font-semibold text-white leading-tight truncate">
              {getUserName()}
            </div>
            <div className="text-sm text-gray-400 truncate">
              {getUserEmail()}
            </div>
          </div>
          <ButtonGrey
            className="ml-auto px-4 py-1 text-sm hover:bg-purple-600/20 hover:border-purple-500/40 transition-all duration-200"
            onClick={() => {
              handleClose();
              navigate("/perfil");
            }}
          >
            <span aria-label="Ver perfil">Ver perfil</span>
          </ButtonGrey>
        </div>
        <hr className="border-slate-700/50 my-3" />
        <button
          className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-slate-800/50 w-full px-3 py-2.5 rounded-xl transition-all duration-200 group"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right text-lg group-hover:text-red-400 transition-colors duration-200"></i>
          <span aria-label="Cerrar sesión">Cerrar sesión</span>
        </button>
      </div>
      <style jsx="true">{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeOutScale {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.95);
          }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-fadeOutScale {
          animation: fadeOutScale 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </>
  );
};

export default UserMenu;
