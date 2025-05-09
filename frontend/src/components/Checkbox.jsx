import React from 'react';

const Checkbox = ({ label, name, checked, onChange }) => {
  return (
    <div className="flex items-center mb-4">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
      />
      <label htmlFor={name} className="ml-2 text-gray-400 text-sm">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;