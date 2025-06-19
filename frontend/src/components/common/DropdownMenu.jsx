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
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <ButtonGrey
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-base ${buttonClassName}`}
        type="button"
      >
        {icon && <span>{icon}</span>}
        {buttonLabel}
        <i className={`bi bi-chevron-down ml-2 transition-transform ${open ? "rotate-180" : ""}`}></i>
      </ButtonGrey>
      {open && (
        <div
          className={`absolute z-20 mt-2 min-w-[160px] bg-[#181825] border border-gray-700 rounded-xl shadow-lg py-2 ${menuClassName} ${align === "right" ? "right-0" : "left-0"}`}
        >
          {options.map((opt, idx) => (
            <button
              key={opt.value || idx}
              className={`w-full text-left px-5 py-2 text-gray-200 hover:bg-[#232336] flex items-center gap-2 transition ${
                opt.selected ? "font-bold text-purple-400" : ""
              }`}
              onClick={() => {
                setOpen(false);
                if (onSelect) onSelect(opt.value);
              }}
              type="button"
            >
              {opt.icon && <span>{opt.icon}</span>}
              {opt.label}
            </button>
          ))}
          {children}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;