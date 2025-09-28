import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import FloatingModal from "./popUp/FloatingModal";
import triangle from "../../assets/trian_transparente.png";

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
    <>
    <style>
      {`
        .backdrop-blur-\\[2px\\] {
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
      `}
      
    </style>
    <div className=" relative bg-black">
      <div className="min-h-screen flex flex-row bg-gradient-to-br from-[#360051] to-black text-white">
        <div className="w-full">
          <img
              src={triangle}
              alt="Decoración geométrica"
          />
          <div style={{ backdropFilter: 'none', filter: 'none' }}>
            <FloatingModal>
              <h2 className="text-2xl font-bold text-white mb-2 text-center">
                No tienes una cuenta asociada
              </h2>
              <hr className="border-t border-gray-700 mb-4" />
              <div className="flex flex-col items-center ">
              <p className="mb-6 text-white text-center ">
                Por favor, inicia sesión o regístrate para continuar.
              </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  className="bg-[#7c2ae8] text-white py-2 rounded-2xl hover:bg-[#5a1bb7] transition"
                  onClick={handleLogin}
                >
                  Iniciar sesión
                </button>
                <button
                  className="bg-[#282446] text-white py-2 rounded-2xl hover:bg-[#373263] transition mb-3"
                  onClick={handleRegister}
                >
                  Registrarse
                </button>
              </div>
            </FloatingModal>
            </div>
          </div>
        </div>
      </div>     
      </> 
  );
};


export default NoTenerCuenta;