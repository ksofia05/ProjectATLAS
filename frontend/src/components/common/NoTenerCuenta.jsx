import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NoTenerCuenta = ({ next: nextProp }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Usa el prop 'next' si existe, si no, toma el de la URL
  const params = new URLSearchParams(location.search);
  const next = nextProp || params.get("next") || "/dashboard";
  // Intenta obtener id_proyecto de next (si viene como query param) o de la URL
  let id_proyecto = params.get("id_proyecto");
  if (!id_proyecto && next.includes("id_proyecto=")) {
    const nextParams = new URLSearchParams(next.split("?")[1]);
    id_proyecto = nextParams.get("id_proyecto");
  }

  const handleLogin = () => {
    let url = `/iniciar-sesion?next=${encodeURIComponent(next)}`;
    if (id_proyecto) url += `&id_proyecto=${id_proyecto}`;
    navigate(url);
  };

  const handleRegister = () => {
    let url = `/registrarse?next=${encodeURIComponent(next)}`;
    if (id_proyecto) url += `&id_proyecto=${id_proyecto}`;
    navigate(url);
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