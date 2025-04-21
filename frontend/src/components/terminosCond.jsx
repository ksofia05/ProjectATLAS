import { useEffect } from "react";

const terminosCond = () => {
    useEffect(() =>{
        window.location.href = "http://127.0.0.1:8000/autenticacion/terminos"
    }, []);
    return null;
}
export default terminosCond;