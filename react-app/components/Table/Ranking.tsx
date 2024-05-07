import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, useBreakpointValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import SwitchButton, { SELECTION_MODES } from '../Buttons/SwitchButton';
import { handleAuthRouting } from '../../api/AuthApiManager';
import RankTableUser from './RankTableUser';
import RankTableTeam from './RankTableTeam';

function Ranking() {
  const [isIndividual, setIsIndividual] = useState(SELECTION_MODES.INDIVIDUAL); // La valeur initiale peut être true ou false

  const switchButtonAlignment = useBreakpointValue({
    base: 'center',
    md: 'flex-start',
  });

  const margin = useBreakpointValue({
    base: 'auto',
    md: '0',
  });
  const maxWidthButton = useBreakpointValue({
    base: '1000',
    md: '300',
    xl: '400',
  });

  const router = useRouter();
  useEffect(() => {
    handleAuthRouting(router);
  }, []);

  return (
    <Flex p="32px" flexDirection="column">
      <Text as="h1">Top</Text>
      <Flex
        justify={switchButtonAlignment}
        gap={3}
        borderRadius="16px"
        boxShadow="sm"
        w="full" // Utilisez 'full' pour utiliser toute la largeur disponible
        maxW={maxWidthButton} // Limite la largeur maximale pour les grands écrans
        overflowX="hidden" // Cache le débordement horizontal
        mx={margin}
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
