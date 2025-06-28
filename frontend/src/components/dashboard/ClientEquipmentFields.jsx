import React from "react";
import Input from "../common/Input";

export default function ClientEquipmentFields({
  form,
  errors,
  loadingSerie,
  handleChange,
  touched,
  triedSubmit,
  setTouched,
}) {
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

      <Input
        label="No. de serie"
        name="serie"
        value={loadingSerie ? "Cargando..." : form.serie}
        onChange={handleChange}
        placeholder="Número de serie"
        inputClassName={`w-full ${errors.serie ? "border-red-500" : ""}`}
        disabled={loadingSerie}
        onBlur={() => setTouched(prev => ({ ...prev, serie: true }))}
      />
      {(touched.serie || triedSubmit) && errors.serie && (
        <span className="text-red-400 text-xs">{errors.serie}</span>
      )}

      <div className="mb-4">
        <label className="text-white block mb-1">Comentario:</label>
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