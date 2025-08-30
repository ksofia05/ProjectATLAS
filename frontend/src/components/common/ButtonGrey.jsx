import React from "react";

const ButtonGrey = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`ml-auto bg-gray-800 text-gray-200 px-3 py-1 rounded-lg whitespace-nowrap transition
      hover:bg-[#7c2ae8] hover:text-white
      focus:bg-[#7c2ae8] focus:text-white
      active:bg-[#7c2ae8] active:text-white
      ${className}`}
  >
    {children}
  </button>
);

export default ButtonGrey;
