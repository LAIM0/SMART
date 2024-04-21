import React from 'react';
import {
  ThemeProvider,
  theme,
  ColorModeProvider,
  CSSReset,
} from '@chakra-ui/react';
import SignupForm from '../../components/Auth/SignupForm';

export default function SignUp() {
  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <CSSReset />
        <SignupForm />
      </ColorModeProvider>
    </ThemeProvider>
  );
}
