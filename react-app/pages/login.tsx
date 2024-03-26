// pages/login.tsx
import { useState } from 'react';
import React from 'react';
import {
  ThemeProvider,
  theme,
  ColorModeProvider,
  CSSReset
} from '@chakra-ui/react';
import LoginForm from '../components/Auth/LoginForm';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <CSSReset />
        <LoginForm />
      </ColorModeProvider>
    </ThemeProvider>
  );
}

