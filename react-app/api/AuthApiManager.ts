// AuthApiManager.ts
import axios from 'axios';
import { NextRouter } from 'next/router';

const baseURL = 'http://localhost:3001';

export const checkAuthentication = async () => {
  try {
    const response = await axios.get(`${baseURL}/users/check`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Authentication verification error:",
      error
    );
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
      "Authentication verification error:",
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
    console.log('reponse', response);
    return response.data;
  } catch (error) {
    console.error(
      "Admin authentication verification error:",
      error
    );
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
      "Authentication verification error:",
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
      "An error occurred when sending the password reset request"
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
      "An error occurred while sending your email validation request"
    );
  }
};

export const validateEmail = async (token: string | undefined) => {
  console.log(token);
  try {
    if (!token) {
      throw new Error('Undefined token');
    }

    const response = await axios.get(`${baseURL}/users/validate-email`, {
      params: { token }, // Passer le token en tant que paramètre de requête
    });

    console.log(response);

    return response.data;
  } catch (error) {
    throw new Error(
      "An error occurred while checking your email"
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
      "An error occurred while sending the password initialization request"
    );
  }
};

export const logout = async () => {
  const response = await axios.get(`${baseURL}/users/logout`, {
    withCredentials: true,
  });
  return response.data; // Si vous souhaitez renvoyer quelque chose en cas de succès
};
