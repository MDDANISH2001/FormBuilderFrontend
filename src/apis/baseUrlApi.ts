import axios from 'axios';

const apiClient = axios.create({
  // baseURL: 'http://localhost:8800/api', 
  baseURL: 'https://formbuilderbackend-kdtj.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
