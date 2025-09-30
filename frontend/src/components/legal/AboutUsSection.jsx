import React from "react";
import WorkTeam from "../../../public/img/aboutUsPage/WorkTeam.svg";
import useOnScreen from '../../hooks/useOnScreen';

const floatAnimation = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-5px) rotate(0.5deg); }
    50% { transform: translateY(-10px) rotate(-0.5deg); }
    75% { transform: translateY(-5px) rotate(0.5deg); }
  }
`;

const AboutUsSection = () => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });

  return (
    <section ref={ref} className="relative py-16 px-6 lg:px-16 md:py-24 overflow-hidden">
      <style>{floatAnimation}</style>
      
      {/* Imagen para pantallas grandes */}
      <div
        className={`hidden lg:block absolute top-1/2 -translate-y-1/2 z-10 mt-5 transition-all duration-1000 ease-out ${
          isVisible ? 'transform-none opacity-100' : 'translate-y-8 opacity-0'
        }`}
        style={{ left: "10vw" }}
      >
        <img
          src={WorkTeam}
          alt="Equipo de trabajo"
          className="max-w-[420px] w-[32vw] h-auto"
          style={{ animation: 'float 8s ease-in-out infinite' }}
        />
      </div>
      {/* Imagen para pantallas medianas */}
      <div className={`lg:hidden w-full flex justify-center items-center mb-8 transition-all duration-1000 ease-out ${
        isVisible ? 'transform-none opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        <img
          src={WorkTeam}
          alt="Equipo de trabajo"
          className="max-w-[260px] sm:max-w-[320px] md:max-w-[340px] w-full h-auto"
          style={{ animation: 'float 8s ease-in-out infinite' }}
        />
      </div>
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-0">
        <div className="w-full lg:w-1/2" />
        {/* Texto */}
        <div className={`w-full lg:w-1/2 text-left text-white mt-10 lg:mt-20 z-20 transition-all duration-1000 ease-out delay-[200ms] ${
          isVisible ? 'transform-none opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="font-['Figtree'] text-4xl md:text-6xl lg:text-8xl font-bold mb-3 text-white">
            Quienes Somos
          </h2>
          <h3 className="font-['Figtree'] text-base md:text-3xl lg:text-4xl text-purple-300 mb-4">
            ¡Nos apasiona la tecnología!
          </h3>
          <p className="font-['Figtree'] text-base md:text-lg lg:text-xl text-gray-300 mb-8">
            En ATLAS somos un equipo de desarrolladores, enfocados en crear
            soluciones de software innovadoras que optimicen procesos y faciliten
            la transformación digital de las organizaciones. Nuestra fortaleza está
            en el trabajo colaborativo, la mejora continua y el compromiso con
            ofrecer productos de calidad que aporten valor real a nuestros
            clientes.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;