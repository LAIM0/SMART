import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Image,
} from '@chakra-ui/react';
import logoApp from '../Sidebar/Ecoexya.png';

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [email, setEmail] = useState<string>('');
  const handleResetPassword = async () => {
    try {
      if (newPassword !== confirmNewPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      const response = await fetch(
        'http://localhost:3001/users/reset-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, newPassword }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || "Une erreur s'est produite");
      }

      // Rediriger l'utilisateur vers une autre page après la réinitialisation du mot de passe si nécessaire
    } catch (error) {
      // setError(error instanceof Error ? error.message : 'Une erreur s\'est produite');
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
}

export default ResetPasswordForm;
