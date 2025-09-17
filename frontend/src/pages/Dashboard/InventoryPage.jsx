import React, { useEffect } from "react";
import InventoryTable from "../../components/dashboard/InventoryTable";
import EquipmentsTable from "../../components/dashboard/EquipmentsTable";
import BackButton from "../../components/common/BackButton";
import { useNavbarTitle } from "../../context/NavbarTitleContext";

export default function InventoryPage() {
  const [clienteSeleccionado, setClienteSeleccionado] = React.useState(null);
  const { setTitle, setSubtitle } = useNavbarTitle();

  useEffect(() => {
    setTitle("Inventario");
    setSubtitle("Organiza y registra los equipos de tus clientes!");
  }, [setTitle, setSubtitle]);

  return (
    <div className=" flex flex-col overflow-hidden">
      {clienteSeleccionado ? (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <div className="flex justify-start flex-shrink-0 pd-20">
              <BackButton onClick={() => setClienteSeleccionado(null)}>
                ← Volver
              </BackButton>
            </div>
            <EquipmentsTable cliente={clienteSeleccionado} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <InventoryTable onEmojiClick={setClienteSeleccionado} />
        </div>
      )}
    </div>
  );
}
