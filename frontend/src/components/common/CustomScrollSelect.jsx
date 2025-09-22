import React, { useState, useRef, useEffect } from "react";

export default function CustomScrollSelect({ value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-700/60 text-gray-300 hover:text-white rounded-xl border border-slate-700/50 hover:border-slate-600/60 transition-all duration-200 text-sm font-medium min-w-[70px] justify-center"
      >
        <span>{value === "Todos" ? "Todos" : value}</span>
        <i
          className={`bi bi-chevron-down text-xs transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        ></i>
      </button>

      {/* Dropdown Menu */}
      <div
        className={`
          absolute bottom-full right-0 mb-2 min-w-[80px] bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-xl z-50
          transition-all duration-300 origin-bottom
          ${
            isOpen
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none"
          }
        `}
        style={{ willChange: "opacity, transform" }}
      >
        <div className="py-2">
          {options.map((option, index) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`block w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-slate-700/60 hover:text-white transition-all duration-200 
                ${index === 0 ? "rounded-t-xl" : ""}
                ${index === options.length - 1 ? "rounded-b-xl" : ""}
                ${index > 0 ? "border-t border-slate-600/30" : ""}
              `}
            >
              {option === "Todos" ? "Todos" : option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
