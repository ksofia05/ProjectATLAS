import React from "react";
import useOnScreen from '../../hooks/useOnScreen';

const MissionVisionSection = () => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });

  return (
    <section ref={ref} className="relative py-16 px-6 lg:px-16 md:py-24 overflow-hidden mt-30">
      <div className="container mx-auto flex flex-col items-center justify-center text-white">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-center items-center">
          {/* Misión */}
          <div className={`w-full md:w-1/2 lg:w-1/3 aspect-square bg-gradient-to-br from-gray-900 to-gray-900/40 rounded-3xl p-8 shadow-xl flex flex-col justify-center items-center text-center transition-all duration-1000 ease-out hover:scale-105 ${
            isVisible ? 'transform-none opacity-100' : '-translate-x-full opacity-0'
          }`}>
            <span className="flex justify-center items-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="currentColor"
              className="text-purple-400"
              viewBox="0 0 16 16"
            >
              <path d="M12.17 9.53c2.307-2.592 3.278-4.684 3.641-6.218.21-.887.214-1.58.16-2.065a3.6 3.6 0 0 0-.108-.563 2 2 0 0 0-.078-.23V.453c-.073-.164-.168-.234-.352-.295a2 2 0 0 0-.16-.045 4 4 0 0 0-.57-.093c-.49-.044-1.19-.03-2.08.188-1.536.374-3.618 1.343-6.161 3.604l-2.4.238h-.006a2.55 2.55 0 0 0-1.524.734L.15 7.17a.512.512 0 0 0 .433.868l1.896-.271c.28-.04.592.013.955.132.232.076.437.16.655.248l.203.083c.196.816.66 1.58 1.275 2.195.613.614 1.376 1.08 2.191 1.277l.082.202c.089.218.173.424.249.657.118.363.172.676.132.956l-.271 1.9a.512.512 0 0 0 .867.433l2.382-2.386c.41-.41.668-.949.732-1.526zm.11-3.699c-.797.8-1.93.961-2.528.362-.598-.6-.436-1.733.361-2.532.798-.799 1.93-.96 2.528-.361s.437 1.732-.36 2.531Z" />
              <path d="M5.205 10.787a7.6 7.6 0 0 0 1.804 1.352c-1.118 1.007-4.929 2.028-5.054 1.903-.126-.127.737-4.189 1.839-5.18.346.69.837 1.35 1.411 1.925" />
            </svg>
            </span>
            <h2 className="font-['Figtree'] text-3xl md:text-4xl font-bold text-purple-300 mb-4">
              Misión
            </h2>
            <p className="font-['Figtree'] text-lg md:text-xl text-gray-200">
            Desarrollar software confiable, escalable e intuitivo, aplicando
            metodologías ágiles que nos permitan entregar soluciones adaptadas a
            las necesidades de nuestros usuarios, contribuyendo al crecimiento y
            la eficiencia de empresas e instituciones.
            </p>
          </div>
          {/* Visión */}
          <div className={`w-full md:w-1/2 lg:w-1/3 aspect-square bg-gradient-to-br from-gray-900 to-gray-900/40 rounded-3xl p-8 shadow-xl flex flex-col justify-center items-center text-center transition-all duration-1000 ease-out delay-[300ms] hover:scale-105 ${
            isVisible ? 'transform-none opacity-100' : 'translate-x-full opacity-0'
          }`}>
            <span className="flex justify-center items-center mb-9">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="currentColor"
              className="text-purple-400"
              viewBox="0 0 16 16"
            >
              <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13h-5a.5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m3 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1-.5-.5" />
            </svg>
            </span>
            <h2 className="font-['Figtree'] text-3xl md:text-4xl font-bold text-purple-300 mb-4">
              Visión
            </h2>
            <p className="font-['Figtree'] text-lg md:text-xl text-gray-200">
            Ser reconocidos como un referente en innovación tecnológica y
            desarrollo de software a nivel nacional, impulsando la transformación
            digital con soluciones que integren calidad, usabilidad e impacto
            social positivo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;