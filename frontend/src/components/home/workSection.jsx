import React, { useEffect, useState } from 'react';
import workImage from '../../../public/img/workImageSection.svg'

const WorkSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animacion
    setIsVisible(true);
  }, []);

  return (
    <div className="relative bg-black py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b"></div>
      
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <div 
            className={`w-full md:w-1/2 transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
            } order-2 md:order-1`}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-purple-900/20 rounded-full blur-xl"></div>
              
              <div className="relative animate-float">
                <img
                  src={workImage}
                  alt="Trabajando en equipo"
                  className="w-full max-w-lg mx-auto drop-shadow-2xl rounded"
                />
              </div>
            </div>
          </div>
          
          <div 
            className={`text-white w-full md:w-1/2 px-4 sm:px-6 md:px-8 text-center md:text-right mb-10 md:mb-0 transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'
            } order-1 md:order-2`}
          >
            <h2 className="font-['Figtree'] text-4xl md:text-6xl lg:text-8xl font-bold mb-3 text-white">
              Trabaja
            </h2>
            <h3 className="font-['Figtree'] text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-purple-300">
              junto a tus colaboradores
            </h3>
            <p className="font-['Figtree'] text-sm md:text-base lg:text-lg mb-8 text-gray-300">
              Gestiona tu microempresa sin inversión, ¡desde cualquier parte!
            </p>
            
            
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-5px) rotate(0.5deg); }
          50% { transform: translateY(-10px) rotate(-0.5deg); }
          75% { transform: translateY(-5px) rotate(0.5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(75, 0, 130, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(75, 0, 130, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default WorkSection;