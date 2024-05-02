/* eslint-disable */
import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Flex,
  Image,
  FormErrorMessage,
} from '@chakra-ui/react';
import logoApp from '../Sidebar/Ecoexya.png';

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordsMatchError, setPasswordsMatchError] = useState(false);
  const toast = useToast();

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setPasswordsMatchError(true);
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

      localStorage.setItem(
        'resetSuccessMessage',
        'Votre mot de passe a bien été réinitialisé.'
      );
      window.location.href = '/auth/login';
    } catch (error) {
      toast({
        title: 'Erreur de réinitialisation',
        description: 'Error',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

      localStorage.setItem(
        'resetErrorMessage',
        'Les mots de passe sont differents'
      );
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
        <Box textAlign="center">
          <Image src={logoApp.src} w="160px" alt="logo" m={4} />
        </Box>
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
            onChange={(e) => {
              setConfirmNewPassword(e.target.value);
              setPasswordsMatchError(false); // Réinitialiser le message d'erreur lorsque l'utilisateur change la saisie
            }}
            isInvalid={passwordsMatchError}
          />
          {passwordsMatchError && (
            <FormErrorMessage>
              Les mots de passe sont différents
            </FormErrorMessage>
          )}
        </FormControl>
        <Button
          bg="primary.300"
          color="white"
          variant="outline"
          type="submit"
          width="full"
          mt={4}
          onClick={handleResetPassword}
        >
          Réinitialiser le mot de passe
        </Button>
      </Box>
    </Flex>
  );
};

export default ResetPasswordForm;
