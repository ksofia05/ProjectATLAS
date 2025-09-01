import React from "react";

const AboutUsSection = () => (
  <section className="relative py-16 px-6 lg:px-16 md:py-24 overflow-hidden">
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
      <div className="w-full md:w-1/2 flex justify-start">
        <div className="rounded-3xl overflow-hidden shadow-xl bg-gray-900/40 border-4 border-purple-700/30 min-h-[320px] min-w-[260px] flex items-center justify-center">
          <span className="text-gray-500 text-lg">Plantilla para imagen :3</span>
        </div>
      </div>
      <div className="w-full md:w-1/2 text-left text-white mt-30">
        <h2 className="font-['Figtree'] text-4xl md:text-6xl lg:text-8xl font-bold mb-3 text-white">
          Quienes Somos
        </h2>
        <h3 className="font-['Figtree'] text-base md:text-3xl lg:text-4xl text-purple-300 mb-4">
          Nos apasiona la tecnología!
        </h3>
        <p className="font-['Figtree'] text-base md:text-lg lg:text-xl text-gray-300 mb-8">
          En ATLAS somos un equipo de desarrolladores, enfocados en crear soluciones de software innovadoras que optimicen procesos y faciliten la transformación digital de las organizaciones. Nuestra fortaleza está en el trabajo colaborativo, la mejora continua y el compromiso con ofrecer productos de calidad que aporten valor real a nuestros clientes.
        </p>
      </div>
    </div>
  </section>
);

export default AboutUsSection;