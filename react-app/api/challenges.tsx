import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

interface ApiResponse {
  title: string;
  description: string;
  points: number;
  days: number;
  pedagogicalExplanation: string;
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
