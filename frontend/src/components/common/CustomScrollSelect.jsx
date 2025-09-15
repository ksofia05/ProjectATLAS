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
        className="flex items-center gap-2 px-3 py-1 bg-[#232336] text-gray-200 rounded-lg border border-gray-600 hover:border-gray-500 transition text-sm"
      >
        <span>{value === "Todos" ? "Todos" : value}</span>
        <i
          className={`bi bi-chevron-up text-xs transition-transform duration-200 ${
            isOpen ? "rotate-0" : "rotate-180"
          }`}
        ></i>
      </button>

      {/* Dropdown Menu - ahora tiene animaciones lindas :3 */}
      <div
        className={`
          absolute bottom-full right-0 mb-1 w-16 bg-[#232336] border border-gray-600 rounded-lg shadow-lg z-50
          transition-all duration-200 origin-bottom
          ${
            isOpen
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none"
          }
        `}
        style={{ willChange: "opacity, transform" }}
      >
        <div className="py-1">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="block w-full px-3 py-1 text-left text-sm text-gray-200 hover:bg-gray-700 transition"
            >
              {option === "Todos" ? "Todos" : option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
