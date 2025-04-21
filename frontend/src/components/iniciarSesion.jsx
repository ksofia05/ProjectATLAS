import { useEffect } from 'react';

const iniciarSesion = () => {
  useEffect(() => {
    window.location.href = "http://127.0.0.1:8000/autenticacion/login/";
  }, []);

  return null;
};
export default iniciarSesion;
