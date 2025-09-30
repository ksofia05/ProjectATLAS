import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../api/apiBase";

function ClientesPorProyecto({ idProyecto, refreshFlag, onClienteClick }) {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idProyecto) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/inventario/clientes_por_proyecto?id_proyecto=${idProyecto}`)
      .then((res) => res.json())
      .then((data) => {
        setClientes(data.clientes || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener clientes:", err);
        setLoading(false);
      });
  }, [idProyecto, refreshFlag]);

  if (loading) return <div className="text-white">Cargando clientes...</div>;
  if (!clientes.length) return <div className="text-white">No hay clientes para este proyecto.</div>;

  return (
    <div className="rounded-2xl bg-[#232234] p-6 mt-4">
      <table className="min-w-full text-white">
        <thead>
          <tr>
            <th className="px-4 py-2">DNI</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Apellido</th>
            <th className="px-4 py-2">Correo</th>
            <th className="px-4 py-2">Teléfono</th>
            <th className="px-4 py-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr
              key={cliente.dni}
              className="hover:bg-purple-900/20 cursor-pointer"
              onClick={() => onClienteClick && onClienteClick(cliente)}
            >
              <td className="px-4 py-2">{cliente.dni}</td>
              <td className="px-4 py-2">{cliente.nombre}</td>
              <td className="px-4 py-2">{cliente.apellido}</td>
              <td className="px-4 py-2">{cliente.correo}</td>
              <td className="px-4 py-2">{cliente.telefono}</td>
              <td className="px-4 py-2">{cliente.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClientesPorProyecto;