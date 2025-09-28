import React from "react";

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  errorMessage,
  onBlur,
  placeholder = "",
  icon,
  className = "",
  containerClassName = "",
  labelClassName = "",
  errorClassName = "",
  disabled = false,
  required = false,
  ...rest
}) => {
  const defaultInputStyles =
    "w-full px-4 py-3 bg-[#232336] text-white border border-slate-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 transition-all duration-200";

  const inputStyles = `${defaultInputStyles} ${className}`;

  return (
    <div className={containerClassName || "mb-6"}>
      {label && (
        <label
          htmlFor={name}
          className={labelClassName || "text-gray-300 font-medium mb-2"}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          onBlur={onBlur}
          className={`${inputStyles} ${errorMessage ? "border-red-500" : ""} ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          } pr-12`}
          placeholder={placeholder}
          {...rest} 
        />
        {icon && (
          <i
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg bi ${icon}`}
          ></i>
        )}
      </div>
      {errorMessage && (
        <p className={errorClassName || "text-red-400 text-sm mt-1"}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default Input;
