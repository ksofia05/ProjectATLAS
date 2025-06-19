import React from "react";
import InventoryTable from "../../components/dashboard/InventoryTable";
import EquipmentsTable from "../../components/dashboard/EquipmentsTable";
import buttonBG from "../../components/common/ButtonBG";

export default function InventoryPage() {
  const [clienteSeleccionado, setClienteSeleccionado] = React.useState(null);

  return (
    <div className="px-8">
      <h1 className="text-3xl font-bold text-white mb-2">Cliente / Inventario</h1>
      <p className="text-gray-300 mb-8">
        Organiza y registra los equipos de tus clientes!
      </p>
      {/* Estado para ver la tabla de equipos del cliente seleccionado */}
      {clienteSeleccionado ? (
        <div>
          <EquipmentsTable cliente={clienteSeleccionado} />
          <div className="flex justify-end ">
          <buttonBG
          
            className="mt-6 px-4 py-2 bg-gray-700 rounded-xl text-white"
            onClick={() => setClienteSeleccionado(null)}
          >
            ←  Volver
          </buttonBG>
          </div>
        </div>
      ) : (
        <InventoryTable onEmojiClick={setClienteSeleccionado} />
      )}
    </div>
  );
}