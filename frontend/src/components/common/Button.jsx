import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  loading = false,
  loadingText = "Cargando...",
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={isDisabled ? undefined : onClick || (() => {})}
      disabled={isDisabled}
      className={`
        w-full py-3 px-4 rounded-xl font-semibold text-white
        bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800
        shadow-lg transition-all duration-200
        hover:from-purple-800 hover:to-purple-900 hover:shadow-xl
        focus:outline-none focus:ring-2 focus:ring-purple-400
        ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {loading ? loadingText : children}
    </button>
  );
};

export default Button;
