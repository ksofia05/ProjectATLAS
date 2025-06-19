import React, { useEffect, useRef, useState } from "react";
import downlandSectionImage from "../../../public/img/downlandSection.svg";

const downlandSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 } // ajustar para que el efecto ocurra antes o después
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => {
      if (textRef.current) {
        observer.unobserve(textRef.current);
      }
    };
  }, []);
  return (
    <div className="relative w-full">
      {/* Fondo con degradado de morado a negro */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-purple-700/77 to-black"></div>

      <div className="relative z-10 w-full flex flex-col px-4 sm:px-8 md:px-16 lg:px-20 py-6 md:py-10">
        <div className="w-full flex justify-end mb-4 md:mb-6">
          <div
            ref={textRef}
            // usa el isVisible como el estado para que se vea la info
            className={`text-white text-right max-w-full sm:max-w-xs md:max-w-md lg:max-w-lg transform transition-all duration-700 ease-in-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <h2 className="font-['Figtree'] text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-2 md:mb-3 text-white">
              Descarga
            </h2>
            <h3 className="font-['Figtree'] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 sm:mr-5 text-purple-300  sm:whitespace-nowrap">
              Cuando quieras tu información
            </h3>
            <p className="font-['Figtree'] text-xs sm:text-sm md:text-base lg:text-lg mb-4 md:mb-8 text-gray-300">
              Gestiona tu microempresa sin inversión, ¡desde cualquier parte!
            </p>
          </div>
        </div>

        {/* Imagen*/}
        <div className="flex justify-center w-full">
          <img
            src={downlandSectionImage}
            alt="Computadora"
            className="w-full h-auto object-contain max-w-full lg:-mt-32 md:-mt-18"
          />
        </div>
      </div>
    </div>
  );
};

export default downlandSection;
