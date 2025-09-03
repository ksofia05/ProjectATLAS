import React from "react";

const MissionVisionSection = () => (
  <section className="relative py-16 px-6 lg:px-16 md:py-24 overflow-hidden mt-30">
    <div className="container mx-auto flex flex-col items-center justify-center text-white">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-center items-center">
        <div className="w-full md:w-1/2 lg:w-1/3 aspect-square bg-gradient-to-br from-gray-900 to-gray-900/40 rounded-3xl p-8 shadow-xl flex flex-col justify-center items-center text-center transition-transform hover:scale-105">
          <h2 className="font-['Figtree'] text-3xl md:text-4xl font-bold text-purple-300 mb-4">
            Misión
          </h2>
          <p className="font-['Figtree'] text-lg md:text-xl text-gray-200">
            Desarrollar software confiable, escalable e intuitivo, aplicando metodologías ágiles que nos permitan entregar soluciones adaptadas a las necesidades de nuestros usuarios, contribuyendo al crecimiento y la eficiencia de empresas e instituciones.
          </p>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3 aspect-square bg-gradient-to-br from-gray-900 to-gray-900/40 rounded-3xl p-8 shadow-xl flex flex-col justify-center items-center text-center transition-transform hover:scale-105">
          <h2 className="font-['Figtree'] text-3xl md:text-4xl font-bold text-purple-300 mb-4">
            Visión
          </h2>
          <p className="font-['Figtree'] text-lg md:text-xl text-gray-200">
            Ser reconocidos como un referente en innovación tecnológica y desarrollo de software a nivel nacional, impulsando la transformación digital con soluciones que integren calidad, usabilidad e impacto social positivo.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default MissionVisionSection;