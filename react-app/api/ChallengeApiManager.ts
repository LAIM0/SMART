import axios from 'axios';
import ChallengeData from '../interfaces/challengeInterface';
import ENDPOINTS from './apiUtils/endpoints';
import ApiMethods from './apiUtils/apiMethods';
import { Periodicity } from '../utils/constants';

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
        `Error retrieving item by id: ${id}`
      );
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await axios.delete<ChallengeData[]>(
        `http://localhost:3001/challenges/delete/${id}`
      );
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }

  static async create(
    title: string,
    description: string,
    points: number,
    category: string,
    periodicity: Periodicity,
    endDate: Date,
    pedagogicalExplanation: string
  ): Promise<ChallengeData> {
    try {
      const response = await ApiMethods.post(
        ENDPOINTS.CHALLENGE.CHALLENGES_CREATE(),
        {
          title,
          description,
          points,
          category,
          periodicity,
          endDate,
          pedagogicalExplanation,
        }
      );
      console.log(response);
      return response.data as ChallengeData;
    } catch (error) {
      throw new Error(`Challenge creation error`);
    }
  }

  static async update(
    id: string,
    title: string,
    description: string,
    points: number,
    category: string,
    periodicity: Periodicity,
    endDate: Date,
    pedagogicalExplanation: string
  ): Promise<ChallengeData> {
    try {
      const response = await ApiMethods.patch(
        ENDPOINTS.CHALLENGE.CHALLENGES_UPDATE(),
        {
          id,
          title,
          description,
          points,
          category,
          periodicity,
          endDate,
          pedagogicalExplanation,
        }
      );
      console.log(response);
      return response.data as ChallengeData;
    } catch (error) {
      throw new Error(`Challenge update error`);
    }
  }
}

export default ChallengeApiManager;
