import { useRouter } from 'next/router';
import { Box, Button, Flex, Text, Image } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { validateEmail } from '../../api/AuthApiManager';
import { LogoContext } from '../Layout/LayouAuth';

function EmailValidationPage() {
  const router = useRouter();
  const { token } = router.query;
  const [, setIsLoading] = useState(false); // Changement ici pour false au lieu de true
  const [error, setError] = useState('');

  const handleLoginClick = () => {
    try {
      if (!token || typeof token !== 'string') {
        // Vérifier si token est défini et une chaîne
        throw new Error('Token invalide');
      }
      setIsLoading(true); // Changer isLoading à true avant l'appel à validateEmail
      validateEmail(token); // Cast token to string

      setIsLoading(false);

      localStorage.setItem(
        'resetSuccessMessage',
        'Votre adresse mail a bien été vérifiée.'
      );

      router.push('/auth/login');
      // eslint-disable-next-line @typescript-eslint/no-shadow
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        setIsLoading(false);
      }
    }
  };

  return (
    <Flex width="full" align="center" justifyContent="center" minHeight="100vh">
      <Box
        p={8}
        maxWidth="500px"
        borderWidth={0}
        borderRadius={8}
        boxShadow="lg"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box textAlign="center">
          <Image
            src={`http://localhost:3001/users/profile-picture/${useContext(LogoContext)}`}
            w="160px"
            alt="logo"
            m={4}
          />
        </Box>
        <Text as="h1" mb={4}>
          Vérification de votre adresse email!
        </Text>
        <Button
          bg="primary.300"
          color="white"
          // variantColor="teal"
          variant="outline"
          type="submit"
          width="full"
          mt={4}
          onClick={handleLoginClick}
        >
          Valider mon adresse email
        </Button>
        {error && <div>{error}</div>}
      </Box>
    </Flex>
  );
}

export default EmailValidationPage;
