import React, { forwardRef } from "react";

const InputCalendario = forwardRef(
  (
    {
      label,
      name,
      value,
      onChange,
      errorMessage,
      icon = "bi-calendar",
      required,
      containerClassName,
      placeholder,
    },
    ref
  ) => {
    return (
      <div className={containerClassName ? containerClassName : "mb-6"}>
        <label
          htmlFor={name}
          className="block text-gray-300 font-medium mb-2"
        >
          {label}
        </label>
        <div className="relative">
          <input
            type="date"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            ref={ref}
            className={`px-4 py-3 bg-[#2A273A] text-white border ${
              errorMessage ? "border-red-500" : "border-gray-600"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full`}
            placeholder={placeholder}
          />
          {icon && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg bi bg-transparent border-none p-0 m-0 cursor-pointer"
              onClick={() => {
                if (ref?.current) {
                  if (typeof ref.current.showPicker === "function") {
                    ref.current.showPicker();
                  } else {
                    ref.current.focus();
                  }
                }
              }}
              tabIndex={-1}
              aria-label="Seleccionar fecha"
              style={{ paddingLeft: 4, paddingRight: 4 }}
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
  }
);

export default InputCalendario;
