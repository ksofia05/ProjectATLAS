import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick || (() => {})} //Para arreglar el error
      className={`w-full bg-purple-700 text-white py-3 px-4 rounded-lg hover:bg-purple-600 hover:shadow-lg transition-all font-semibold shadow-md ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;