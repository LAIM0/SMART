import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

interface CategoryCardProps {
  categoryName: string;
  score: number;
}

function CategoryCard({ categoryName, score }: CategoryCardProps) {
  return (
    <Flex
      flexDirection="column"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="base"
      width="200px"
      height="150px"
    >
      <Box
        bg="primary.300"
        width="100%"
        height="40%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
      >
        <Text fontWeight="semiBold" fontSize="lg" p={10}>
          {categoryName}
        </Text>
      </Box>
      <Box
        bg="white"
        width="100%"
        height="60%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="gray.800"
      >
        <Text fontWeight="bold" fontSize="xl">
          {score} pts
        </Text>
      </Box>
    </Flex>
  );
}

export default CategoryCard;
