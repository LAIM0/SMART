import axios from 'axios';

const baseURL = 'http://localhost:3001';

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${baseURL}/users`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    throw error;
  }
};

interface User {
  firstName: string;
  lastName: string;
  email: string;
  teamId: string;
  isAdmin: boolean;
}

export const addUser = async (newUser: User) => {
  try {
    const response = await axios.post(`${baseURL}/users/signup`, {
      ...newUser,
      passwordHash: process.env.DEFAULT_PASSWORD_USER,
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur:", error);
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    await axios.delete(`${baseURL}/users/delete/${userId}`);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    throw error;
  }
};

export const updateUserTeam = async (userId: string, teamId: string) => {
  try {
    await axios.put(`${baseURL}/users/${userId}/team`, { teamId });
    console.log('Team Id changed : ', teamId);
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de l'équipe de l'utilisateur:",
      error
    );
    throw error;
  }
};

export const updateUserAdminStatus = async (
  userId: string,
  isAdmin: boolean
) => {
  try {
    const response = await axios.put(`${baseURL}/users/${userId}/admin`, {
      isAdmin,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user's admin status:", error);
    throw error;
  }
};

export const fetchUserRanking = async () => {
  try {
    const response = await axios.get(`${baseURL}/users/ranking`);
    return response.data;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération du classement des utilisateurs:',
      error
    );
    throw error;
  }
};

export const updateAllLevels = async () => {
  try {
    const response = await axios.get(`${baseURL}/users/update-all-levels`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour des niveaux:', error);
    throw error;
  }
};

export const getScoreByCat = async (userId: string) => {
  try {
    const response = await axios.get(
      `${baseURL}/users/scoreByCategory/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération du classement des utilisateurs:',
      error
    );
    throw error;
  }
};

export const getFromTeam = async (teamId: string) => {
  try {
    const response = await axios.get(`${baseURL}/users/getByTeam/${teamId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des utilisateurs à partir de l équipe :',
      error
    );
    throw error;
  }
};

export const getUserById = async (userId: string) => {
  try {
    const response = await axios.get(`${baseURL}/users/byId/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l utilisateur:', error);
    throw error;
  }
};

export const getLevel = async (userId: string) => {
  try {
    const response = await axios.get(`${baseURL}/users/level?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du niveau du user :', error);
    throw error;
  }
};
