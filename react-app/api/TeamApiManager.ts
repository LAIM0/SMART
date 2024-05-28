import axios from 'axios';
import TeamData from '../interfaces/teamInterface';

const baseURL = 'http://localhost:3001';

class TeamApiManager {
  static fetchTeams = async () => {
    try {
      const response = await axios.get(`${baseURL}/teams`);
      return response.data;
    } catch (error) {
      console.error('Error when retrieving teams:', error);
      throw error;
    }
  };

  static fetchTeamsRanking = async () => {
    try {
      const response = await axios.get(`${baseURL}/teams/ranking`);
      return response.data;
    } catch (error) {
      console.error(
        'Error when retrieving team rankings:',
        error
      );
      throw error;
    }
  };

  static async create(teamData: TeamData): Promise<void> {
    const { id, ...dataWithoutId } = teamData;
    try {
      await axios.post(`${baseURL}/teams`, dataWithoutId);
    } catch (error) {
      throw new Error(`Error creating team: ${error}`);
    }
  }

  static async modify(teamData: TeamData): Promise<void> {
    try {
      await axios.put(
        `${baseURL}/teams/update/${teamData.id}`,
        {
          name: teamData.name,
          picturePath: teamData.picturePath,
          leaderId: teamData.leaderId,
        },
        { withCredentials: true }
      );
    } catch (error) {
      throw new Error(`Team modification error: ${error}`);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await axios.delete(`http://localhost:3001/teams/delete/${id}`);
    } catch (error) {
      throw new Error(`Team deletion error: ${error}`);
    }
  }
}

export default TeamApiManager;
