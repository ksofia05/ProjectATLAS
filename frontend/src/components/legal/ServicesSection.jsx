import React from "react";


const ServicesSection = () => (
  <section className="relative py-16 px-6 lg:px-16 md:py-24 overflow-hidden mt-30">
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-end gap-12">
      <div className="w-full md:w-1/2 flex justify-start">
        <div className="rounded-3xl overflow-hidden shadow-xl bg-gray-900/40 border-4 border-purple-700/30 min-h-[320px] min-w-[260px] flex items-center justify-center">
          <span className="text-gray-500 text-lg">Plantilla de imagen :3</span>
        </div>
      </div>
      <div className="w-full md:w-1/2 text-right text-white">
        <h2 className="font-['Figtree'] text-4xl md:text-6xl lg:text-8xl font-bold mb-3 text-white">
          Qué Hacemos
        </h2>
        <h3 className="font-['Figtree'] text-base md:text-3xl lg:text-4xl text-purple-300 mb-4">
            Soluciones tecnológicas a la medida
        </h3>
        <p className="font-['Figtree'] text-base md:text-lg lg:text-xl text-gray-300 mb-8">
            En ATLAS desarrollamos software personalizado que responde a las necesidades específicas de cada cliente. Nuestro enfoque combina innovación, calidad y metodologías ágiles como SCRUM, lo que nos permite crear aplicaciones confiables, fáciles de usar y con un diseño enfocado en la experiencia del usuario. Además, ofrecemos acompañamiento en la gestión de datos y soporte continuo, garantizando que nuestras soluciones impulsen la eficiencia y el crecimiento de las organizaciones.
        </p>
      </div>
    </div>
  </section>
);

export default ServicesSection;