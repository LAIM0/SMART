/* eslint-disable */
import { useEffect, useState } from 'react';
import React from 'react';
import {
  ThemeProvider,
  theme,
  ColorModeProvider,
  CSSReset,
  Box,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import LoginForm from '../components/Auth/LoginForm';

export default function LogIn() {
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Vérifiez s'il y a un message de succès dans le stockage local
    const message = localStorage.getItem('resetSuccessMessage');
    if (message) {
      // Affichez le message de succès et supprimez-le du stockage local
      setResetSuccessMessage(message);
      localStorage.removeItem('resetSuccessMessage');
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <CSSReset />
        {resetSuccessMessage && (
          <Box my={4}>
            <Alert status="info">
              <AlertIcon />
              {resetSuccessMessage}
            </Alert>
          </Box>
        )}
        <LoginForm />
      </ColorModeProvider>
    </ThemeProvider>
  );
}
