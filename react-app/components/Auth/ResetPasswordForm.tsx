/* eslint-disable */
import React, { useState } from 'react';
import logoApp from '../Sidebar/Ecoexya.png';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Flex,
} from '@chakra-ui/react';

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const toast = useToast();

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast({
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:3001/users/reset-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      if (!response.ok) {
        throw new Error('Échec de la réinitialisation du mot de passe');
      }

      toast({
        title: 'Réinitialisation réussie',
        description: 'Le mot de passe a été réinitialisé avec succès.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erreur de réinitialisation',
        description: 'Error',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex width="full" align="center" justifyContent="center" minHeight="100vh">
      <Box
        p={8}
        maxWidth="500px"
        borderWidth={0}
        borderRadius={8}
        boxShadow="lg"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <FormControl isRequired>
          <FormLabel>Nouveau mot de passe</FormLabel>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired mt={4}>
          <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
          <Input
            id="confirm-new-password"
            type="password"
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
