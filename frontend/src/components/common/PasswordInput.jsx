import React, { useState } from "react";

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  errorMessage,
  placeholder = "Ingresa tu contraseña",
  className = "",
  containerClassName = "",
  disabled = false,
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const defaultInputStyles =
    "w-full px-4 py-3 bg-[#232336] text-white border border-slate-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 transition-all duration-200";

  const inputStyles = className || defaultInputStyles;

  return (
    <div className={containerClassName || "mb-6"}>
      {label && (
        <label htmlFor={name} className="block text-gray-300 font-medium mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`${inputStyles} ${errorMessage ? "border-red-500" : ""} ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          } pr-12`}
          placeholder={placeholder}
        />
        <i
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white text-lg bi ${
            showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
          } cursor-pointer transition-colors duration-200 ${
            disabled ? "pointer-events-none opacity-50" : ""
          }`}
          onClick={disabled ? undefined : togglePasswordVisibility}
        ></i>
      </div>
      {errorMessage && (
        <p className="text-red-400 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default PasswordInput;
