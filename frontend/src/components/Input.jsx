import React from 'react';

const Input = ({ label, type, name, value, onChange, icon }) => {
  return (
    <div className="mb-4">
      <label className="block text-white font-medium mb-1">{label}</label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
          placeholder={label}
        />
        {icon && (
          <span className="absolute right-3 top-2 text-gray-400 text-lg">
            {icon}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;