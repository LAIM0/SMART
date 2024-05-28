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
        `Error retrieving items by id: ${userId}`
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
        `Error when creating a completed: ${userId}, ${challengeId}`
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
        `Error retrieving items by id: ${userId} and challenge: ${challengeId}`
      );
    }
  }

  static async deleteCompleted(userId: string, challengeId: string) {
    try {
      await axios.delete<CompletedData[]>(
        `http://localhost:3001/completed/delete?userId=${userId}&challengeId=${challengeId}`
      );
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }
}

export default CompletedApiManager;
