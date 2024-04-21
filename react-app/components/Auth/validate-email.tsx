import { useRouter } from 'next/router';
import { Box, Button, Flex,Text,Image } from '@chakra-ui/react';
import { validateEmail } from '../../api/AuthApiManager';
import { useState } from 'react';
import logoApp from '../Sidebar/Ecoexya.png';

const EmailValidationPage: React.FC = () => {
  const router = useRouter();
  const { token } = router.query;
  const [isLoading, setIsLoading] = useState(false); // Changement ici pour false au lieu de true
  const [error, setError] = useState('');

  const handleLoginClick = () => {
    try {
      if (!token || typeof token !== 'string') { // Vérifier si token est défini et une chaîne
        throw new Error('Token invalide');
      }
      setIsLoading(true); // Changer isLoading à true avant l'appel à validateEmail
      validateEmail(token); // Cast token to string
      
      setIsLoading(false); 
      console.log('bonjour');
      router.push("/auth/login");
      
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        setIsLoading(false); // Assurez-vous de changer isLoading à false en cas d'erreur
      }
    }
  }

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
          <Image src={logoApp.src} w="160px" alt="logo" m={4} />
        </Box>
        <Text as="h1" mb={4}>Vérification de votre adresse email!</Text> {/* Ajout du titre et espace inférieur */}
        <Button
                bg="#166879"
                color="white"
                // variantColor="teal"
                variant="outline"
                type="submit"
                width="full"
                mt={4}
               onClick={handleLoginClick}> {/* Ajout d'un espace au-dessus du bouton */}
          Valider mon adresse email
        </Button>
        {error && <div>{error}</div>}
      </Box>
    </Flex>
  );
};

export default EmailValidationPage;
