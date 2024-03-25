/* eslint-disable */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Flex, Card, Heading, Text } from "@chakra-ui/react";

function Challenges() {
  const [challenges, setChallenge] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:3001/categories/all");
      setCategories(response.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/challenges/all"
        );
        setChallenge(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, []);

  const Tous = { categoryName: "Tous" };
  const [currentCategory, setCurrentCategory] = useState(Tous);

  return (
    <Flex flexDirection="column" gap={4} bg="#F8F8F8" p={8} overflow="hidden">
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
          bg={"Tous" === currentCategory.categoryName ? "#166879" : "white"}
          onClick={() => setCurrentCategory(Tous)}
          _hover={{
            bg:
              "Tous" === currentCategory.categoryName ? "166879" : "lightgray",
            cursor: "pointer"
          }}
          borderRadius={4}
          color={"Tous" === currentCategory.categoryName ? "white" : "#166879"}
          px={4}
          py={2}
          textAlign="center"
          fontSize={12}
          fontWeight={
            "Tous" === currentCategory.categoryName ? "bold" : "normal"
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
            key={category}
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
        <Flex wrap="wrap">
          {(currentCategory.categoryName === "Tous" ||
            currentCategory._id === challenge.category) && (
            <Card
              boxShadow="md"
              borderRadius={12}
              bg="white"
              key={challenge._id}
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
                      (challenge.endDate - new Date()) / (1000 * 60 * 60 * 24)
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
