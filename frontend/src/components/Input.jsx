import React from 'react';

const Input = ({ label, type, name, value, onChange, errorMessage, icon, required }) => {
  return (
    <div className="mb-6">
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
          placeholder={label}
        />
        {icon && (
          <span className="absolute right-3 top-3 text-gray-400 text-lg">
            {icon}
          </span>
        )}
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default Input;