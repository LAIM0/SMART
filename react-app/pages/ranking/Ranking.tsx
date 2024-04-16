import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import SwitchButton, {
  SELECTION_MODES,
} from '../../components/Buttons/SwitchButton';
import { handleAuthRouting } from '../../api/AuthApiManager';
import RankTableUser from '../../components/Table/RankTableUser';
import RankTableTeam from '../../components/Table/RankTableTeam';

function Ranking() {
  const [isIndividual, setIsIndividual] = useState(SELECTION_MODES.INDIVIDUAL); // La valeur initiale peut être true ou false

  const router = useRouter();
  useEffect(() => {
    handleAuthRouting(router);
  }, []);

  return (
    <div>
      <Heading>Défis</Heading>
      <Flex
        p={3}
        gap={3}
        bg="white"
        borderRadius={8}
        boxShadow="sm"
        overflowX="scroll"
      >
        <SwitchButton
          isSelectedIndividual={isIndividual}
          onSelectionChange={setIsIndividual}
        />
      </Flex>
      <Box p={10}>{isIndividual ? <RankTableUser /> : <RankTableTeam />}</Box>
    </div>
  );
}

export default Ranking;
