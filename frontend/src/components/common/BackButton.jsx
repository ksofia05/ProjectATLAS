import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = ({
  onClick, // A esta parte le podemos pasar una función personalizada
  className = "",
  iconClassName = "",
  label = "",
  to = null, // esto por si vamos a pasarle una ruta específica
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onClick) return onClick();
    if (to) return navigate(to);
    navigate(-1); // Volver atrás
  };

  return (
  <button
    onClick={handleBack}
    className={`w-12 h-12 flex items-center justify-center bg-[#232336] hover:bg-[#2d2d44] text-white rounded-full shadow-lg transition-colors duration-200 ${className}`}
    aria-label="Volver"
    type="button"
  >
    <i className={`bi bi-arrow-left text-2xl ${iconClassName}`}></i>
    {label && <span className="ml-2">{label}</span>}
  </button>
);
};

export default BackButton;