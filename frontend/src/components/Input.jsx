import React from 'react';

const Input = ({ label, type, name, value, onChange, errorMessage, icon, required }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-white font-medium mb-1">{label}</label>
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-4 py-2 bg-gray-800 text-white border ${errorMessage ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:shadow-outline`}
          placeholder={label}
        />
        {icon && (
          <span className="absolute right-3 top-2 text-gray-400 text-lg">
            {icon}
          </span>
        )}
      </div>
      {errorMessage && (
        <p className="text-red-500 text-xs italic mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default Input;
