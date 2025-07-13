import React from "react";
import InventoryTable from "../../components/dashboard/InventoryTable";
import EquipmentsTable from "../../components/dashboard/EquipmentsTable";
import ButtonBG from "../../components/common/ButtonBG";

export default function InventoryPage() {
  const [clienteSeleccionado, setClienteSeleccionado] = React.useState(null);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <h1 className="text-3xl font-bold text-white mb-1">
          Cliente / Inventario
        </h1>
        <p className="text-gray-300 mb-4">
          Organiza y registra los equipos de tus clientes!
        </p>
      </div>
      
      {clienteSeleccionado ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <EquipmentsTable cliente={clienteSeleccionado} />
          </div>
          <div className="flex justify-end flex-shrink-0">
            <ButtonBG
              className="mt-6 px-4 py-2 w-30 bg-purple-800 rounded-xl shadow-2xl text-white text-center hover:bg-purple-900 hover:shadow-md hover:shadow-purple-600/50 transition-colors"
              onClick={() => setClienteSeleccionado(null)}
            >
              ← Volver
            </ButtonBG>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <InventoryTable onEmojiClick={setClienteSeleccionado} />
        </div>
      )}
    </div>
  );
}
