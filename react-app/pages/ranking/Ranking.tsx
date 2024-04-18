import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import SwitchButton, {
  SELECTION_MODES,
} from '../../components/Buttons/SwitchButton';
import RankTableUser from '../../components/Table/RankTableUser';
import RankTableTeam from '../../components/Table/RankTableTeam';

function Ranking() {
  const [isIndividual, setIsIndividual] = useState(SELECTION_MODES.INDIVIDUAL); // La valeur initiale peut être true ou false

  const router = useRouter();
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Assurez-vous que cette URL correspond à votre configuration serveur
        const response = await axios.get('http://localhost:3001/users/check', {
          withCredentials: true,
        });
        // Si l'utilisateur n'est pas connecté, redirigez-le
        if (!response.data.loggedIn) {
          localStorage.setItem('preLoginRoute', window.location.pathname);
          router.push('/login');
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification de l'authentification:",
          error
        );
        localStorage.setItem('preLoginRoute', window.location.pathname);
        router.push('/login');
      }
    };

    checkAuthentication();
  }, [router]);

  return (
    <Flex p="32px" flexDirection="column">
      <Text as="h1">Classement</Text>
      <Flex
        gap={3}
        bg="white"
        borderRadius="16px"
        boxShadow="sm"
        overflowX="scroll"
        w="fit-content"
        mb="24px"
      >
        <SwitchButton
          isSelectedIndividual={isIndividual}
          onSelectionChange={setIsIndividual}
        />
      </Flex>
      <Box mt={5}>{isIndividual ? <RankTableUser /> : <RankTableTeam />}</Box>
    </Flex>
  );
}

export default Ranking;
