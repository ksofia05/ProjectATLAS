import React from "react";
import Input from "../common/Input";

export default function ClientIdInput({
  value,
  onChange,
  onSuggestionClick,
  suggestions,
  showSuggestions,
  loading,
  error,
  errorMessage,
  onFocus,
  onBlur,
  className,
}) {
  return (
    <div className="relative">
      <Input
        label="N° de identificación"
        name="identificacion"
        value={value}
        onChange={onChange}
        placeholder="Buscar por número de identificación"
        className={`w-full ${errorMessage ? "border-red-500" : ""}`}
        errorMessage={errorMessage}
        autoComplete="off"
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {showSuggestions && (
        <div className="absolute z-20 left-0 right-0 bg-[#232336] border border-[#7c2ae8] rounded-b-xl mt-1 max-h-48 overflow-y-auto shadow-lg">
          {loading ? (
            <div className="px-4 py-2 text-gray-400">Buscando...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((cliente) => (
              <div
                key={cliente.dni}
                className="px-4 py-2 hover:bg-[#2d2d44] cursor-pointer text-white"
                onMouseDown={() => onSuggestionClick(cliente)}
              >
                {cliente.dni} - {cliente.nombre} {cliente.apellido}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-400">Sin resultados</div>
          )}
        </div>
      )}
    </div>
  );
}