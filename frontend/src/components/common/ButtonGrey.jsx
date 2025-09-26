import React from "react";

const ButtonGrey = ({
  children,
  onClick,
  className = "",
  iconOnly = false,
  icon = null,
}) => (
  <button
    onClick={onClick}
    aria-label={iconOnly && icon ? "Botón de acción" : undefined}
    className={`bg-slate-800/50 hover:bg-slate-700/60 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl border border-slate-700/50 hover:border-slate-600/60 transition-all duration-200 font-medium whitespace-nowrap
      ${iconOnly ? "p-2.5 rounded-xl min-w-[44px] justify-center" : ""}
      ${className}`}
  >
    {iconOnly && icon ? icon : children}
  </button>
);

export default ButtonGrey;
