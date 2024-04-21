/* eslint-disable */
import React from 'react';
import {
  ThemeProvider,
  theme,
  ColorModeProvider,
  CSSReset,
} from '@chakra-ui/react';
import ResetPasswordForm from '../../components/Auth/ResetPasswordForm';
import { GetServerSidePropsContext } from 'next'; // Assurez-vous du chemin correct

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;
  const { token } = query; // Récupération du token depuis la query string

  if (!token) {
    return {
      redirect: {
        destination: '/error', // Redirection en cas d'absence de token
        permanent: false,
      },
    };
  }

  return {
    props: { token }, // Passer le token comme prop à la page
  };
}

const ForgotPasswordPage: React.FC<{ token: string }> = ({ token }) => {
  if (!token) {
    return <div>Erreur: Token non identifié</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <CSSReset />
        <ResetPasswordForm token={token} />
      </ColorModeProvider>
    </ThemeProvider>
  );
};

export default ForgotPasswordPage;
