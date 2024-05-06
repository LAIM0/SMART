import React, { useEffect, useState } from 'react';
import {
  Stack,
  Box,
  Text,
  Flex,
  Image,
  useBreakpointValue,
} from '@chakra-ui/react';
import { UserDataRanking } from '../../interfaces/userInterface';
import { updateAllLevels, fetchUserRanking } from '../../api/UserApiManager';

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

  // Gestion responsive
  const fontSizeResponse = useBreakpointValue({ base: 'md', md: 'xl' });
  const imageSize = useBreakpointValue({ base: '60px', md: '100px' });
  const flexGap = useBreakpointValue({ base: '5', md: '10' });
  const paddingLeft = useBreakpointValue({ base: '7', md: '10' });
  const paddingRight = useBreakpointValue({ base: '3', md: '10' });
  const paddingY = useBreakpointValue({ base: '3', md: '4' });

  return (
    <Stack spacing={4}>
      {players.map((player, index) => (
        <Flex
          key={player.user.id}
          pl={paddingLeft}
          pr={paddingRight}
          py={paddingY}
          borderRadius="lg"
          align="center"
          backgroundColor="white"
          boxShadow="sm"
          direction="row"
          justify="space-between"
          wrap="nowrap"
        >
          <Flex direction="row" gap={flexGap}>
  <Box fontSize="36px" fontWeight="extraBold">
    {index + 1}
  </Box>
  <Flex direction="column" justify="center">
    <Text fontSize={fontSizeResponse} fontWeight="semiBold">
      {`${player.user.firstName} ${player.user.lastName}`}
    </Text>
    <Flex direction="row" gap={2}>
      <Text color="#7E8998" fontWeight="semiBold" isTruncated>
        {player.score} pts
      </Text>
      <Text color="secondary.300" fontWeight="semiBold" isTruncated>
        Niveau {player.user.level}
      </Text>
    </Flex>
    <Text color="primary.300" fontWeight="semiBold" isTruncated>
      {player.teamName}
    </Text>
  </Flex>
</Flex>

          <Image
            boxSize={imageSize}
            objectFit="cover"
            src={`http://localhost:3001/users/profile-picture/${player.user.profilePicturePath}`}
            alt="Pas de photo de profil"
            borderRadius="lg"
            ml={2}
          />
        </Flex>
      ))}
    </Stack>
  );
}

export default RankTableUser;
