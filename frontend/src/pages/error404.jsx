import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../../public/img/logoCompleteWhite.svg"
import triangle from "../assets/trian_transparente.png"

const Error404 = () => {
  return (
    <div className="relative bg-black">
      <div className="min-h-screen flex flex-row bg-gradient-to-br from-[#360051] to-black text-white">
        
        {/* Lado izquierdo */}
        <div className="w-1/2 flex items-end">
          <div className="w-full">
            <img
              src={triangle}
              alt="Decoración geométrica"
            />
          </div>
        </div>

        {/* Lado derecho (Texto) */}
        <div className="w-1/2 flex flex-col justify-center items-start px-16">
          <div className="absolute top-6 right-10 text-white font-bold text-lg"><img src={logo} alt="logo" className='w-24 h-auto'/></div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-purple-500 mb-2">
            OOPS! ALGO ANDA MAL
          </h1>
          <p className="text-purple-300 text-xl italic mb-6">ERROR 404</p>
          <p className="text-gray-300 mb-10">
            Lo siento, no se ha encontrado la página. Intenta más tarde.
          </p>

          <Link
            to="/"
            className="px-6 py-2 border-2 border-purple-500 text-purple-300 rounded-full hover:bg-purple-600 hover:text-white transition duration-300"
          >
            REGRESAR AL INICIO
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error404;
