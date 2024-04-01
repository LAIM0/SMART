/*eslint-disable*/
import Layout from "../../components/Layout/Layout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Flex, Card, Heading, Text } from "@chakra-ui/react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../../styles/theme";
import { useRouter } from "next/router";

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
  pedagogicalExplanation: string;
}

interface UserData {
  _id: string;
  email: string;
}

const Challenges: React.FC = () => {
  const router = useRouter();

  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<UserData[]>([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await axios.get<UserData[]>(
  //       "http://localhost:3001/users/me"
  //     );
  //     setUser(response.data);
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Assurez-vous que cette URL correspond à votre configuration serveur
        const response = await axios.get("http://localhost:3001/users/check", { withCredentials: true });
        // Si l'utilisateur n'est pas connecté, redirigez-le
        if (!response.data.loggedIn) {
          localStorage.setItem('preLoginRoute', window.location.pathname);
          router.push('/login');    
          
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        localStorage.setItem('preLoginRoute', window.location.pathname);
        router.push('/login');
      }
    };

    checkAuthentication();
  }, [router]);
  
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

  const dateGap = (endDate: Date): number => {
    return (
      Math.floor(
        (new Date(endDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1
    );
  };

  challenges.sort((a, b) => (a.points > b.points ? 1 : -1));
  challenges.sort((a, b) => (dateGap(a.endDate) > dateGap(b.endDate) ? 1 : -1));

  return (
    <div>
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
      <Heading marginTop="24px">À relever</Heading>
      <Flex className="challengeList" flexDirection="row" flexWrap="wrap">
        {challenges.map((challenge) => (
          <div>
            {(currentCategory.categoryName === "Tous" ||
              currentCategory._id === challenge.category) &&
              dateGap(challenge.endDate) >= 0 && (
                <Card
                  key={challenge._id}
                  onClick={() => router.push("/challenges/" + challenge._id)}
                  boxShadow="md"
                  borderRadius={12}
                  bg="white"
                  p={4}
                  gap={2}
                  maxWidth="500px"
                  minWidth="300px"
                  marginBottom={8}
                  marginRight={8}
                  transition="transform 0.3s ease"
                  _hover={{
                    transform: "translate(20px)",
                    cursor: "pointer"
                  }}
                >
                  <Heading size="md">{challenge.title}</Heading>
                  <Text minHeight="40px">{challenge.description}</Text>
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
                        {dateGap(challenge.endDate) === 0
                          ? "Aujourd'hui"
                          : dateGap(challenge.endDate) + " jours"}
                      </Text>
                    </Box>
                  </Flex>
                </Card>
              )}
          </div>
        ))}
      </Flex>

      <Heading>Relevés récemment</Heading>
      <Flex wrap="wrap" gap={0}>
        {challenges.map((challenge) => (
          <div>
            {(currentCategory.categoryName === "Tous" ||
              currentCategory._id === challenge.category) &&
              dateGap(challenge.endDate) < 0 && (
                <Card
                  key={challenge._id}
                  onClick={() => router.push("/challenges/" + challenge._id)}
                  boxShadow="md"
                  borderRadius={12}
                  bg="#166879"
                  p={4}
                  gap={2}
                  maxWidth="500px"
                  minWidth="300px"
                  marginBottom={8}
                  marginRight={8}
                  transition="transform 0.3s ease"
                  _hover={{
                    transform: "translate(20px)",
                    cursor: "pointer"
                  }}
                >
                  <Heading size="md" color="white">
                    {challenge.title}{" "}
                  </Heading>
                  <Text minHeight="40px" color="white">
                    {challenge.description}
                  </Text>
                  <Flex gap={2}>
                    <Box
                      width="auto"
                      bg="white"
                      color="#166879"
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
                        {dateGap(challenge.endDate) == 0
                          ? "Aujourd'hui"
                          : dateGap(challenge.endDate) + " jours"}
                      </Text>
                    </Box>
                  </Flex>
                </Card>
              )}
          </div>
        ))}
      </Flex>
    </div>
  );
};

export default Challenges;
