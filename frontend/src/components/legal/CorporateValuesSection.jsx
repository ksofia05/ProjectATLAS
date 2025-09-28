import React from "react";
import useOnScreen from '../../hooks/useOnScreen';

const values = [
  { name: "Innovación", description: "Buscamos constantemente nuevas ideas y tecnologías para crear soluciones modernas y efectivas" },
  { name: "Compromiso", description: "Cumplimos con los objetivos y necesidades de nuestros clientes con responsabilidad y dedicación" },
  { name: "Colaboración", description: "Fomentamos la colaboración y el respeto entre todos los integrantes de nuestro proyecto" },
  { name: "Calidad", description: "Desarrollamos productos con altos estándares, asegurando eficiencia y confiabilidad" },
  { name: "Responsabilidad", description: "Actuamos con ética, transparencia y conciencia social en cada proceso" },
  { name: "Adaptabilidad", description: "Nos ajustamos con agilidad a los cambios y retos del entorno tecnológico" },
];

const CorporateValuesSection = () => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.2 });

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-16 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-repeat bg-[size:100px_100px] opacity-10" ></div>
      
      <div className="relative z-10 container mx-auto flex flex-col items-center text-white max-w-7xl">
        <h2 className={`font-['Figtree'] text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 md:mb-8 lg:mb-10 text-white text-center transition-all duration-1000 ease-out ${
          isVisible ? 'transform-none opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          Valores Corporativos
        </h2>
        <h3 className={`font-['Figtree'] text-lg md:text-2xl lg:text-3xl xl:text-4xl text-purple-300 mb-8 md:mb-12 lg:mb-16 text-center transition-all duration-1000 ease-out delay-[200ms] ${
          isVisible ? 'transform-none opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          Principios que guían nuestro camino
        </h3>
        
        {/* Grid responsivo con tarjetas cuadradas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 w-full max-w-6xl">
          {values.map((value, index) => (
            <div
              key={value.name}
              className={`
                bg-gradient-to-br from-purple-900/60 to-gray-900/80 rounded-2xl p-6 md:p-8 lg:p-10 shadow-lg border border-purple-700/40 hover:scale-105 transition-transform duration-500
                flex flex-col justify-center items-center text-center aspect-square
                ${isVisible ? 'transform-none opacity-100' : 'translate-y-8 opacity-0'}
                delay-[${300 + index * 100}ms]
              `}
            >
              <h3 className="font-bold text-purple-300 text-xl md:text-2xl lg:text-3xl mb-3 md:mb-4">
                {value.name}
              </h3>
              <p className="text-gray-200 text-sm md:text-base lg:text-lg leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CorporateValuesSection;