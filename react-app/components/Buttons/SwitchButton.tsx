import React from 'react';
import { Box, Button, Flex, useBreakpointValue } from '@chakra-ui/react';

// Constantes pour représenter les modes de sélection
export const SELECTION_MODES = {
  INDIVIDUAL: true, // ou 0
  TEAM: false, // ou 1
};

interface Props {
  isSelectedIndividual: boolean;
  onSelectionChange: (isIndividual: boolean) => void;
}

function SwitchButton({ isSelectedIndividual, onSelectionChange }: Props) {
  const buttonPadding = useBreakpointValue({ base: 8, md: 12 });

  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="sm" width="full">
      <Flex gap={2} direction="row" width="full">
        <Button
          onClick={() => onSelectionChange(SELECTION_MODES.INDIVIDUAL)}
          bgColor={isSelectedIndividual ? 'primary.300' : 'white'}
          color={isSelectedIndividual ? 'white' : 'primary.300'}
          _hover={{
            bg: isSelectedIndividual ? 'primary.300' : '#F1F1F1',
          }}
          px={buttonPadding}
          flex="1"
        >
          Individuel
        </Button>
        <Button
          onClick={() => onSelectionChange(SELECTION_MODES.TEAM)}
          bgColor={!isSelectedIndividual ? 'primary.300' : 'white'}
          color={!isSelectedIndividual ? 'white' : 'primary.300'}
          _hover={{
            bg: !isSelectedIndividual ? 'primary.300' : '#F1F1F1',
          }}
          px={buttonPadding}
          flex="1"
        >
          Par équipe
        </Button>
      </Flex>
    </Box>
  );
}

export default SwitchButton;
