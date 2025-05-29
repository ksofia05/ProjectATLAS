import React, { useState, useRef, useEffect } from "react";
import UserMenu from "./UserMenu";
import Searchbar from "./Searchbar";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const userRef = useRef(null);

  const {user} = useAuth();

  // La ventana emergente del usuario se cierra al hacer clic en cualquier parte de la pantalla
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

  const getUserName = () => {
    if(!user) return "Loading...";
    const metadata = user.user_metadata
    return `${metadata.nombre} ${metadata.apellido}`;
  }

  return (
    <nav className="w-full bg-gray-950 border-b border-gray-800 px-8 pr-8 py-6 flex items-center justify-between relative">
      {/* Título */}
      <h1 className="text-2xl font-bold text-white">Proyectos</h1>

      {/*Campo de busqueda*/}
      <div className="flex-grow max-w-md mx-8">
        <Searchbar placeholder="Buscar..." />
      </div>

      {/* Botón y perfil */}
      <div className="flex items-center gap-10">
        
        {/* Botón Actualizar Plan */}
        <button
          className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold px-6 py-2 rounded-xl shadow transition-all"
        >
          Actualizar Plan
        </button>

        {/* Perfil de usuario */}
        <div
          className="flex items-center gap-2 cursor-pointer relative"
          ref={userRef}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Usuario"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="text-right">
            <div className="text-sm font-semibold text-white text-right">
              {getUserName()}
            </div>
            
          </div>
          {/* Menú desplegable */}
          <UserMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
        </div>

        {/* Notificación */}
        <div className="relative">
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          <i className="bi bi-bell text-xl text-white"></i>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;