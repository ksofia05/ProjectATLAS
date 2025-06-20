import React from "react";
import InventoryTable from "../../components/dashboard/InventoryTable";
import EquipmentsTable from "../../components/dashboard/EquipmentsTable";
import ButtonBG from "../../components/common/ButtonBG";

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
          <ButtonBG
          
            className="mt-6 px-4 py-2 w-30 bg-gray-800 rounded-xl shadow-2xl text-white text-center hover:bg-purple-600 hover:shadow-md hover:shadow-purple-500/50 transition-colors"
            onClick={() => setClienteSeleccionado(null)}
          >
            ←  Volver
          </ButtonBG>
          </div>
        </div>
      ) : (
        <InventoryTable onEmojiClick={setClienteSeleccionado} />
      )}
    </div>
  );
}