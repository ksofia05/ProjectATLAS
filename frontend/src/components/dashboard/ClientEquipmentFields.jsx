import Input from "../common/Input";
import React, { useState } from "react";


export default function ClientEquipmentFields({
  form,
  errors,
  loadingSerie,
  handleChange,
  touched,
  triedSubmit,
  setTouched,
  seriesSugeridas = [],
}) {
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [serieAutocompletada, setSerieAutocompletada] = useState(false);
  const filteredSeries = showSugerencias ? seriesSugeridas : [];

  // Filtra sugerencias según lo que escribe el usuario
  // const filteredSeries = form.serie
  //   ? seriesSugeridas.filter(s =>
  //       s.toLowerCase().includes(form.serie.toLowerCase())
  //     )
  //   : seriesSugeridas;
 

  return (
    <>
      <Input
        label="Entrada"
        name="entrada"
        type="date"
        value={form.entrada}
        onChange={handleChange}
        inputClassName={`w-full ${errors.entrada ? "border-red-500" : ""}`}
        onBlur={() => setTouched(prev => ({ ...prev, entrada: true }))}
      />
      {(touched.entrada || triedSubmit) && errors.entrada && (
        <span className="text-red-400 text-xs">{errors.entrada}</span>
      )}

 <div className="relative mb-6">
        <label className="text-white block mb-2">No. Serie</label>
        <input
          type="text"
          name="serie"
          value={loadingSerie ? "Cargando..." : form.serie}
          onChange={e => {
            handleChange(e);
            setSerieAutocompletada(false); // Si el usuario escribe, desbloquea
          }}
          placeholder="Número de serie"
          className={`w-full px-4 py-3 bg-[#2A273A] text-white border ${errors.serie ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
          disabled={loadingSerie}
          readOnly={serieAutocompletada} // Solo bloquea si fue autocompletado
          onFocus={() => setShowSugerencias(true)}
          onBlur={() => setTimeout(() => setShowSugerencias(false), 100)}
        />
        {showSugerencias && filteredSeries.length > 0 && (
          <div className="absolute left-0 right-0 mt-1 bg-[#232336] border-2 border-purple-400 rounded-xl shadow-lg z-50">
            {filteredSeries.map((serie, idx) => (
              <div
                key={idx}
                className="px-4 py-2 hover:bg-[#2d2d44] cursor-pointer text-white"
                onMouseDown={() => {
                  handleChange({ target: { name: "serie", value: serie } });
                  setSerieAutocompletada(true); // Bloquea después de seleccionar
                  setShowSugerencias(false);
                }}
              >
                {serie}
              </div>
            ))}
          </div>
        )}
      </div>
      {(touched.serie || triedSubmit) && errors.serie && (
        <span className="text-red-400 text-xs">{errors.serie}</span>
      )}

      <div className="mb-4">
        <label className="text-white block mb-2">Comentario:</label>
        <textarea
          name="comentario"
          value={form.comentario}
          onChange={handleChange}
          className={`w-full rounded-lg p-2 bg-[#232336] text-white ${errors.comentario ? "border border-red-500" : ""}`}
          rows={3}
          placeholder="Añade una descripción"
          onBlur={() => setTouched(prev => ({ ...prev, comentario: true }))}
        />
        {(touched.comentario || triedSubmit) && errors.comentario && (
          <span className="text-red-400 text-xs">{errors.comentario}</span>
        )}
      </div>
    </>
  );
}