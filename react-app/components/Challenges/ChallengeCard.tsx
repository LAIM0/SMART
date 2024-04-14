import React from 'react';
import { Box, Card, Text, Flex } from '@chakra-ui/react';
import dateGap from '../../utils/mathFunctions';
import ChallengeData from '../../interfaces/challengeInterface';

interface ChallengeCardProps {
  challenge: ChallengeData;
  completionDate: Date;
  onClick: () => void;
  type: 'toComplete' | 'recentlyCompleted';
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  completionDate,
  onClick,
  type,
}) => {
  const isRecentlyCompleted = type === 'recentlyCompleted';

  return (
    <Card
      key={challenge.id}
      onClick={onClick}
      boxShadow="sm"
      borderRadius={12}
      bg={isRecentlyCompleted ? 'secondary.100' : 'white'}
      p={4}
      gap={2}
      flex={1}
      maxWidth="500px"
      minWidth="300px"
      transition=" box-shadow 0.3s ease"
      _hover={{
        boxShadow: 'md',
        cursor: 'pointer',
      }}
    >
      <Text as="h2">{challenge.title}</Text>

      <Text
        minHeight="40px"
        mb="4px"
        sx={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          overflow: 'hidden',
        }}
      >
        {challenge.description}
      </Text>
      <Box>
        <Flex gap={2}>
          <Box bg="primary.300" py="8px" px="16px" borderRadius={8}>
            <Text as="h4" color="white">
              {challenge.points} pts
            </Text>
          </Box>

          <Box
            bg={isRecentlyCompleted ? 'white' : '#4FD1C5'}
            py="8px"
            px="16px"
            borderRadius={8}
          >
            <Text as="h4" color={isRecentlyCompleted ? 'primary.300' : 'white'}>
              {isRecentlyCompleted
                ? `Relevé ${dateGap(completionDate) === 0 ? "aujourd'hui" : `il y a ${dateGap(completionDate) * -1} jours`}`
                : dateGap(challenge.endDate) === 0
                  ? "Aujourd'hui"
                  : `${dateGap(challenge.endDate)} jours`}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Card>
  );
};

export default ChallengeCard;
