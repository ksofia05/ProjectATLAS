import axios from 'axios';

export const getUsuario = async () => {
    return axios.get('http://localhost:8000/tasks/api/v1/usuarios/')
}