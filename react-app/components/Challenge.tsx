/* eslint-disable */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Flex, Card, Heading, Text, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

interface ChallengeProps {
  title: string;
  description: string;
  points: number;
  days: number;
  clear: () => void;
}

const Challenge: React.FC<ChallengeProps> = ({
  title,
  description,
  points,
  days,
  clear
}) => {
  return (
    <Flex
      zIndex={5}
      ml="-64px"
      mt="-64px"
      position="absolute"
      height="100vh"
      width="100%"
      bg="tertiary"
      flexDirection="column"
    >
      <Flex
        flexDirection="column"
        h="25vh"
        bg="darkgray"
        px="54px"
        justifyContent="flex-end"
        gap="8px"
        py="16px"
      >
        <IconButton
          isRound={true}
          variant="solid"
          aria-label="Done"
          fontSize="20px"
          icon={<ArrowBackIcon />}
          width="fit-content"
          onClick={clear}
        />
        <Heading size="lg">{title}</Heading>
        <Flex gap={2}>
          <Box width="auto" bg="#166879" color="white" p={2} borderRadius={8}>
            <Text fontWeight="bold">{points} pts</Text>
          </Box>
          <Box width="auto" bg="#4FD1C5" color="white" p={2} borderRadius={8}>
            <Text fontWeight="bold">{days} jours</Text>
          </Box>
        </Flex>
      </Flex>
      <Flex flexDirection="column" px="54px" py="16px">
        <Heading size="md">Description</Heading>
        <p>{description}</p>
        <Heading size="md">Ressources</Heading>
        <Text>{description}</Text>
      </Flex>
    </Flex>
  );
};
export default Challenge;
