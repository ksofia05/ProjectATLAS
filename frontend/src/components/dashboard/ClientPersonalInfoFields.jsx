import React from "react";
import ClientIdInput from "./ClientIdInput";
import Input from "../common/Input";

export default function ClientPersonalInfoFields({
  form,
  errors,
  touched,
  triedSubmit,
  searchResults,
  showSuggestions,
  loadingSearch,
  handleIdInputChange,
  handleSuggestionClick,
  handleChange,
  setShowSuggestions,
  setTouched,
}) {
  return (
    <>
      <ClientIdInput
        value={form.identificacion}
        onChange={handleIdInputChange}
        suggestions={searchResults}
        showSuggestions={showSuggestions}
        loading={loadingSearch}
        error={errors.identificacion}
        onSuggestionClick={handleSuggestionClick}
        onFocus={() => {
          if (searchResults.length > 0) setShowSuggestions(true);
        }}
        onBlur={() => {
          setTimeout(() => setShowSuggestions(false), 150);
          setTouched(prev => ({ ...prev, identificacion: true }));
        }}
      />
      {(touched.identificacion || triedSubmit) && errors.identificacion && (
        <span className="text-red-400 text-xs">{errors.identificacion}</span>
      )}

      <Input
        label="Nombre"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Nombre del cliente"
        inputClassName={`w-full ${errors.nombre ? "border-red-500" : ""}`}
        onBlur={() => setTouched(prev => ({ ...prev, nombre: true }))}
      />
      {(touched.nombre || triedSubmit) && errors.nombre && (
        <span className="text-red-400 text-xs">{errors.nombre}</span>
      )}

      <Input
        label="Apellido"
        name="apellido"
        value={form.apellido}
        onChange={handleChange}
        placeholder="Apellido del cliente"
        inputClassName={`w-full ${errors.apellido ? "border-red-500" : ""}`}
        onBlur={() => setTouched(prev => ({ ...prev, apellido: true }))}
      />
      {(touched.apellido || triedSubmit) && errors.apellido && (
        <span className="text-red-400 text-xs">{errors.apellido}</span>
      )}

      <Input
        label="Email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Correo Electrónico"
        inputClassName={`w-full ${errors.email ? "border-red-500" : ""}`}
        onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
      />
      {(touched.email || triedSubmit) && errors.email && (
        <span className="text-red-400 text-xs">{errors.email}</span>
      )}

      <Input
        label="Teléfono"
        name="telefono"
        value={form.telefono}
        onChange={handleChange}
        placeholder="Número de teléfono"
        inputClassName={`w-full ${errors.telefono ? "border-red-500" : ""}`}
        onBlur={() => setTouched(prev => ({ ...prev, telefono: true }))}
      />
      {(touched.telefono || triedSubmit) && errors.telefono && (
        <span className="text-red-400 text-xs">{errors.telefono}</span>
      )}
    </>
  );
}