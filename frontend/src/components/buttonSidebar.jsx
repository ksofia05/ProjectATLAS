import React from "react"

const ButtonSidebar = ({ onClick, isOpen, className = "" }) => {
    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center p-2 text-sm text-gray-400 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${className}`}
        >
            <span className="sr-only">
                {isOpen ? "Cerrar sidebar" : "Abrir sidebar"}
            </span>
            {/* Ícono hamburguesa con animación */}
            <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 mt-1 ${isOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 mt-1 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
        </button>
    );
};

export default ButtonSidebar;