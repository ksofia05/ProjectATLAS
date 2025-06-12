import React from "react";

export default function Switch({ checked, onChange }) {
  return (
    <button
      type="button"
      className={`w-7 h-4 flex items-center rounded-full px-0.5 transition-colors duration-200
        ${checked ? "bg-green-500" : "bg-gray-600"}
        focus:outline-none`}
      onClick={() => onChange(!checked)}
      aria-checked={checked}
      role="switch"
    >
      <span
        className={`w-3 h-3 bg-white rounded-full shadow flex items-center justify-center text-xs transition-transform duration-200
          ${checked ? "translate-x-3" : ""}
        `}
      >
        {checked ? (
          <svg width="10" height="10" viewBox="0 0 10 10" className="text-green-500">
            <path d="M2 5.5L4.5 8L8 2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 10 10" className="text-gray-400">
            <path d="M3 3L7 7M7 3L3 7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          </svg>
        )}
      </span>
    </button>
  );
}