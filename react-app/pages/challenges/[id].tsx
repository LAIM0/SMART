import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import {
  Box,
  Flex,
  Heading,
  Text,
  IconButton,
  Button,
  ChakraProvider,
} from '@chakra-ui/react';
import theme from '../../styles/theme';
import Layout from '../../components/Layout/Layout';
import ChallengeData from '../../interfaces/challengeInterface';
import UserData from '../../interfaces/userInterface';
import ChallengeApiManager from '../../api/ChallengeApiManager';
import CompletedApiManager from '../../api/CompletedApiManager';
import dateGap from '../../utils/mathFunctions';
import CompletedChallengeData from '../../interfaces/completedInterface';

function Challenge() {
  const router = useRouter();

  const [currentChallenge, setCurrentChallenge] = useState<ChallengeData>();
  const [user, setUser] = useState<UserData>();
  const [isCompleted, setIsCompleted] = useState<Boolean>(false);

  useEffect(() => {
    async function fetchCurrentChallenge() {
      if (router.query.id) {
        const fetchChallenge: ChallengeData = await ChallengeApiManager.getById(
          router.query.id as string
        );
        console.log(fetchChallenge);
        setCurrentChallenge(fetchChallenge);
      }
    }
    fetchCurrentChallenge();
  }, [router.query.id]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get<UserData>(
        'http://localhost:3001/users/me',
        { withCredentials: true }
      );
      setUser(response.data);
      console.log('Response data:', response.data);
    };

    fetchData();
  }, []);

  async function createCompleted() {
    if (user && router.query.id)
      await CompletedApiManager.completeChallenge(
        user.id,
        router.query.id as string
      );
  }

  async function deleteCompleted() {
    if (user && router.query.id)
      await CompletedApiManager.deleteCompleted(
        user.id,
        router.query.id as string
      );
  }

  async function checkCompletedChallenge() {
    if (user && router.query.id) {
      console.log(router.query.id as string);
      const fetchCompletedChallenge: CompletedChallengeData[] =
        await CompletedApiManager.getCompletedByUserIdByChallengeId(
          user.id,
          router.query.id as string
        );
      console.log(fetchCompletedChallenge.length);
      if (fetchCompletedChallenge.length == 0) {
        setIsCompleted(false);
      } else {
        console.log('on est bons');
        setIsCompleted(true);
        console.log(isCompleted);
      }
    }
  }

  useEffect(() => {
    checkCompletedChallenge();
  }, [user, router.query.id]);

  return (
    <ChakraProvider theme={theme}>
      <Layout>
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
              isRound
              variant="solid"
              aria-label="Done"
              fontSize="20px"
              icon={<ArrowBackIcon />}
              width="fit-content"
              onClick={() => router.push('/challenges')}
            />
            <Heading size="lg">{currentChallenge?.title}</Heading>
            <Flex gap={2}>
              <Box
                width="auto"
                bg="#166879"
                color="white"
                p={2}
                borderRadius={8}
              >
                <Text fontWeight="bold">{currentChallenge?.points} pts</Text>
              </Box>
              <Box
                width="auto"
                bg="#4FD1C5"
                color="white"
                p={2}
                borderRadius={8}
              >
                <Text fontWeight="bold">3 jours</Text>
              </Box>
            </Flex>
          </Flex>
          <Flex
            gap={4}
            flexDirection="column"
            px="54px"
            py="16px"
            boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          >
            <Heading size="md">Description</Heading>
            <p>{currentChallenge?.description}</p>
            <Heading size="md">Ressources</Heading>
            <Text>{currentChallenge?.pedagogicalExplanation}</Text>

            <Button
              bg={isCompleted ? '#FFFFFF' : '#54C8C3'}
              width="fit-content"
              border="2px solid"
              borderColor="#54C8C3"
              color={isCompleted ? '#54C8C3' : '#FFFFFF'}
              boxShadow={isCompleted ? 'null' : 'md'}
              onClick={() => {
                if (isCompleted) {
                  deleteCompleted();
                } else {
                  createCompleted();
                }
                setIsCompleted(!isCompleted);
              }}
              disabled={true}
            >
              {isCompleted ? 'Défi validé' : 'Valider le défi'}
            </Button>
          </Flex>
        </Flex>
      </Layout>
    </ChakraProvider>
  );
}
export default Challenge;
