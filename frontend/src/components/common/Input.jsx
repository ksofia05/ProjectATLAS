  import React from 'react';

  const Input = ({ label, type, name, value, onChange, errorMessage, icon, required, containerClassName, placeholder, onIconClick, inputClassName, list, as, rows, maxLength, onBlur, autoFocus, readOnly }) => {
    return (
      <div className={containerClassName ? containerClassName : "mb-6"}>
        {label && <label htmlFor={name} className="block text-gray-300 font-medium mb-2">{label}</label>}
        <div className="relative">
          {as === "textarea" ? (
            <textarea
              id={name}
              name={name}
              value={value}
              onChange={onChange}
              required={required}
              rows={rows || 2}
              maxLength={maxLength}
              onBlur={onBlur}
              autoFocus={autoFocus}
              readOnly={readOnly}
              className={`px-4 py-3 bg-[#2A273A] text-white border ${errorMessage ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputClassName ? inputClassName : "w-full"}`}
              placeholder={placeholder}
            />
          ) : (
            <input
              type={type}
              id={name}
              name={name}
              value={value}
              onChange={onChange}
              required={required}
              className={`px-4 py-3 bg-[#2A273A] text-white border ${errorMessage ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputClassName ? inputClassName : "w-full"}`}
              placeholder={placeholder}
              list={list}
              maxLength={maxLength}
              onBlur={onBlur}
              autoFocus={autoFocus}
              readOnly={readOnly}
            />
          )}
          {icon && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg bi bg-transparent border-none p-0 m-0 cursor-pointer"
              onClick={onIconClick}
              tabIndex={-1}
              aria-label='Buscar'
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
  };

  export default Input;