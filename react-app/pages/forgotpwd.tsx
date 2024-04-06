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
} from '@chakra-ui/react';
import {
  ThemeProvider,
  theme,
  ColorModeProvider,
  CSSReset,
} from '@chakra-ui/react';
import ResetPasswordForm from '../components/Auth/ResetPasswordForm';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');

  const handleResetPassword = async () => {
    try {
      const response = await fetch('/user/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        console.log('Password reset request sent successfully');
      } else {
        console.error('Failed to send password reset request');
      }
    } catch (error) {
      console.error(
        'An error occurred while sending password reset request',
        error
      );
    }
    console.log('Email for password reset:', email);
  };

  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <CSSReset />
        <ResetPasswordForm />
      </ColorModeProvider>
    </ThemeProvider>
  );
};

export default ForgotPasswordForm;
