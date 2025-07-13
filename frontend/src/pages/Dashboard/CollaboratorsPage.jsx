import React from "react";
import CollaboratorsTable from "../../components/dashboard/CollaboratorsTable";

export default function CollaboratorsPage() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <h1 className="text-3xl font-bold text-white mb-1">Colaboradores</h1>
        <p className="text-gray-300 mb-4">
          Aquí, administra el trabajo de tus empleados!
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <CollaboratorsTable />
      </div>
    </div>
  );
}
