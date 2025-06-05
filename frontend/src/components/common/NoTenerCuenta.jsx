import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NoTenerCuenta = ({ next: nextProp }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lee el parámetro 'next' de la URL o usa el prop
  const params = new URLSearchParams(location.search);
  const next = nextProp || params.get("next") || "/dashboard";

  const handleLogin = () => {
    navigate(`/iniciar-sesion?next=${encodeURIComponent(next)}`);
  };

  const handleRegister = () => {
    navigate(`/registrarse?next=${encodeURIComponent(next)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 to-zinc-950">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center relative">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          No tienes una cuenta asociada
        </h2>
        <p className="mb-6 text-gray-600">
          Por favor, inicia sesión o regístrate para continuar.
        </p>
        <div className="flex flex-col gap-3">
          <button
            className="bg-[#7c2ae8] text-white py-2 rounded hover:bg-[#5a1bb7] transition"
            onClick={handleLogin}
          >
            Iniciar sesión
          </button>
          <button
            className="bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition"
            onClick={handleRegister}
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoTenerCuenta;