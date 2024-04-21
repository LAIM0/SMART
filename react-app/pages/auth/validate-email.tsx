import React from 'react';
import {
  ThemeProvider,
  theme,
  ColorModeProvider,
  CSSReset,
} from '@chakra-ui/react';
import EmailValidationPage from '../../components/Auth/validate-email';

export default function SignUp() {
  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <CSSReset />
        <EmailValidationPage />
      </ColorModeProvider>
    </ThemeProvider>
  );
}