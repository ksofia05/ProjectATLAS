import React, { useState, useEffect, useRef } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { showSuccessToast, showErrorToast } from "../common/popUp/Loading";

// Simulación de clientes registrados
const CLIENTES = [
  {
    identificacion: "1107976737",
    nombre: "Jose Jacobo",
    email: "jose@email.com",
    telefono: "3001234567",
  },
  {
    identificacion: "1107977786",
    nombre: "Dilan Francisco",
    email: "dilan@email.com",
    telefono: "3009876543",
  },
  {
    identificacion: "1107979999",
    nombre: "Daniel Orlando",
    email: "daniel@email.com",
    telefono: "3012345678",
  },
];

// Funcion para conseguir la fecha de hoy
function getToday() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

export default function RegisterClientDrawer({ open, onClose }) {
  const [form, setForm] = useState({
    identificacion: "",
    nombre: "",
    email: "",
    telefono: "",
    entrada: getToday(), // por defecto tendra la fecha de hoy (anny me confundio :b)
    serie: "",
    comentario: "",
    imagen: null,
  });

  // Controla si el panel ya esta montado
  const [mounted, setMounted] = useState(false);
  // Controla la clase de animación
  const [showDrawer, setShowDrawer] = useState(false);

  // Buscador de clientes
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef();

  // Animación de entrada/salida
  const timeoutRef = useRef();

  useEffect(() => {
    if (open) {
      setMounted(true);
      timeoutRef.current = setTimeout(() => setShowDrawer(true), 10);
    } else if (mounted) {
      setShowDrawer(false);
      timeoutRef.current = setTimeout(() => setMounted(false), 300);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [open]);

  // Filtra de los clientes según la búsqueda
  useEffect(() => {
    if (search.length > 0) {
      setFiltered(
        CLIENTES.filter(c =>
          c.identificacion.includes(search)
        )
      );
      setShowDropdown(true);
    } else {
      setFiltered([]);
      setShowDropdown(false);
    }
  }, [search]);

    // Cierra el panel lateral al hacer clic fuera
  const handleSelectCliente = (cliente) => {
    setForm(f => ({
      ...f,
      identificacion: cliente.identificacion,
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono,
    }));
    setSearch(cliente.identificacion);
    setShowDropdown(false);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.identificacion || !form.nombre || !form.email) {
      showErrorToast("Completa los campos obligatorios");
      return;
    }
    showSuccessToast("Equipo registrado correctamente");
    onClose();
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Fondo con un blur */}
      <div
        className={`
          fixed inset-0 transition-all duration-300
          ${showDrawer ? "backdrop-blur-[2px] bg-black/5 pointer-events-auto" : "backdrop-blur-0 bg-transparent pointer-events-none"}
        `}
        onClick={onClose}
        aria-label="Cerrar panel"
      />
      {/* Panel flotante con sus efectos */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-full max-w-md bg-[#181825] shadow-2xl p-8 overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${showDrawer ? "translate-x-0" : "translate-x-full"}
          rounded-l-3xl
          pointer-events-auto
        `}
        style={{
          boxShadow: "0 0 32px 0 rgba(255,255,255,0.08), 0 2px 8px 0 rgba(0,0,0,0.12)"
        }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Registro de cliente</h2>
          <button onClick={onClose} className="text-white text-2xl" tabIndex={0}>&times;</button>
        </div>
        {/* Buscador de cliente */}
        <div className="mb-4 relative">
          <label className="text-white block mb-1 font-semibold">Buscar cliente por identificación</label>
          <input
            type="text"
            ref={searchInputRef}
            className="w-full rounded-lg p-2 bg-[#232336] text-white outline-none"
            placeholder="Buscar por número de identificación"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => { if (filtered.length > 0) setShowDropdown(true); }}
            autoComplete="off"
          />
          {/* Este es filtro de los resultados, y su autocompletado */}
          {showDropdown && filtered.length > 0 && (
            <ul className="absolute left-0 right-0 bg-[#232336] border border-[#232336] rounded-lg mt-1 z-10 max-h-40 overflow-y-auto">
              {filtered.map(cliente => (
                <li
                  key={cliente.identificacion}
                  className="p-2 hover:bg-[#181825] cursor-pointer text-white"
                  onClick={() => handleSelectCliente(cliente)}
                >
                  {cliente.identificacion} - {cliente.nombre}
                </li>
              ))}
            </ul>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <Input
            label="N° de identificación"
            name="identificacion"
            value={form.identificacion}
            onChange={handleChange}
            placeholder="Buscar"
          />
          <Input
            label="Nombre de usuario"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre de identificación"
          />
          <Input
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Correo Electrónico"
          />
          <Input
            label="Teléfono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="Número de teléfono"
          />
          <Input
            label="Entrada"
            name="entrada"
            type="date"
            value={form.entrada}
            onChange={handleChange}
          />
          <Input
            label="No. de serie"
            name="serie"
            value={form.serie}
            onChange={handleChange}
            placeholder="Número de serie"
          />
          <div className="mb-4">
            <label className="text-white block mb-1">Comentario:</label>
            <textarea
              name="comentario"
              value={form.comentario}
              onChange={handleChange}
              className="w-full rounded-lg p-2 bg-[#232336] text-white"
              rows={3}
              placeholder="Añade una descripción"
            />
          </div>
          <div className="mb-6">
            <input
              type="file"
              name="imagen"
              id="input-imagen"
              className="hidden"
              onChange={handleChange}
            />
            <label htmlFor="input-imagen">
              <Button type="button" className="w-full bg-purple-700">
                + Añade una imagen
              </Button>
            </label>
            {form.imagen && (
              <span className="text-white mt-2 block">{form.imagen.name}</span>
            )}
          </div>
          <Button className="w-full bg-purple-600" type="submit">
            Registrar
          </Button>
        </form>
       </aside>
    </div>
  );
}