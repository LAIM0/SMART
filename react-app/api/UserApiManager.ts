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

export const addUser = async (newUser) => {
  try {
    const response = await axios.post(`${baseURL}/users/signup`, {
      ...newUser,
      passwordHash: 'Ecoexya24',
      
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    await axios.delete(`${baseURL}/users/delete/${userId}`);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    throw error;
  }
};

export const updateUserTeam = async (userId, teamId) => {
  try {
    await axios.put(`${baseURL}/users/${userId}/team`, { teamId });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de l'équipe de l'utilisateur:",
      error
    );
    throw error;
  }
};

export const updateUserAdminStatus = async (userId, isAdmin) => {
  try {
    const response = await axios.put(`${baseURL}/users/${userId}/admin`, {
      isAdmin: isAdmin
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user's admin status:", error);
    throw error;
  }
};
