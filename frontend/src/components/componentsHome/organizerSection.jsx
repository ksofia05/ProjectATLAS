import React from "react";
import elipses from "../../../public/img/elipsesOrganiza.svg";

const organizerSection = () => {
  return (
    <div className="relative pb-60 ">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 z-[-10] bg-black  flex items-end">
        <img
          src={elipses}
          alt="Elipses"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Contenido principal */}
      <div className="items-center text-center">
        <div className="text-white pt-20">
          <h2 className="font-['Figtree'] lg:text-8xl md:text-6xl sm:text-4xl text-4xl font-bold mb-3 text-white">
            Organiza
          </h2>
          <h3 className="font-['Figtree'] lg:text-4xl md:text-4xl sm:text-2xl text-2xl font-bold mb-3">
            tu tiempo y espacio
          </h3>
          <h6 className="font-['Figtree'] sm:text-sm md:text-base lg:text-base mb-5">
            Con herramientas diarias de facil uso
          </h6>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-center gap-15">
          {/* Recuadro 1 */}
          <div className="w-64 h-64 backdrop-blur-sm bg-white/5 rounded-xl p-6 border   transition-all duration-300 hover:bg-white/10 group">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-lg bg-purple-500/30 flex items-center justify-center transform transition-transform group-hover:rotate-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Gestión eficiente
            </h3>
            <p className="text-white/70 text-sm">
              Organiza tus recursos y maximiza tu potencial con nuestra interfaz
              intuitiva.
            </p>
          </div>

          {/* Recuadro 2 */}
          <div className="w-64 h-64 backdrop-blur-sm bg-white/5 rounded-xl p-6 border  transition-all duration-300 hover:bg-white/10 group">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-lg bg-blue-500/30 flex items-center justify-center transform transition-transform group-hover:rotate-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Ahorro de tiempo
            </h3>
            <p className="text-white/70 text-sm">
              Automatiza procesos y reduce tareas repetitivas para enfocarte en
              lo importante.
            </p>
          </div>

          {/* Recuadro 3 */}
          <div className="w-64 h-64 backdrop-blur-sm bg-white/5 rounded-xl p-6 border  transition-all duration-300 hover:bg-white/10 group">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-lg bg-pink-500/30 flex items-center justify-center transform transition-transform group-hover:rotate-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Mayor productividad
            </h3>
            <p className="text-white/70 text-sm">
              Incrementa tu rendimiento con herramientas de análisis en tiempo
              real.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default organizerSection;
