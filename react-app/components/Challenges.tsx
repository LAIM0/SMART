/* eslint-disable */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Flex, Card, Heading, Text } from "@chakra-ui/react";
import Challenge from "./Challenge";

interface Category {
  categoryName: string;
  _id: string;
}

interface ChallengeData {
  _id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  endDate: Date;
}

function Challenges() {
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get<Category[]>(
        "http://localhost:3001/categories/all"
      );
      setCategories(response.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ChallengeData[]>(
          "http://localhost:3001/challenges/all"
        );
        setChallenges(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, []);

  const Tous: Category = { categoryName: "Tous", _id: "" };
  const [currentCategory, setCurrentCategory] = useState<Category>(Tous);
  const [currentChallenge, setCurrentChallenge] =
    useState<ChallengeData | null>(null);

  const clearCurrentChallenge = () => {
    setCurrentChallenge(null);
  };

  return (
    <Flex
      flexDirection="column"
      gap={4}
      bg="#F8F8F8"
      p={8}
      overflow="hidden"
      height={currentChallenge ? "100vh" : "auto"}
    >
      {currentChallenge && (
        <Challenge
          title={currentChallenge.title}
          description={currentChallenge.description}
          days={3}
          points={currentChallenge.points}
          clear={clearCurrentChallenge}
        />
      )}
      <Heading>Défis</Heading>
      <Flex
        p={3}
        gap={3}
        bg="white"
        borderRadius={8}
        boxShadow="sm"
        overflowX="scroll"
      >
        <Box
          bg={currentCategory.categoryName === "Tous" ? "#166879" : "white"}
          onClick={() => setCurrentCategory(Tous)}
          _hover={{
            bg:
              currentCategory.categoryName === "Tous" ? "166879" : "lightgray",
            cursor: "pointer"
          }}
          borderRadius={4}
          color={currentCategory.categoryName === "Tous" ? "white" : "#166879"}
          px={4}
          py={2}
          textAlign="center"
          fontSize={12}
          fontWeight={
            currentCategory.categoryName === "Tous" ? "bold" : "normal"
          }
        >
          <Heading size="sm">Tous</Heading>
        </Box>
        {categories.map((category) => (
          <Box
            bg={
              category.categoryName === currentCategory.categoryName
                ? "#166879"
                : "white"
            }
            key={category._id}
            onClick={() => setCurrentCategory(category)}
            _hover={{
              bg:
                category.categoryName === currentCategory.categoryName
                  ? "166879"
                  : "lightgray",
              cursor: "pointer"
            }}
            borderRadius={4}
            color={
              category.categoryName === currentCategory.categoryName
                ? "white"
                : "#166879"
            }
            px={4}
            py={2}
            textAlign="center"
            fontSize={12}
            fontWeight={
              category.categoryName === currentCategory.categoryName
                ? "bold"
                : "normal"
            }
          >
            <Heading size="sm">{category.categoryName}</Heading>
          </Box>
        ))}
      </Flex>
      <Heading>À relever</Heading>
      {challenges.map((challenge) => (
        <Flex wrap="wrap" key={challenge._id}>
          {(currentCategory.categoryName === "Tous" ||
            currentCategory._id === challenge.category) && (
            <Card
              onClick={() => setCurrentChallenge(challenge)}
              boxShadow="md"
              borderRadius={12}
              bg="white"
              p={4}
              gap={2}
              maxWidth="400px"
              marginBottom={2}
              transition="transform 0.3s ease"
              _hover={{
                transform: "translate(20px)",
                cursor: "pointer"
              }}
            >
              <Heading size="md">{challenge.title}</Heading>
              <p>{challenge.description}</p>
              <Flex gap={2}>
                <Box
                  width="auto"
                  bg="#166879"
                  color="white"
                  p={2}
                  borderRadius={8}
                >
                  <Text fontWeight="bold">{challenge.points} pts</Text>
                </Box>
                <Box
                  width="auto"
                  bg="#4FD1C5"
                  color="white"
                  p={2}
                  borderRadius={8}
                >
                  <Text fontWeight="bold">
                    {Math.floor(
                      (new Date(challenge.endDate).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    jours
                  </Text>
                </Box>
              </Flex>
            </Card>
          )}
        </Flex>
      ))}
    </Flex>
  );
}

export default Challenges;
