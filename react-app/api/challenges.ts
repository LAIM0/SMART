import ChallengeData from '../interfaces/challengeInterface';
import CompletedChallengeData from '../interfaces/completedInterface';
import ENDPOINTS from './Utils/endpoint';
import ApiMethods from './Utils/apiMethods';

class ApiManager {
  static async getById(id: string): Promise<ChallengeData> {
    try {
      const response = await ApiMethods.get(ENDPOINTS.CHALLENGES_BY_ID(id));
      console.log(response);
      return response.data as ChallengeData;
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération de l'article par id: ${id}`
      );
    }
  }

  static async getCompletedChallengesByUserId(
    userId: string
  ): Promise<CompletedChallengeData[]> {
    try {
      const response = await ApiMethods.get(
        ENDPOINTS.COMPLETED_BY_USER_ID(userId)
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des articles par id: ${userId}`
      );
    }
  }

  static async completeChallenge(
    userId: string,
    challengeId: string
  ): Promise<void> {
    try {
      const response = await ApiMethods.post(ENDPOINTS.COMPLETED_CREATE(), {
        userId,
        challengeId,
        completionDate: new Date(),
      });
      console.log(response);
    } catch (error) {
      throw new Error(
        `Erreur lors de la création d'un completed: ${userId}, ${challengeId}`
      );
    }
  }
}

export default ApiManager;

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
