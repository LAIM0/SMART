import React from 'react';
import {
  ThemeProvider,
  theme,
  ColorModeProvider,
  CSSReset,
} from '@chakra-ui/react';
import SignupForm from '../../components/Auth/SignupForm';
import LayoutAuth from '../../components/Layout/LayouAuth';

export default function SignUp() {
  return (
    <LayoutAuth>
      <ColorModeProvider>
        <CSSReset />
        <SignupForm />
      </ColorModeProvider>
    </LayoutAuth>
  );
}
