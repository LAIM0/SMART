import CompletedChallengeData from '../interfaces/completedInterface';
import ENDPOINTS from './apiUtils/endpoints';
import ApiMethods from './apiUtils/apiMethods';

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
}

export default CompletedApiManager;
