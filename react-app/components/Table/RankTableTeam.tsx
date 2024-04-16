import React from 'react';
import { Flex, Box, Text, Stack, Icon, Square } from '@chakra-ui/react';
import { MoonIcon } from '@chakra-ui/icons';
// Définition du type pour un joueur
type Team = {
  id: number;
  name: string;
  score: number;
};

function RankTableTeam() {
  // Exemple de données de joueurs
  const teams: Team[] = [
    { id: 1, name: 'BU Data Science', score: 340 },
    { id: 2, name: 'Marketing', score: 210 },
    { id: 3, name: 'BU DevOps', score: 160 },
    // Ajoutez plus de joueurs au besoin
  ];
  return (
    <Stack spacing={4}>
      {teams.map((team, index) => (
        <Stack
          key={team.id}
          direction="row"
          spacing={10}
          px={10}
          py={4}
          borderRadius="lg"
          align="center"
          justify="space-between"
          backgroundColor={index % 2 === 0 ? 'tertiary' : 'white'}
          boxShadow="md"
        >
          <Flex direction="row" gap={10}>
            <Box fontSize="36px" fontWeight="extraBold">
              {index + 1}
            </Box>
            <Flex direction="column">
              <Text fontSize="h2" fontWeight="semiBold">
                {team.name}
              </Text>
              <Flex direction="row" gap={2}>
                <Text color="#7E8998" fontWeight="semiBold">
                  {team.score} pts
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Square
            backgroundColor="primary.300"
            shadow="md"
            borderRadius="lg"
            size="100px"
          >
            <Icon
              as={MoonIcon}
              color="white"
              boxSize="80%"
              objectFit="cover"
              borderRadius="lg"
            />
          </Square>
        </Stack>
      ))}
    </Stack>
  );
}

export default RankTableTeam;
