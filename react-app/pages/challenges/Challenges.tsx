import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Flex, Text, Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import CompletedChallengeData from '../../interfaces/completedInterface';
import CategoryData from '../../interfaces/categoryInterface';
import ChallengeData from '../../interfaces/challengeInterface';
import CompletedApiManager from '../../api/CompletedApiManager';
import dateGap from '../../utils/mathFunctions';
import CategoryApiManager from '../../api/CategoryApiManager';
import ChallengeCard from '../../components/Challenges/ChallengeCard';
import UserData from '../../interfaces/userInterface';

function Challenges() {
  const router = useRouter();
  const Tous: CategoryData = { categoryName: 'Tous', id: '' };
  const [currentCategory, setCurrentCategory] = useState<CategoryData>(Tous);
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<
    CompletedChallengeData[]
  >([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [completedChallengesIds, setCompletedChallengesIds] = useState<
    string[]
  >([]);
  const today = new Date();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ChallengeData[]>(
          'http://localhost:3001/challenges/all'
        );
        setChallenges(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCompletedChallenges = async () => {
      try {
        const userData = await axios.get<UserData>(
          'http://localhost:3001/users/me',
          { withCredentials: true }
        );
        const tempCompletedChallenges =
          await CompletedApiManager.getCompletedChallengesByUserId(
            userData.data.id
          );
        setCompletedChallenges(tempCompletedChallenges);
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des challenges complétés:',
          error
        );
      }
    };

    fetchCompletedChallenges();
  }, []);

  useEffect(() => {
    const ids = completedChallenges.map((completed) => completed.challenge.id);
    setCompletedChallengesIds(ids);
  }, [completedChallenges]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await CategoryApiManager.getAll();
      setCategories(response);
    };

    fetchCategories();
  }, []);

  challenges.sort((a, b) => (a.points > b.points ? 1 : -1));
  challenges.sort((a, b) => (dateGap(a.endDate) > dateGap(b.endDate) ? 1 : -1));

  const handleClickCard = (challenge: ChallengeData): void => {
    router.push(`/challenges/${challenge.id}`);
  };

  const challengesToShow = challenges.filter(
    (challenge) =>
      (currentCategory.categoryName === 'Tous' ||
        currentCategory.categoryName === challenge.category) &&
      dateGap(challenge.endDate) >= 0 &&
      !completedChallengesIds.includes(challenge.id)
  );

  const completedChallengesToShow = completedChallenges.filter(
    (completedChallenge) =>
      (currentCategory.categoryName === 'Tous' ||
        currentCategory.categoryName ===
          completedChallenge.challenge.category) &&
      dateGap(completedChallenge.completed.completionDate) >= 0
  );

  return (
    <Flex p="32px" flexDirection="column">
      <Text as="h1">Défis</Text>
      <Flex
        p={3}
        gap={3}
        bg="white"
        borderRadius="16px"
        boxShadow="sm"
        overflowX="scroll"
        w="fit-content"
        mb="24px"
      >
        <Box
          bg={currentCategory.categoryName === 'Tous' ? 'primary.300' : 'white'}
          onClick={() => setCurrentCategory(Tous)}
          _hover={{
            bg:
              currentCategory.categoryName === 'Tous'
                ? 'primary.300'
                : '#F1F1F1',
            cursor: 'pointer',
          }}
          borderRadius="8px"
          px={4}
          py={2}
          textAlign="center"
          fontSize={12}
          fontWeight={
            currentCategory.categoryName === 'Tous' ? 'bold' : 'normal'
          }
          transition="background-color 0.3s ease"
        >
          <Text
            as="h4"
            color={
              currentCategory.categoryName === 'Tous' ? 'white' : 'primary.300'
            }
          >
            Tous
          </Text>
        </Box>
        {categories.map((category) => (
          <Box
            bg={
              category.categoryName === currentCategory.categoryName
                ? 'primary.300'
                : 'white'
            }
            key={category.id}
            onClick={() => setCurrentCategory(category)}
            _hover={{
              bg:
                category.categoryName === currentCategory.categoryName
                  ? '166879'
                  : '#F1F1F1',
              cursor: 'pointer',
            }}
            borderRadius="8px"
            px={4}
            py={2}
            textAlign="center"
            fontWeight={
              category.categoryName === currentCategory.categoryName
                ? 'bold'
                : 'normal'
            }
            transition="background-color 0.3s ease"
          >
            <Text
              color={
                category.categoryName === currentCategory.categoryName
                  ? 'white'
                  : 'primary.300'
              }
              as="h4"
            >
              {category.categoryName}
            </Text>
          </Box>
        ))}
      </Flex>
      <Text as="h1">À relever</Text>

      <Flex
        className="challengeList"
        flexDirection="row"
        flexWrap="wrap"
        mb="24px"
      >
        {challengesToShow.length > 0 ? (
          <Flex
            className="challengeList"
            flexDirection="row"
            flexWrap="wrap"
            gap="16px"
          >
            {challengesToShow.map((challenge) => (
              <ChallengeCard
                completionDate={today}
                type="toComplete"
                key={challenge.id}
                challenge={challenge}
                onClick={() => handleClickCard(challenge)}
              />
            ))}
          </Flex>
        ) : (
          <Text as="p">Aucun challenge à relever pour le moment</Text>
        )}
      </Flex>
      <Text as="h1">Relevés récemment</Text>
      <Flex flexDirection="row" flexWrap="wrap" mb="24px">
        {completedChallengesToShow.length > 0 ? (
          <Flex flexDirection="row" flexWrap="wrap" gap="16px">
            {completedChallengesToShow.map((completedChallenge) => (
              <ChallengeCard
                key={completedChallenge.completed.id}
                challenge={completedChallenge.challenge}
                onClick={() =>
                  router.push(`/challenges/${completedChallenge.challenge.id}`)
                }
                type="recentlyCompleted"
                completionDate={completedChallenge.completed.completionDate}
              />
            ))}
          </Flex>
        ) : (
          <Text as="p">Aucun challenge relevé récemment</Text>
        )}
      </Flex>
    </Flex>
  );
}

export default Challenges;
