import React from 'react';
import { Box, Button, HStack } from '@chakra-ui/react';

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
  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
      <HStack spacing={2}>
        <Button
          onClick={() => onSelectionChange(SELECTION_MODES.INDIVIDUAL)}
          bgColor={isSelectedIndividual ? 'primary.300' : 'white'}
          color={isSelectedIndividual ? 'white' : 'primary.300'}
          _hover={{
            bg: 'secondary.300',
            color: 'white',
          }}
          px={12}
        >
          Individuel
        </Button>
        <Button
          onClick={() => onSelectionChange(SELECTION_MODES.TEAM)}
          bgColor={!isSelectedIndividual ? 'primary.300' : 'white'}
          color={!isSelectedIndividual ? 'white' : 'primary.300'}
          _hover={{
            bg: 'secondary.300',
            color: 'white',
          }}
          px={12}
        >
          Par équipe
        </Button>
      </HStack>
    </Box>
  );
}

export default SwitchButton;
