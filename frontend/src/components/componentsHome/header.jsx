import React from "react";
import { Link } from "react-router-dom";
import computerImage from "../../../public/img/computersHeader.svg";
import elipce from "../../../public/img/elipseMoradoHeader.svg";
import olasHeader from "../../../public/img/olasHeader.svg";

const Header = () => {
  return (
    <div className="relative py-10">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 z-[-10] bg-black flex items-end">
        <img
          src={elipce}
          alt="Elipse Morada"
          className="w-full h-auto object-cover"
        />
        <img
          src={olasHeader}
          alt="Olas decorativas"
          className="w-full h-auto absolute bottom-0 left-0 pointer-events-none"
        />
      </div>

      {/* Contenido principal - Eliminada la clase absolute inset-0 z-[-10] */}
      <div className="items-center px-6 lg:px-16 md:pt-20 lg:pt-20 flex flex-col md:flex-row gap-4 relative ">
        {/* Texto a la izquierda en md y lg, centrado en sm */}
        <div className="text-white ml-0 md:ml-10 lg:w-1/2 md:w-1/2 sm:w-full text-center md:text-left mb-10 md:mb-20">
          <h2 className="font-['Figtree'] lg:text-8xl md:text-6xl sm:text-4xl text-4xl font-bold mb-3 text-white">
            Innovación
          </h2>
          <h3 className="font-['Figtree'] lg:text-4xl md:text-4xl sm:text-2xl text-2xl font-bold mb-3">
            Al alcance de tus manos
          </h3>
          <h6 className="font-['Figtree'] sm:text-sm md:text-base lg:text-base mb-5">
            Gestiona tu microempresa de cómputo fácil y sin inversión.
          </h6>

          <Link to="/registrarse" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-4xl transition-all duration-300 shadow-lg hover:shadow-purple-500/50">
            Empieza ahora!
          </Link>
        </div>

        {/* Imagen a la derecha */}
        <div className="flex justify-center md:items-center md:ml-20 lg:w-1/2 md:w-1/2 w-full">
          <img
            src={computerImage}
            alt="Computadora"
            className="max-w-lg w-full md:w-80 lg:w-full mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
