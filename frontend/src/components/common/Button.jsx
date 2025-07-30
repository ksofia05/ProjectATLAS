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
      className={`w-full bg-purple-700 text-white py-3 px-4 rounded-lg hover:bg-purple-600 hover:shadow-lg transition-all font-semibold shadow-md ${
        isDisabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {loading ? loadingText : children}
    </button>
  );
};

export default Button;
