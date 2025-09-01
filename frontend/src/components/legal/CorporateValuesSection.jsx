import React from "react";

const values = [
  { name: "Innovación", description: "Buscamos constantemente nuevas ideas y tecnologías para crear soluciones modernas y efectivas" },
  { name: "Compromiso", description: "Cumplimos con los objetivos y necesidades de nuestros clientes con responsabilidad y dedicación" },
  { name: "Colaboración", description: "Fomentamos la colaboración y el respeto entre todos los integrantes de nuestro proyecto" },
  { name: "Calidad", description: "Desarrollamos productos con altos estándares, asegurando eficiencia y confiabilidad" },
  { name: "Responsabilidad", description: "Actuamos con ética, transparencia y conciencia social en cada proceso" },
  { name: "Adaptabilidad", description: "Nos ajustamos con agilidad a los cambios y retos del entorno tecnológico" },
];

const CorporateValuesSection = () => (
  <section className="relative py-16 px-6 lg:px-16 md:py-24 overflow-hidden">
    {/* Patrón de fondo sutil */}
    <div className="absolute inset-0 z-0 bg-repeat bg-[size:100px_100px] opacity-10" style={{ backgroundImage: `linear-gradient(135deg, #4A148C 25%, transparent 25%), linear-gradient(-45deg, #4A148C 25%, transparent 25%), linear-gradient(45deg, #4A148C 25%, transparent 25%), linear-gradient(-135deg, #4A148C 25%, #111827 25%)` }}></div>
    
    <div className="relative z-10 container mx-auto flex flex-col items-center text-white">
      <h2 className="font-['Figtree'] text-4xl md:text-6xl lg:text-8xl font-bold mb-10 text-white text-center">
        Valores Corporativos
      </h2>
        <h3 className="font-['Figtree'] text-base md:text-3xl lg:text-4xl text-purple-300 mb-4">
            Principios que guían nuestro camino
        </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-30 p-20 w-full">
        
        {values.map((value) => (
          <div
            key={value.name}
            className="bg-gradient-to-br from-purple-900/60 to-gray-900/80 rounded-2xl p-20 shadow-lg border border-purple-700/40 hover:scale-105 transition-transform 
                       flex flex-col justify-center items-center text-center aspect-square"
          >
            <h3 className="font-bold text-purple-300 text-3xl md:text-4xl mb-2">{value.name}</h3>
            <p className="text-gray-200 text-base md:text-lg mt-4">{value.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CorporateValuesSection;