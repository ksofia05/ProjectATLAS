import React from "react";

const ButtonGrey = ({ 
  children, 
  onClick, 
  className = "", 
  iconOnly = false,
  icon = null 
}) => (
  <button
    onClick={onClick}
    className={`ml-auto bg-gray-800 text-gray-200 px-3 py-1 rounded-lg whitespace-nowrap transition
      hover:bg-[#7c2ae8] hover:text-white
      focus:bg-[#7c2ae8] focus:text-white
      active:bg-[#7c2ae8] active:text-white
      ${iconOnly ? 'p-2 rounded-full' : ''}
      ${className}`}
  >
    {iconOnly && icon ? icon : children}
  </button>
);

export default ButtonGrey;