import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

interface ProgressBarProps {
  level: number; // Le niveau actuel du joueur
  percentage: number; // Le pourcentage d'avancement vers le prochain niveau
}

function ProgressBar({ level, percentage }: ProgressBarProps) {
  return (
    <Box maxW="380px" pb="10" pt="5">
      <Flex justifyContent="space-between" mb="1">
        <Text fontWeight="bold" fontSize="xl" color="secondary.300">
          Niveau {level}
        </Text>
        <Text fontWeight="bold" fontSize="xl" color="secondary.300">
          {percentage}%
        </Text>
      </Flex>
      <Box
        height="25px"
        bg="white"
        borderRadius="sm"
        position="relative"
        overflow="hidden"
      >
        <Box
          height="100%"
          width={`${percentage}%`}
          bg="secondary.300"
          position="absolute"
          transition="width 0.6s ease"
        />
      </Box>
    </Box>
  );
}

export default ProgressBar;
