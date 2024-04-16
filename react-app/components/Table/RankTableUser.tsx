import React from 'react';
import { Stack, Box, Text, Flex, Image } from '@chakra-ui/react';

// Définition du type pour un joueur
type Player = {
  id: number;
  name: string;
  score: number;
  level: number;
  team: string;
};

function RankTableUser() {
  // Exemple de données de joueurs
  const players: Player[] = [
    { id: 1, name: 'Maxime BRUN', score: 100, level: 23, team: 'Sales' },
    { id: 2, name: 'Yanice BOADY', score: 90, level: 15, team: 'DevOps' },
    { id: 3, name: 'Yvan MONKA', score: 80, level: 14, team: 'DataScience' },
    // Ajoutez plus de joueurs au besoin
  ];
  return (
    <Stack spacing={4}>
      {players.map((player, index) => (
        <Stack
          key={player.id}
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
                {player.name}
              </Text>
              <Flex direction="row" gap={2}>
                <Text color="#7E8998" fontWeight="semiBold">
                  {player.score} pts
                </Text>
                <Text color="secondary.300" fontWeight="semiBold">
                  Niveau {player.level}
                </Text>
                <Text color="primary.300" fontWeight="semiBold">
                  {player.team}
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Image
            boxSize="100px"
            objectFit="cover"
            src="https://bit.ly/dan-abramov"
            alt="Dan Abramov"
            borderRadius="lg"
          />
        </Stack>
      ))}
    </Stack>
  );
}

export default RankTableUser;
