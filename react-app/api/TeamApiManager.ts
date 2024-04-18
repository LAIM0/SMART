import axios from 'axios';

const baseURL = 'http://localhost:3001';

export const fetchTeams = async () => {
  try {
    const response = await axios.get(`${baseURL}/teams`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des équipes:', error);
    throw error;
  }
};

export const fetchTeamsRanking = async () => {
  try {
    const response = await axios.get(`${baseURL}/teams/ranking`);
    return response.data;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération du classement par équipes:',
      error
    );
    throw error;
  }
};
