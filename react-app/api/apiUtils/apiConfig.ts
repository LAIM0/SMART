import axios from 'axios';

export const apiBaseUrl = 'http://localhost:3001';

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  // Vous pouvez ajouter d'autres en-têtes par défaut ici si nécessaire
});

export default api;
