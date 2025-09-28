import React from "react";

const ButtonSidebar = ({
  onClick,
  isOpen,
  className = "",
  gradient = true,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Cerrar menú lateral" : "Abrir menú lateral"}
      className={`
        w-10 h-10 rounded-xl flex items-center justify-center
        ${gradient ? "bg-gradient-to-br from-slate-800/60 to-slate-900/60" : ""}
        backdrop-blur-sm border border-slate-700/40
        text-white hover:from-slate-700/70 hover:to-slate-800/70 
        hover:border-purple-500/30 hover:text-purple-300
        transition-all duration-300 ease-in-out
        shadow-lg hover:shadow-purple-500/10
        active:scale-95 group
        ${className}
      `}
      {...props}
    >
      <i
        className={`bi ${
          isOpen ? "bi-x-lg" : "bi-list"
        } text-lg group-hover:scale-110 transition-transform duration-200`}
      ></i>
    </button>
  );
};

export default ButtonSidebar;
