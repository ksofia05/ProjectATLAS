import axios from 'axios';
import { API_BASE } from './apiBase';

export const getUsuario = async () => {
    return axios.get(`${API_BASE}tasks/api/v1/usuarios/`)
}

