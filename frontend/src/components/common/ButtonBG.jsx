import React from "react";

const ButtonBG = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`ml-auto bg-gradient-to-l from-[#181825] to-[#232335] text-gray-200 px-3 py-1 rounded-lg whitespace-nowrap hover:bg-[#7c2ae8] hover:text-white transition ${className}`}
  >
    {children}
  </button>
);

export default ButtonBG;