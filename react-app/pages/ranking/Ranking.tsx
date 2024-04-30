import React, { useState, useEffect } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
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
