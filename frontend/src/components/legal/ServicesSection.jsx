import React from "react";
import ServicesImage from "../../../public/img/aboutUsPage/services.svg"
import useOnScreen from '../../hooks/useOnScreen';

// 1. Define la animación flotante en una variable
const floatAnimation = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-5px) rotate(0.5deg); }
    50% { transform: translateY(-10px) rotate(-0.5deg); }
    75% { transform: translateY(-5px) rotate(0.5deg); }
  }
`;

const ServicesSection = () => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  
  return (
    <section ref={ref} className="relative py-16 px-6 lg:px-16 md:py-24 overflow-hidden mt-30">
      {/* 2. Inyecta los keyframes en un bloque de estilo */}
      <style>{floatAnimation}</style>
      
      {/* Imagen para pantalla grande */}
      <div
        className={`hidden lg:block absolute top-1/2 -translate-y-1/2 z-10 mt-5 transition-all duration-1000 ease-out ${
          isVisible ? 'transform-none opacity-100' : '-translate-y-8 opacity-0'
        }`}
        style={{ left: "10vw" }}
      >
        <img
          src={ServicesImage}
          alt="Equipo de trabajo"
          className="max-w-[480px] w-[36vw] h-auto"
          style={{ animation: 'float 8s ease-in-out infinite' }}
        />
      </div>
      {/* Imagen para pantallas medianas */}
      <div className={`lg:hidden w-full flex justify-center items-center mb-8 transition-all duration-1000 ease-out ${
        isVisible ? 'transform-none opacity-100' : '-translate-y-8 opacity-0'
      }`}>
        <img
          src={ServicesImage}
          alt="Equipo de trabajo"
          className="max-w-[260px] sm:max-w-[320px] md:max-w-[340px] w-full h-auto"
          style={{ animation: 'float 8s ease-in-out infinite' }}
        />
      </div>
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-0">
        <div className="w-full lg:w-1/2" />
        <div className={`w-full md:w-1/2 text-right text-white transition-all duration-1000 ease-out delay-[200ms] ${
          isVisible ? 'transform-none opacity-100' : '-translate-y-8 opacity-0'
        }`}>
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
};

export default ServicesSection;