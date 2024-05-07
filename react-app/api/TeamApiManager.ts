import axios from 'axios';
import TeamData from '../interfaces/teamInterface';

const baseURL = 'http://localhost:3001';

class TeamApiManager {
  static fetchTeams = async () => {
    try {
      const response = await axios.get(`${baseURL}/teams`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des équipes:', error);
      throw error;
    }
  };

  static fetchTeamsRanking = async () => {
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

  static async create(teamData: TeamData): Promise<void> {
    const { id, ...dataWithoutId } = teamData;
    try {
      await axios.post(`${baseURL}/teams`, dataWithoutId);
    } catch (error) {
      throw new Error(`Erreur lors de la création de l'équipe: ${error}`);
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
      throw new Error(`Erreur lors de la modification de l'équipe: ${error}`);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await axios.delete(`http://localhost:3001/teams/delete/${id}`);
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de l'équipe: ${error}`);
    }
  }
}

export default TeamApiManager;
