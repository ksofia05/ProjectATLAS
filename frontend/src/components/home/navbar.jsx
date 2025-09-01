import { Link, useSubmit } from "react-router-dom";
import React, { useState } from "react";
import logoCompleto from "../../../public/img/logoCompleteWhite.svg";

const Navbar = () => {
  const [hoverLogin, setHoverLogin] = useState(false);
  const [hoverSignup, setHoverSignup] = useState(false);
  return (
    <nav className="mx-4 mt-8 px-6 py-2 bg-white/10 backdrop-blur-md text-white rounded-4xl shadow-md">
      <div className="mx-auto flex justify-between items-center">
        {/* Logo a la izquierda */}
        <div className="flex items-center">
          <img src={logoCompleto} alt="Logo" className="h-8" />
        </div>

        {/* Links de navegación en el centro */}
        <div className="flex items-center space-x-24">
          <Link to="/" className="hover:text-gray-300">
            Inicio
          </Link>
          <a
            href="/sobre-nosotros"
            className="hover:text-gray-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sobre Nosotros
          </a>
        </div>

        {/* Botones a la derecha */}
        <div className="flex items-center space-x-4 font-medium">
          <Link
            to="/iniciar-sesion"
            className={`relative px-5 py-2 rounded-full transition-all duration-300 ease-in-out border border-transparent ${
              hoverLogin
                ? "text-purple-900 bg-white/90 shadow-md"
                : "text-white hover:text-purple-100"
            }`}
            onMouseEnter={() => setHoverLogin(true)}
            onMouseLeave={() => setHoverLogin(false)}
          >
            <span className="relative z-10">Iniciar Sesión</span>
            {hoverLogin && (
              <span className="absolute inset-0 bg-white/90 rounded-full animate-pulse opacity-70"></span>
            )}
          </Link>

          <Link
            to="/registrarse"
            className={`relative px-5 py-2 rounded-full transition-all duration-300 ease-in-out ${
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
  );
};

export default Navbar;
