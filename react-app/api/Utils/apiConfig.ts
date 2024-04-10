import axios from 'axios';

export const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  // Vous pouvez ajouter d'autres en-têtes par défaut ici si nécessaire
});

export default api;
