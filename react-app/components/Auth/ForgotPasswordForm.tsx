import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { resetPassword } from '../../api/AuthApiManager';

function ForgotPasswordForm() {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const handleResetPassword = async () => {
    try {
      await resetPassword(email);

      setError(null);
      toast({
        title: 'Demande envoyée',
        description:
          'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      localStorage.setItem(
        'resetSuccessMessage',
        'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.'
      );
      window.location.href = '/auth/login';
      // eslint-disable-next-line @typescript-eslint/no-shadow
    } catch (error) {
      console.log(error);
      setError(
        "Une erreur s'est produite lors de l'envoi de la demande de réinitialisation de mot de passe."
      );
    }
  };

  return (
    <Box mx="auto" px={4}>
      {' '}
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Entrez votre adresse e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <Button
        mt={4}
        bg="primary.300"
        color="white"
        onClick={handleResetPassword}
      >
        Envoyer la demande de réinitialisation
      </Button>
    </Box>
  );
}

export default ForgotPasswordForm;
