import axios from axios;
import ChallengeData from '../interfaces/challengeInterface';
import ENDPOINTS from './apiUtils/endpoints';
import ApiMethods from './apiUtils/apiMethods';

class ChallengeApiManager {
  static async getById(id: string): Promise<ChallengeData> {
    try {
      const response = await ApiMethods.get(
        ENDPOINTS.CHALLENGE.CHALLENGES_BY_ID(id)
      );
      console.log(response);
      return response.data as ChallengeData;
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération de l'article par id: ${id}`
      );
    }
  }
}

export default ChallengeApiManager;

// // Une fonction pour récupérer la liste des challenges réalisés par un utilisateur
// export const getById = async (id: string) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/challenges/byId/${id}`);
//     console.log(response);
//     return response.data as ApiResponse; // Renvoie les données directement
//   } catch (error) {
//     throw new Error(
//       `Erreur lors de la récupération de l'article par id: ${id}`
//     );
//   }
// };

// // Une fonction pour récupérer la liste des challenges COMPLÉTÉS réalisés par un utilisateur
// export const getCompletedChallengesByUserId = async (userId: string) => {
//   try {
//     const response = await axios.get<CompletedChallenge[]>(
//       `${API_BASE_URL}/completed/byUserId/${userId}`
//     );
//     console.log(response);
//     return response.data; // Renvoie les données directement
//   } catch (error) {
//     throw new Error(
//       `Erreur lors de la récupération des articles par id: ${userId}`
//     );
//   }
// };

// export const completeChallenge = async (
//   userId: string,
//   challengeId: string
// ) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/completed/create`, {
//       userId,
//       challengeId,
//       completionDate: new Date(),
//     });
//     console.log(response);
//   } catch (error) {
//     throw new Error(
//       `Erreur lors de la création d'un completed: ${userId}, ${challengeId}`
//     );
//   }
// };
