import React from "react";
import CollaboratorsTable from "../../components/dashboard/CollaboratorsTable";

export default function CollaboratorsPage() {
  return (
    <div className="px-8">
      <h1 className="text-3xl font-bold text-white mb-2">Colaboradores</h1>
      <p className="text-gray-300 mb-8">
        Aquí, administra el trabajo de tus empleados!
      </p>
      <CollaboratorsTable />
    </div>
  );
}