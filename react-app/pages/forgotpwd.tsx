import React from 'react';
import {
  ThemeProvider,
  theme,
  ColorModeProvider,
  CSSReset,
} from '@chakra-ui/react';
import ResetPasswordForm from '../components/Auth/ResetPasswordForm';

function ForgotPasswordForm() {
  // const [email, setEmail] = useState<string>('');

  // const handleResetPassword = async () => {
  //   // Ajoutez ici la logique pour envoyer une demande de réinitialisation de mot de passe
  //   console.log('Email for password reset:', email);
  // };

  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <CSSReset />
        <ResetPasswordForm />
      </ColorModeProvider>
    </ThemeProvider>
  );
}

export default ForgotPasswordForm;
