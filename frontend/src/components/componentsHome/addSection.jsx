import React, { useEffect, useState } from "react";
import addSectionImage from "../../../public/img/addSection.svg";

const AddSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger de estado
    setIsVisible(true);
  }, []);

  return (
    <div className="relative py-16 bg-black ">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-purple-700/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 150" className="w-full">
            <path
              d="M0,100 
            C200,160 300,40 500,100 
            C700,160 800,80 1000,120 
            C1100,140 1200,100 1200,100 
            L1200,150 L0,150 Z"
              fill="rgba(126, 34, 206, 0.3)"
            />
            <path
              d="M0,120 
            C250,180 350,60 550,110 
            C750,160 850,90 1050,130 
            C1150,150 1200,120 1200,120
            L1200,150 L0,150 Z"
              fill="rgba(126, 34, 206, 0.2)"
            />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Text content with animations */}
          <div
            className={`text-white w-full md:w-1/2 text-center md:text-left transition-all duration-700 transform ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            }`}
          >
            <h2 className="font-bold text-5xl  md:text-6xl lg:text-7xl mb-4 bg-gradient-to-r">
              Agrega
            </h2>
            <h3 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-4 text-purple-100">
              tu inventario por cliente
            </h3>
            <p className="text-base lg:text-lg mb-4 text-gray-300 ">
              Encuentra en segundos lo que antes te tomaba horas
            </p>
          </div>

          {/* Image with animation effect */}
          <div
            className={`w-full md:w-1/2 transition-all duration-700 transform ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative">
              {/* Purple glow effect behind image
              <div className="absolute -inset-4 rounded-2xl blur-xl"></div> */}

              {/* The image with smooth animation using CSS */}
              <div
                className="relative animate-float"
                style={{
                  animation: "float 4s ease-in-out infinite",
                }}
              >
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={addSectionImage}
                    alt="Dashboard Preview"
                    className="w-full shadow-lg transform transition-transform duration-500"
                  />
                </div>

                {/* elementos decorativo !no borrar */}
                {/* <div className="absolute -top-6 -right-6 w-12 h-12 bg-purple-500 rounded-full blur-sm opacity-60"></div>
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-blue-500 rounded-full blur-sm opacity-60"></div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* animacion de flotado */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AddSection;
