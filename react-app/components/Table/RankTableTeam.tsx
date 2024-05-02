import React, { useEffect, useState } from 'react';
import {
  Flex,
  Box,
  Text,
  Stack,
  Icon,
  Square,
  Image,
  useBreakpointValue,
} from '@chakra-ui/react';
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

  const fontSizeResponse = useBreakpointValue({ base: 'md', md: 'xl' });
  const imageSize = useBreakpointValue({ base: '60px', md: '100px' });
  const flexGap = useBreakpointValue({ base: '5', md: '10' });
  const paddingLeft = useBreakpointValue({ base: '7', md: '10' });
  const paddingRight = useBreakpointValue({ base: '3', md: '10' });
  const paddingY = useBreakpointValue({ base: '3', md: '4' });

  return (
    <Stack spacing={4}>
      {teams.map((teamUnit, index) => (
        <Flex
          key={teamUnit.team.id}
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
            size={imageSize}
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
        </Flex>
      ))}
    </Stack>
  );
}

export default RankTableTeam;
