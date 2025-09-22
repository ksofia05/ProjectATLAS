import React from "react";

export default function Switch({ checked, onChange }) {
  return (
    <button
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:ring-offset-2 focus:ring-offset-slate-800 ${
        checked
          ? "bg-slate-600 shadow-sm"
          : "bg-slate-700/80 border border-slate-600/50"
      } hover:opacity-90`}
      onClick={onChange}
      aria-checked={checked}
      role="switch"
    >
      <span
        className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}
