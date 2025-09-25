import { Link } from "react-router-dom";
import React, { useState } from "react";
import logoCompleto from "../../../public/img/logoCompleteWhite.svg";
import ButtonSidebar from "../buttonSidebar";

const Navbar = () => {
  const [hoverLogin, setHoverLogin] = useState(false);
  const [hoverSignup, setHoverSignup] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="mx-2 mt-6 px-2 py-2 bg-white/10 backdrop-blur-md text-white rounded-4xl shadow-md">
      <div className="mx-auto w-full  flex flex-wrap items-center justify-between gap-y-2">
        {/* Logo y ButtonSidebar */}
        <div className="flex items-center gap-3">
          <div className="sm:hidden md:hidden">
            <ButtonSidebar 
              onClick={toggleMenu}
              isOpen={isMenuOpen}
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
          <Link to="/quienes-somos" className="hover:text-gray-300 whitespace-nowrap">
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

        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="w-full sm:hidden mt-4 pt-4 border-t border-white/20">
            <div className="flex flex-col gap-3">
              <Link 
                to="/" 
                className="block py-2 px-4 hover:bg-white/10 rounded-4xl transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                to="/quienes-somos" 
                className="block py-2 px-4 hover:bg-white/10 rounded-4xl transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre Nosotros
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;