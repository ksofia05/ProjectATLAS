import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import logoCompleto from "../../../public/img/logoCompleteWhite.svg";
import ButtonSidebar from "../buttonSidebar";

const Navbar = () => {
  const [hoverLogin, setHoverLogin] = useState(false);
  const [hoverSignup, setHoverSignup] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Animación de apertura y cierre
  const openMenu = () => {
    setShowMenu(true);
    setTimeout(() => setIsMenuOpen(true), 10); 
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    if (!isMenuOpen && !showMenu) {
      openMenu();
    } else {
      closeMenu();
    }
  };

  // Controla el desmontaje tras la animación de salida
  useEffect(() => {
    if (!isMenuOpen && showMenu) {
      const timeout = setTimeout(() => setShowMenu(false), 250); // Duración igual a la transición
      return () => clearTimeout(timeout);
    }
  }, [isMenuOpen, showMenu]);

  return (
    <>
      <nav className="mx-2 mt-6 px-2 py-2 bg-white/10 backdrop-blur-md text-white rounded-4xl shadow-md">
        <div className="mx-auto w-full flex flex-wrap items-center justify-between gap-y-2">
          {/* Logo y ButtonSidebar */}
          <div className="flex items-center gap-3 relative">
            <div className="sm:hidden md:hidden">
              <ButtonSidebar
                onClick={toggleMenu}
                isOpen={isMenuOpen}
                gradient={false}
                className="text-white hover:bg-white/10 relative"
              />
            </div>
            <img src={logoCompleto} alt="Logo" className="h-8" />
          </div>

          {/* Links de navegación - desktop */}
          <div className="hidden sm:flex items-center gap-8 sm:gap-24 flex-1 justify-center min-w-0">
            <Link to="/" className="hover:text-gray-300 whitespace-nowrap">
              Inicio
            </Link>
            <Link
              to="/quienes-somos"
              className="hover:text-gray-300 whitespace-nowrap"
            >
              Sobre Nosotros
            </Link>
          </div>

          {/* Botones a la derecha */}
          <div className="flex items-center gap-2 sm:gap-4 font-medium flex-shrink-0">
            <Link
              to="/iniciar-sesion"
              className={`relative px-3 sm:px-4 py-2 rounded-full transition-all duration-300 ease-in-out border border-transparent text-xs sm:text-base ${
                hoverLogin
                  ? "text-purple-900 bg-white/90 shadow-md"
                  : "text-white hover:text-purple-100"
              }`}
              onMouseEnter={() => setHoverLogin(true)}
              onMouseLeave={() => setHoverLogin(false)}
            >
              <span className="relative z-10">
                <span className="hidden sm:inline">Iniciar Sesión</span>
                <span className="sm:hidden">Iniciar Sesión</span>
              </span>
              {hoverLogin && (
                <span className="absolute inset-0 bg-white/90 rounded-full animate-pulse opacity-70"></span>
              )}
            </Link>

            <Link
              to="/registrarse"
              className={`relative px-3 sm:px-4 py-2 rounded-full transition-all duration-300 ease-in-out text-xs sm:text-base ${
                hoverSignup
                  ? "bg-purple-700 text-white shadow-lg transform scale-105"
                  : "bg-purple-600 text-white hover:bg-purple-650 shadow-md"
              }`}
              onMouseEnter={() => setHoverSignup(true)}
              onMouseLeave={() => setHoverSignup(false)}
            >
              <span className="relative z-10">Registrarse</span>
              {hoverSignup && (
                <span className="absolute inset-0 bg-purple-500 rounded-full animate-pulse opacity-20"></span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {showMenu && (
        <>
          <div
            className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
              isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={closeMenu}
          ></div>
          <div
            className={`
              fixed top-24 left-1/2 z-50
              w-[calc(100vw-2rem)] max-w-md -translate-x-1/2
              bg-white/10 border border-white/20 shadow-2xl
              rounded-4xl backdrop-blur-md
              transition-all duration-300 ease-in-out
              ${
                isMenuOpen
                  ? "opacity-100 scale-100 translate-y-4"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }
            `}
            style={{ minWidth: "220px" }}
          >
            <div className="flex flex-col gap-2 p-6">
              <Link
                to="/"
                className="block py-3 px-5 text-lg font-semibold text-white hover:bg-purple-700 hover:text-purple-100 rounded-3xl transition-colors"
                onClick={closeMenu}
              >
                Inicio
              </Link>
              <Link
                to="/quienes-somos"
                className="block py-3 px-5 text-lg font-semibold text-white hover:bg-purple-700 hover:text-purple-100 rounded-3xl transition-colors"
                onClick={closeMenu}
              >
                Sobre Nosotros
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
