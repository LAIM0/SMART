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
      router.push('/auth/login');
    }
  } catch (error) {
    console.error(
      "Erreur lors de la vérification de l'authentification:",
      error
    );
    localStorage.setItem('preLoginRoute', window.location.pathname);
    router.push('/auth/login');
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
        router.push('/auth/login');
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'authentification:",
        error
      );
      localStorage.setItem('preLoginRoute', window.location.pathname);
      router.push('/auth/login');
    }

  };

  export const resetPassword = async (email: string) => {
    try {
      const response = await axios.post(
        `${baseURL}/users/forgot-password`,
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      return response.data;
    } catch (error) {
      throw new Error(
        "Une erreur s'est produite lors de l'envoi de la demande de réinitialisation de mot de passe"
      );
    }
  };

  export const sendValitaionEmail = async (email: string) => {
    try {
      const response = await axios.post(
        `${baseURL}/users/send-validatation-email`,
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      return response.data;
    } catch (error) {
      throw new Error(
        "Une erreur s'est produite lors de l'envoi de la demande de validation de votre email"
      );
    }
  };


  export const validateEmail = async (token: string | undefined) => {
    console.log(token);
    try {
      if (!token) {
        throw new Error('Token non défini');
      }
      
      const response = await axios.get(`${baseURL}/users/validate-email`, {
        params: { token }, // Passer le token en tant que paramètre de requête
      });
  
      console.log(response);
  
      return response.data;
    } catch (error) {
      throw new Error(
        "Une erreur s'est produite lors de la vérification de votre email"
      );
    }
  };

  export const initializePassword = async (email: string) => {
    try {
      const response = await axios.post(
        `${baseURL}/users/initialize-password`,
        { email },
        { headers: { 'Content-Type': 'application/json' } }
        
      );
      return response.data;
    } catch (error) {
      throw new Error(
        "Une erreur s'est produite lors de l'envoi de la demande d'initialisation de mot de passe"
      );
    }
  };
  
