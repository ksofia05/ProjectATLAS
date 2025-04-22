import { useEffect } from "react";

const PoliticasPrivacidad = () => {
  useEffect(() => {
    window.location.href = "http://127.0.0.1:8000/autenticacion/politicas/";
  }, []);
  return null;
}

export default PoliticasPrivacidad;