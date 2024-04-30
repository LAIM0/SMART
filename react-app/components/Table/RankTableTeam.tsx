import React, { useEffect, useState } from 'react';
import { Flex, Box, Text, Stack, Icon, Square, Image } from '@chakra-ui/react';
import { MoonIcon } from '@chakra-ui/icons';
import TeamApiManager from '../../api/TeamApiManager';
import TeamData from '../../interfaces/teamInterface';

function RankTableTeam() {
  const [teams, setPlayers] = useState<{ team: TeamData; score: number }[]>([]);

  useEffect(() => {
    const fetchRanking = async () => {
      const response = await TeamApiManager.fetchTeamsRanking();
      setPlayers(response);
    };

    fetchRanking();
  }, []);

  return (
    <Stack spacing={4}>
      {teams.map((teamUnit, index) => (
        <Stack
          key={teamUnit.team.id}
          direction="row"
          spacing={10}
          px={10}
          py={4}
          borderRadius="lg"
          align="center"
          justify="space-between"
          backgroundColor="white"
          boxShadow="sm"
        >
          <Flex direction="row" gap={10}>
            <Box fontSize="36px" fontWeight="extraBold">
              {index + 1}
            </Box>
            <Flex direction="column">
              <Text fontSize="h2" fontWeight="semiBold">
                {teamUnit.team.name}
              </Text>
              <Flex direction="row" gap={2}>
                <Text color="#7E8998" fontWeight="semiBold">
                  {teamUnit.score} pts
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
            {teamUnit.team.picturePath ? (
              <Image
                boxSize="80%"
                objectFit="cover"
                src={`http://localhost:3001/users/profile-picture/${teamUnit.team.picturePath}`}
                alt={`${teamUnit.team.name} icon`}
                borderRadius="lg"
              />
            ) : (
              <Icon
                as={MoonIcon}
                color="white"
                boxSize="80%"
                objectFit="cover"
                borderRadius="lg"
              />
            )}
          </Square>
        </Stack>
      ))}
    </Stack>
  );
}

export default RankTableTeam;
