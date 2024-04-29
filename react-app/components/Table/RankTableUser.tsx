import React, { useEffect, useState } from 'react';
import { Stack, Box, Text, Flex, Image } from '@chakra-ui/react';
import { fetchUserRanking } from '../../api/UserApiManager';
import { UserDataRanking } from '../../interfaces/userInterface';
import { updateAllLevels } from '../../api/UserApiManager';

function RankTableUser() {
  const [players, setPlayers] = useState<
    { user: UserDataRanking; score: number; teamName: string }[]
  >([]);

  useEffect(() => {
    const fetchRanking = async () => {
      // Attendre que la mise à jour des niveaux soit terminée avant de charger le classement
      try {
        console.log('Try to update all users levels...');
        await updateAllLevels();
        console.log('User levels updated successfully.');
        const response = await fetchUserRanking();
        setPlayers(response);
      } catch (error) {
        console.error('Failed to update user levels or fetch ranking:', error);
      }
    };

    fetchRanking();
  }, []);

  return (
    <Stack spacing={4}>
      {players.map((player, index) => (
        <Stack
          key={player.user.id}
          direction="row"
          spacing={10}
          px={10}
          py={4}
          borderRadius="lg"
          align="center"
          justify="space-between"
          backgroundColor="white"
          boxShadow="md"
        >
          <Flex direction="row" gap={10}>
            <Box fontSize="36px" fontWeight="extraBold">
              {index + 1}
            </Box>
            <Flex direction="column">
              <Text fontSize="h2" fontWeight="semiBold">
                {`${player.user.firstName} ${player.user.lastName}`}
              </Text>
              <Flex direction="row" gap={2}>
                <Text color="#7E8998" fontWeight="semiBold">
                  {player.score} pts
                </Text>
                <Text color="secondary.300" fontWeight="semiBold">
                  Niveau {player.user.level}
                </Text>
                <Text color="primary.300" fontWeight="semiBold">
                  {player.teamName}
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Image
            boxSize="100px"
            objectFit="cover"
            src={`http://localhost:3001/users/profile-picture/${player.user.profilePicturePath}`}
            alt="Pas de photo de profil"
            borderRadius="lg"
          />
        </Stack>
      ))}
    </Stack>
  );
}

export default RankTableUser;
