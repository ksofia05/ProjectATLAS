import React, { useEffect, useState } from "react";

const testimoniosSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger de animacion al componente
    setIsVisible(true);
  }, []);
  // Datos de testimonios
  const testimonios = [
    {
      id: 1,
      nombre: "María González",
      texto:
        "Esta aplicación cambió la forma en que manejo mi negocio. La interfaz es intuitiva y puedo acceder a mis datos desde cualquier lugar.",
      avatar: "/img/avatar1.jpg",
    },
    {
      id: 2,
      nombre: "Carlos Ramírez",
      texto:
        "Increíble experiencia de usuario. Me encanta poder gestionar toda mi información sin complicaciones y con un diseño tan elegante.",
      avatar: "/img/avatar2.jpg",
    },
    {
      id: 3,
      nombre: "Laura Méndez",
      texto:
        "La mejor inversión para mi microempresa. La aplicación es rápida, visualmente atractiva y muy fácil de usar.",
      avatar: "/img/avatar3.jpg",
    },
  ];

  return (
    <div className="relative w-full py-16">
      <div className="absolute inset-0 z-0 bg-black"></div>
      {/* Esfera difuminada morada - posicionada en la esquina superior izquierda */}
      <div className="absolute top-10 left-0 w-96 h-96 rounded-full bg-purple-600 opacity-30 blur-3xl"></div>

      {/* Esfera difuminada azul - posicionada en la esquina inferior derecha */}
      <div className="absolute bottom-10 -right-15 w-96 h-96 rounded-full bg-blue-600 opacity-30 blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Título de la sección */}
        <div
          className={`text-white w-full  text-center transition-all duration-700 transform ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-12"
          }`}
        >
          <h2 className="font-['Figtree'] pt-3 text-4xl md:text-5xl lg:text-6xl font-bold text-white whitespace-nowrap">
            Testimonios
          </h2>
          <h3 className="font-['Figtree'] text-xl md:text-2xl lg:text-3xl font-bold mt-3 text-purple-300 whitespace-nowrap">
            Lo que nuestros usuarios opinan
          </h3>
        </div>

        {/* Tarjetas de testimonios */}
        <div className="m-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonios.map((testimonio) => (
            <div
              key={testimonio.id}
              className={`
                    bg-purple-900/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 
                    hover:shadow-lg hover:shadow-purple-500/30 
                    transition-all duration-300 ease-in-out
                    hover:scale-105 
                  `}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-600 overflow-hidden mr-4">
                  {/* Usa una imagen de placeholder */}
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-700"></div>
                </div>
                <div>
                  <h4 className="font-['Figtree'] text-lg font-bold text-white">
                    {testimonio.nombre}
                  </h4>
                </div>
              </div>
              <p className="font-['Figtree'] text-gray-300 italic">
                "{testimonio.texto}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default testimoniosSection;
