import React from 'react';
import {
  ThemeProvider,
  theme,
  ColorModeProvider,
  CSSReset,
} from '@chakra-ui/react';
import EmailValidationPage from '../../components/Auth/validate-email';
import LayoutAuth from '../../components/Layout/LayouAuth';

export default function SignUp() {
  return (
    <LayoutAuth>
      <ColorModeProvider>
        <CSSReset />
        <EmailValidationPage />
      </ColorModeProvider>
    </LayoutAuth>
  );
}
