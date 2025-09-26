import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";

export default function TimePicker15({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });

  const options = [];
  for (let h = 6; h <= 18; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === 18 && m > 0) break;
      const hourStr = h.toString().padStart(2, "0");
      const minStr = m.toString().padStart(2, "0");
      options.push(`${hourStr}:${minStr}`);
    }
  }

  const openMenu = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setOpen(true);
  };

  const handleSelect = (opt) => {
    onChange(opt);
    setOpen(false);
  };

  // Cierra el menú si se hace clic fuera del botón o del menú (tiene errores con los modales)
  React.useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (
        btnRef.current &&
        !btnRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative w-full">
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        className={`w-full px-3 py-2 bg-[#1a1a26] border border-slate-600/40 rounded-xl text-white text-sm text-left focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => !disabled && openMenu()}
      >
        {value ? value : "Selecciona hora..."}
      </button>
      {open &&
        createPortal(
          <ul
            ref={menuRef}
            className="z-[99999] max-h-48 overflow-y-auto bg-[#1a1a26] border border-slate-600/40 rounded-xl shadow-lg custom-scroll"
            style={{
              position: "absolute",
              top: menuPos.top,
              left: menuPos.left,
              width: menuPos.width,
            }}
          >
            {options.map((opt) => (
              <li
                key={opt}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-purple-700/30 ${
                  value === opt
                    ? "bg-purple-700/20 text-purple-400"
                    : "text-white"
                }`}
                onClick={() => handleSelect(opt)}
              >
                {opt}
              </li>
            ))}
          </ul>,
          document.body
        )}
      {/* Estilos para el scroll */}
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #6d28d9;
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #181826;
        }
      `}</style>
    </div>
  );
}
