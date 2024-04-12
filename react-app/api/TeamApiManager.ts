import axios from 'axios';

const baseURL = 'http://localhost:3001';

const fetchTeams = async () => {
  try {
    const response = await axios.get(`${baseURL}/teams`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des équipes:', error);
    throw error;
  }
};

export default fetchTeams;
