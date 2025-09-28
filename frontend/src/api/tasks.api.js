import axios from 'axios';
import API_BASE_URL from '../api/apiBase'

export const getTasks = async () => {
    return axios.get(`${API_BASE_URL}/tasks/api/v1/tasks`)
}