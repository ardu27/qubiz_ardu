import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5100/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
