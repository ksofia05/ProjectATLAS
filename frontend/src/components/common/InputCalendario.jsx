import React, { forwardRef } from "react";

const InputCalendario = forwardRef(
  (
    {
      label,
      name,
      value,
      onChange,
      errorMessage,
      required,
      containerClassName,
      placeholder = "dd/mm/aaaa",
    },
    ref
  ) => {
    return (
      <div className={containerClassName ? containerClassName : "mb-6"}>
        <label htmlFor={name} className="block text-gray-300 font-medium mb-2">
          {label}
        </label>
        <div className="relative">
          <input
            type="text" 
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            ref={ref}
            className={`px-4 py-3 bg-[#2A273A] text-white border ${
              errorMessage ? "border-red-500" : "border-gray-600"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full pr-12`}
            placeholder={placeholder}
          />
          <i
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 text-lg bi bi-calendar"
            aria-hidden="true"
          ></i>
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
        )}
      </div>
    );
  }
);

export default InputCalendario;
