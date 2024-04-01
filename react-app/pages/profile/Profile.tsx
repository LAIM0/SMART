/*eslint-disable*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Flex, Card, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";



const Profile: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    
    const checkAuthentication = async () => {
      try {
        // Assurez-vous que cette URL correspond à votre configuration serveur
        const response = await axios.get("http://localhost:3001/users/check", { withCredentials: true });
        // Si l'utilisateur n'est pas connecté, redirigez-le
        if (!response.data.loggedIn) {
          localStorage.setItem('preLoginRoute', window.location.pathname);
          router.push('/login');
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        localStorage.setItem('preLoginRoute', window.location.pathname);
        router.push('/login');
      }
    };

    checkAuthentication();
  }, [router]);
  return <div>Profil</div>;
};

export default Profile;
