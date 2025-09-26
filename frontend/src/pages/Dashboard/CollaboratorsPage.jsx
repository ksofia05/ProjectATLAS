import React, { useEffect } from "react";
import CollaboratorsTable from "../../components/dashboard/CollaboratorsTable";
import { useNavbarTitle } from "../../context/NavbarTitleContext";

export default function CollaboratorsPage() {
  const { setTitle, setSubtitle } = useNavbarTitle();
  useEffect(() => {
    setTitle("Colaboradores");
    setSubtitle("Aquí, administra el trabajo de tus empleados!");
  }, [setTitle, setSubtitle]);

  return (
    <div className="flex flex-col overflow-hidden pb-2">
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <CollaboratorsTable />
      </div>
    </div>
  );
}
