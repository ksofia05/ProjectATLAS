import React, { useEffect } from "react";
import InventoryTable from "../../components/dashboard/InventoryTable";
import EquipmentsTable from "../../components/dashboard/EquipmentsTable";
import ButtonBG from "../../components/common/ButtonBG";
import { useNavbarTitle } from "../../context/NavbarTitleContext";


export default function InventoryPage() {
  const [clienteSeleccionado, setClienteSeleccionado] = React.useState(null);
  const { setTitle, setSubtitle } = useNavbarTitle();

  useEffect(() => {
    setTitle("Inventario");
    setSubtitle("Organiza y registra los equipos de tus clientes!");
  }, [setTitle, setSubtitle]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
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
