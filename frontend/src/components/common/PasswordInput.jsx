import React, { useState } from 'react';

const PasswordInput = ({ label, name, value, onChange, errorMessage }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-6">
      <label htmlFor={name} className="block text-gray-300 font-medium mb-2">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 bg-[#2A273A] text-white border ${errorMessage ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
          placeholder={label}
        />
        <i
          className={`absolute right-3 top-3 text-gray-400 text-lg bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} cursor-pointer`}
          onClick={togglePasswordVisibility}
        ></i>
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default PasswordInput;