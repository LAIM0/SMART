import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

interface ApiResponse {
  title: string;
  description: string;
  points: number;
  days: number;
  pedagogicalExplanation: string;
}

interface CompletedChallenge {
  completed: {
    _id: string;
    userId: string;
    challengeId: string;
    completionDate: Date;
    __v: number;
  };
  challenge: {
    _id: string;
    category: string;
    title: string;
    points: number;
    description: string;
    pedagogicalExplanation: string;
    endDate: Date;
    __v: number;
  };
}
// Une fonction pour récupérer la liste des utilisateurs
export const getById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/challenges/byId/${id}`);
    console.log(response);
    return response.data as ApiResponse; // Renvoie les données directement
  } catch (error) {
    throw new Error(
      `Erreur lors de la récupération de l'article par id: ${id}`
    );
  }
};

export const getCompletedChallengesByUserId = async (userId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/completed/byUserId/${userId}`
    );
    console.log(response);
    return response.data as CompletedChallenge[]; // Renvoie les données directement
  } catch (error) {
    throw new Error(
      `Erreur lors de la récupération des articles par id: ${userId}`
    );
  }
};

export const completeChallenge = async (
  userId: string,
  challengeId: string
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/completed/create`, {
      userId: userId,
      challengeId: challengeId,
      completionDate: new Date(),
    });
    console.log(response);
  } catch (error) {
    throw new Error(
      `Erreur lors de la création d'un completed: ${userId}, ${challengeId}`
    );
  }
};
