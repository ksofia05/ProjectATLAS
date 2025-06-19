import React from "react";

const ButtonGrey = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`ml-auto bg-gray-800 text-gray-200 px-3 py-1 rounded-lg whitespace-nowrap hover:bg-[#7c2ae8] hover:text-white transition ${className}`}
  >
    {children}
  </button>
);

export default ButtonGrey;