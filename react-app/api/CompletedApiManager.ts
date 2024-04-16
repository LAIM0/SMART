import axios from 'axios';
import CompletedChallengeData from '../interfaces/completedInterface';
import ENDPOINTS from './apiUtils/endpoints';
import ApiMethods from './apiUtils/apiMethods';
import CompletedData from '../interfaces/challengeInterface';

class CompletedApiManager {
  static async getCompletedChallengesByUserId(
    userId: string
  ): Promise<CompletedChallengeData[]> {
    try {
      const response = await ApiMethods.get(
        ENDPOINTS.COMPLETED.COMPLETED_BY_USER_ID(userId)
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
      const response = await ApiMethods.post(
        ENDPOINTS.COMPLETED.COMPLETED_CREATE(),
        {
          userId,
          challengeId,
          completionDate: new Date(),
        }
      );
      console.log(response);
    } catch (error) {
      throw new Error(
        `Erreur lors de la création d'un completed: ${userId}, ${challengeId}`
      );
    }
  }

  static async getCompletedByUserIdByChallengeId(
    userId: string,
    challengeId: string
  ): Promise<CompletedChallengeData[]> {
    try {
      const response = await ApiMethods.get(
        ENDPOINTS.COMPLETED.COMPLETED_BY_USER_ID_BY_CHALLENGE_ID(
          userId,
          challengeId
        )
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des articles par id: ${userId} et challenge: ${challengeId}`
      );
    }
  }

  static async deleteCompleted(userId: string, challengeId: string) {
    // try {
    //   console.log('params pour tenter la suppression', userId, challengeId);
    //   await ApiMethods.delete(
    //     // ENDPOINTS.COMPLETED.COMPLETED_DELETE_BY_USER_ID_BY_CHALLENGE_ID(
    //     //   userId,
    //     //   challengeId
    //     // )
    //     `http://localhost:3001/completed/delete?userId=${userId}&challengeId=${challengeId}`
    //   );
    // } catch (error) {
    //   throw new Error(
    //     `Erreur lors de la suppression du completed par id: ${userId} et challenge: ${challengeId}`
    //   );
    // }
    try {
      await axios.delete<CompletedData[]>(
        `http://localhost:3001/completed/delete?userId=${userId}&challengeId=${challengeId}`
      );
    } catch (error) {
      console.error('Erreur lors de la suppression des données:', error);
    }
  }
}

export default CompletedApiManager;
