// AuthApiManager.ts
import axios from 'axios';
import { NextRouter, useRouter } from 'next/router';

const baseURL = 'http://localhost:3001';

export const checkAuthentication = async () => {
  try {
    const response = await axios.get(`${baseURL}/users/check`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la vérification de l'authentification:", error);
    throw error;
  }
};

export const handleAuthRouting = async (router: NextRouter) => {
  try {
    const { loggedIn } = await checkAuthentication();
    if (!loggedIn) {
      localStorage.setItem('preLoginRoute', window.location.pathname);
      router.push('/login');
    }
  } catch (error) {
    console.error(
      "Erreur lors de la vérification de l'authentification:",
      error
    );
    localStorage.setItem('preLoginRoute', window.location.pathname);
    router.push('/login');
  }
};

export const checkAdminAuthentication = async () => {
    try {
      const response = await axios.get(`${baseURL}/users/check/admin`, {
        withCredentials: true,
      });
      console.log("reponse",response);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la vérification de l'authentification admin:", error);
      throw error;
    }
  };

  export const handleAdminRouting = async (router: NextRouter) => {
    try {
      const { isAdminLoggedIn } = await checkAdminAuthentication();
      console.log(isAdminLoggedIn);
      if (!isAdminLoggedIn) {
        localStorage.setItem('preLoginRoute', window.location.pathname);
        router.push('/login');
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'authentification:",
        error
      );
      localStorage.setItem('preLoginRoute', window.location.pathname);
      router.push('/login');
    }
  };
