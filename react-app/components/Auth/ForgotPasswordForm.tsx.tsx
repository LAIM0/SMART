/* eslint-disable */
import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Heading,
} from "@chakra-ui/react";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');

  const handleResetPassword = async () => {
    // Ajoutez ici la logique pour envoyer une demande de réinitialisation de mot de passe
    console.log('Email for password reset:', email);
  };

  return (
    
    <Box width="400px">
      
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Entrez votre adresse e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <Button mt={4} colorScheme="teal"  bg="#166879" color="white"onClick={handleResetPassword}>
        Envoyer la demande de réinitialisation
      </Button>
    </Box>
    
  );
};

export default ForgotPasswordForm;
