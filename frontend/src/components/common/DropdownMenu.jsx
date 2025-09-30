import React, { useState, useRef, useEffect } from "react";
import ButtonGrey from "../common/ButtonGrey";

const DropdownMenu = ({
  buttonLabel,
  options = [],
  onSelect,
  buttonClassName = "",
  menuClassName = "",
  icon = null,
  align = "left",
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [actualAlign, setActualAlign] = useState(align);
  const ref = useRef();
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (open && menuRef.current && ref.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const buttonRect = ref.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Si el menú se sale por la derecha, alinearlo a la derecha
      if (menuRect.right > viewportWidth - 10) {
        setActualAlign("right");
      }
      // Si el menú se sale por la izquierda, alinearlo a la izquierda
      else if (menuRect.left < 10) {
        setActualAlign("left");
      }
      // Sino, usar la alineación original (prop)
      else {
        setActualAlign(align);
      }
    }
  }, [open, align]);

  return (
    <div className="relative" ref={ref}>
      <ButtonGrey
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm ${buttonClassName}`}
        type="button"
      >
        {icon && <span>{icon}</span>}
        {buttonLabel}
        <i
          className={`bi bi-chevron-down transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        ></i>
      </ButtonGrey>
      <div
        ref={menuRef}
        className={`
          absolute z-20 mt-2 min-w-[180px] bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-xl
          ${menuClassName} 
          ${actualAlign === "right" ? "right-0" : "left-0"}
          transition-all duration-300 origin-top
          ${
            open
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none"
          }
        `}
        style={{ willChange: "opacity, transform" }}
      >
        <div className="py-2">
          {options.map((opt, idx) => (
            <button
              key={opt.value || idx}
              className={`w-full text-left px-4 py-3 text-gray-300 hover:bg-slate-700/60 hover:text-white flex items-center gap-3 transition-all duration-200 
                ${idx === 0 ? "rounded-t-xl" : ""} 
                ${idx === options.length - 1 ? "rounded-b-xl" : ""}
                ${idx > 0 ? "border-t border-slate-600/30" : ""}
                ${
                  opt.selected ? "font-semibold text-white bg-slate-700/60" : ""
                }
              `}
              onClick={() => {
                setOpen(false);
                if (onSelect) onSelect(opt.value);
              }}
              type="button"
            >
              {opt.icon && <span className="text-lg">{opt.icon}</span>}
              <span>{opt.label}</span>
            </button>
          ))}
          {children}
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;
