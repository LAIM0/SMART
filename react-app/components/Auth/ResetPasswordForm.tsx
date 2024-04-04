/* eslint-disable */
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Heading,
  Image
} from "@chakra-ui/react";
import logoApp from '../Sidebar/Ecoexya.png';

const ResetPasswordForm: React.FC = () => {
  const { token } = useParams(); // Récupère le token de l'URL
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      console.error('Les mots de passe ne correspondent pas');
      return;
    } 

    try {
      await fetch(`http://localhost:3001/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      // Gérer la réussite de la réinitialisation
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe', error);
    }
  };

  

  

  return (
    <Flex width="full" align="center" justifyContent="center" minHeight="100vh">
    <Box p={8} maxWidth="500px" borderWidth={0} borderRadius={8} boxShadow="lg"  display="flex" flexDirection="column" alignItems="center">
      <Image src={logoApp.src} w="160px" alt="logo" m={4} />
      <FormControl isRequired>
        <FormLabel>Nouveau mot de passe</FormLabel>
        <Input
          type="password"
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </FormControl>
      <FormControl isRequired mt={4}>
        <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
        <Input
          type="password"
          placeholder="Confirmer le nouveau mot de passe"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
      </FormControl>
      <Button mt={4} colorScheme="teal" onClick={handleResetPassword}>
        Réinitialiser le mot de passe
      </Button>
    </Box>
    </Flex>
  );
};

export default ResetPasswordForm;
