import React from 'react';

const Checkbox = ({ label, name, checked, onChange }) => {
  return (
    <div className="flex items-center mb-4">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="appearance-none w-5 h-5 border border-gray-600 rounded-md bg-gray-800 checked:bg-purple-500 checked:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
        />
        <svg
          className={`absolute top-0 left-0 w-5 h-5 text-white pointer-events-none transition-opacity ${
            checked ? 'opacity-100' : 'opacity-0'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <label htmlFor={name} className="ml-3 text-gray-400 text-sm cursor-pointer leading-none">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;