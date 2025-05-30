import React from 'react';

const Input = ({ label, type, name, value, onChange, errorMessage, icon, required, containerClassName, placeholder, onIconClick, inputClassName }) => {
  return (
    <div className={containerClassName ? containerClassName : "mb-6"}>
      <label htmlFor={name} className="block text-gray-300 font-medium mb-2">{label}</label>
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-4 py-3 bg-[#2A273A] text-white border ${errorMessage ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
          placeholder={label || label}
        />
        {icon && (
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-400 text-lg bi bg-transparent border-none p-0 m-0 cursor-pointer"
            onClick={onIconClick}
            tabIndex={-1}
            aria-label='Buscar'
          >
            <i className={icon}></i>
          </button>
        )}
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default Input;