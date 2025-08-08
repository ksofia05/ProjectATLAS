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
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
      </div>
      <div className="flex-1 overflow-hidden">
        <CollaboratorsTable />
      </div>
    </div>
  );
}


