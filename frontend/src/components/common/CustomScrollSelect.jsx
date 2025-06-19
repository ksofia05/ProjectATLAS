import React, { useState, useRef, useEffect } from "react";

const CustomScrollSelect = ({
  value,
  options,
  onChange,
  className = "",
  width = "w-16",
  maxHeight = "max-h-40",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${width}`} ref={ref}>
      <button
        className={`bg-[#232336] border border-[#232336] rounded px-2 py-1 text-gray-200 flex items-center justify-between w-full ${className}`}
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        {value}
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul
          className={`absolute z-10 mt-1 bg-[#232336] border border-[#232336] rounded shadow-lg overflow-y-auto ${maxHeight} w-full`}
        >
          {options.map((opt) => (
  <li
    key={opt}
    className={`px-2 py-1 cursor-pointer hover:bg-white/20 ${
      value === opt ? "bg-white/10 text-white font-semibold" : ""
    }`}
    onClick={() => {
      onChange(opt);
      setOpen(false);
    }}
  >
    {opt}
  </li>
))}
        </ul>
      )}
    </div>
  );
};

export default CustomScrollSelect;