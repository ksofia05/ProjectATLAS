import React from "react";
import InventoryTable from "../../components/dashboard/InventoryTable";

export default function InventoryPage() {
  return (
    <div className="px-8">
      <h1 className="text-3xl font-bold text-white mb-2">Cliente / Inventario</h1>
      <p className="text-gray-300 mb-8">
        Organiza y registra los equipos de tus clientes!
      </p>
      <InventoryTable />
    </div>
  );
}