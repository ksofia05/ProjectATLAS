import React, { useState, useEffect } from "react";
import { client as supabase } from "../../supabase/client";
import ButtonGrey from "../common/ButtonGrey";

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        .eq("dni", form.identificacion);

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
        className="mb-4 w-full p-3 rounded-xl bg-[#232336] text-gray-200 border border-[#232336] focus:outline-none focus:border-purple-500 transition"
      />
      <label className="block mb-1 text-sm font-semibold text-white">Nombre</label>
      <input
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Nombre del cliente"
        className="mb-4 w-full p-3 rounded-xl bg-[#232336] text-gray-200 border border-[#232336] focus:outline-none focus:border-purple-500 transition"
      />
      <label className="block mb-1 text-sm font-semibold text-white">Apellido</label>
      <input
        name="apellido"
        value={form.apellido}
        onChange={handleChange}
        placeholder="Apellido del cliente"
        className="mb-4 w-full p-3 rounded-xl bg-[#232336] text-gray-200 border border-[#232336] focus:outline-none focus:border-purple-500 transition"
      />
      <label className="block mb-1 text-sm font-semibold text-white">Email</label>
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Correo Electrónico"
        className="mb-4 w-full p-3 rounded-xl bg-[#232336] text-gray-200 border border-[#232336] focus:outline-none focus:border-purple-500 transition"
      />
      <label className="block mb-1 text-sm font-semibold text-white">Teléfono</label>
      <input
        name="telefono"
        value={form.telefono}
        onChange={handleChange}
        placeholder="Número de teléfono"
        className="mb-6 w-full p-3 rounded-xl bg-[#232336] text-gray-200 border border-[#232336] focus:outline-none focus:border-purple-500 transition"
      />
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