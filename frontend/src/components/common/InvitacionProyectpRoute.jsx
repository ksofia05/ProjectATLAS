import React from "react";
import { useParams } from "react-router-dom";


const InvitacionProyectoRoute = () => {
  const { id } = useParams();

  // Pasa el next con el id del proyecto a NoTenerCuenta
  return <NoTenerCuenta next={`/dashboard/${id}`} />;
};

export default InvitacionProyectoRoute;
