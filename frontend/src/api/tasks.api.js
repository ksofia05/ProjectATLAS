import axios from 'axios';
import { API_BASE } from './apiBase';

export const getTasks = async () => {
    return axios.get(`${API_BASE}tasks/api/v1/tasks`)
}