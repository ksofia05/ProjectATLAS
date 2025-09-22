import React, { useState, useEffect } from "react";
import { client as supabase } from "../../supabase/client";
import ButtonGrey from "../common/ButtonGrey";

// Validación básica
function validateClientForm(form) {
  const errors = {};
  // N° identificación: requerido, solo números, máximo 10 dígitos
  if (!form.identificacion) {
    errors.identificacion = "El número de identificación es obligatorio";
  } else if (!/^\d+$/.test(form.identificacion)) {
    errors.identificacion = "Solo se permiten números";
  } else if (form.identificacion.length > 10) {
    errors.identificacion = "Máximo 10 dígitos";
  }
  // Nombre: requerido
  if (!form.nombre) {
    errors.nombre = "El nombre es obligatorio";
  }
  // Apellido: requerido
  if (!form.apellido) {
    errors.apellido = "El apellido es obligatorio";
  }
  // Email: requerido, debe ser gmail
  if (!form.email) {
    errors.email = "El correo es obligatorio";
  } else if (!/^[\w-.]+@gmail\.com$/.test(form.email)) {
    errors.email = "El correo debe ser de Gmail";
  }
  // Teléfono: requerido, solo números, mínimo 7 dígitos
  if (!form.telefono) {
    errors.telefono = "El teléfono es obligatorio";
  } else if (!/^\d+$/.test(form.telefono)) {
    errors.telefono = "Solo se permiten números";
  } else if (form.telefono.length < 7) {
    errors.telefono = "Debe tener al menos 7 dígitos";
  }
  return errors;
}

export default function EditClientForm({
  cliente,
  idProyecto,
  usuarioIdActual,
  onClose,
  onClienteEdited,
}) {
  const [form, setForm] = useState({
    identificacion: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (cliente) {
      setForm({
        identificacion: cliente.dni || "",
        nombre: cliente.nombre || "",
        apellido: cliente.apellido || "",
        email: cliente.correo || "",
        telefono: cliente.telefono || "",
      });
    }
  }, [cliente]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
    setErrors(validateClientForm({ ...form, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateClientForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("Cliente")
        .update({
          nombre: form.nombre,
          apellido: form.apellido,
          correo: form.email,
          telefono: form.telefono,
        })
        .eq("dni", cliente.dni);

      if (error) throw error;

      if (onClienteEdited) onClienteEdited();
      if (onClose) onClose();
    } catch (err) {
      alert("Error al actualizar cliente");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label className="block mb-1 text-sm font-semibold text-white">N° de identificación</label>
      <input
        name="identificacion"
        value={form.identificacion}
        disabled
        maxLength={10}
        className={`mb-1 w-full p-3 rounded-xl bg-[#232336] text-gray-200 border ${errors.identificacion && (touched.identificacion || isSubmitting) ? "border-red-500" : "border-[#232336]"} focus:outline-none focus:border-purple-500 transition`}
      />
      
      <label className="block mb-1 text-sm font-semibold text-white">Nombre</label>
      <input
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Nombre del cliente"
        className={`mb-1 w-full p-3 rounded-xl bg-[#232336] text-gray-200 border ${errors.nombre && (touched.nombre || isSubmitting) ? "border-red-500" : "border-[#232336]"} focus:outline-none focus:border-purple-500 transition`}
      />
      {(touched.nombre || isSubmitting) && errors.nombre && (
        <span className="text-red-400 text-xs mb-2">{errors.nombre}</span>
      )}

      <label className="block mb-1 text-sm font-semibold text-white">Apellido</label>
      <input
        name="apellido"
        value={form.apellido}
        onChange={handleChange}
        placeholder="Apellido del cliente"
        className={`mb-1 w-full p-3 rounded-xl bg-[#232336] text-gray-200 border ${errors.apellido && (touched.apellido || isSubmitting) ? "border-red-500" : "border-[#232336]"} focus:outline-none focus:border-purple-500 transition`}
      />
      {(touched.apellido || isSubmitting) && errors.apellido && (
        <span className="text-red-400 text-xs mb-2">{errors.apellido}</span>
      )}

      <label className="block mb-1 text-sm font-semibold text-white">Email</label>
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Correo Electrónico"
        className={`mb-1 w-full p-3 rounded-xl bg-[#232336] text-gray-200 border ${errors.email && (touched.email || isSubmitting) ? "border-red-500" : "border-[#232336]"} focus:outline-none focus:border-purple-500 transition`}
      />
      {(touched.email || isSubmitting) && errors.email && (
        <span className="text-red-400 text-xs mb-2">{errors.email}</span>
      )}

      <label className="block mb-1 text-sm font-semibold text-white">Teléfono</label>
      <input
        name="telefono"
        value={form.telefono}
        onChange={handleChange}
        placeholder="Número de teléfono"
        className={`mb-2 w-full p-3 rounded-xl bg-[#232336] text-gray-200 border ${errors.telefono && (touched.telefono || isSubmitting) ? "border-red-500" : "border-[#232336]"} focus:outline-none focus:border-purple-500 transition`}
      />
      {(touched.telefono || isSubmitting) && errors.telefono && (
        <span className="text-red-400 text-xs mb-2">{errors.telefono}</span>
      )}

      <ButtonGrey
        type="submit"
        className="w-full bg-purple-600 py-3 rounded-xl font-semibold text-white mt-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Guardando..." : "Guardar cambios"}
      </ButtonGrey>
    </form>
  );
}