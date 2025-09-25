import React from "react";
import ContactsImage from "../../../public/img/aboutUsPage/ContactsUs.svg";
import useOnScreen from '../../hooks/useOnScreen';

const floatAnimation = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-5px) rotate(0.5deg); }
    50% { transform: translateY(-10px) rotate(-0.5deg); }
    75% { transform: translateY(-5px) rotate(0.5deg); }
  }
`;

const ContactsSection = () => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });

  return (
    <section ref={ref} className="relative py-16 px-6 lg:px-16 md:py-24 overflow-hidden">
      <style>{floatAnimation}</style>
      
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-start gap-12">
        <div className={`w-full md:w-1/2 text-left text-white transition-all duration-1000 ease-out ${
          isVisible ? 'transform-none opacity-100' : '-translate-x-full opacity-0'
        }`}>
          <h2 className="font-['Figtree'] text-4xl md:text-6xl lg:text-8xl font-bold mb-4 text-white">
            Contáctanos
          </h2>
          <h3 className="font-['Figtree'] text-base md:text-3xl lg:text-4xl text-purple-300 mb-4">
            Mantengamos la comunicación
          </h3>
          <div className="text-lg md:text-xl text-gray-300 mb-8 space-y-4">
            <p>
              Correo: <a 
                href="mailto:atlas.inovationcompany@gmail.com" 
                className="text-purple-300 underline hover:text-purple-100 transition-colors"
                target="_blank" 
                rel="noopener noreferrer">
                atlas.inovationcompany@gmail.com
              </a>
            </p>
            <p>
            Teléfono/WhatsApp: <a 
              href="https://wa.me/573174666361" 
              className="text-purple-300 underline hover:text-purple-100 transition-colors"
              target="_blank" 
              rel="noopener noreferrer">
              +57 317 466 6361
            </a>
            </p>
            <p>
              Ubicación: Tolima-Ibagué, Colombia
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <img
            src={ContactsImage}
            alt="Equipo de trabajo"

            className="w-4/5 md:w-[32vw] max-w-[420px] h-auto"
            style={{ animation: 'float 8s ease-in-out infinite' }}
          />
        </div>
      </div>
    </section>
  );
};

export default ContactsSection;