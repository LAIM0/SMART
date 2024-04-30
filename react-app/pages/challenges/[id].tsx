import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  ChakraProvider,
} from '@chakra-ui/react';
import theme from '../../styles/theme';
import Layout from '../../components/Layout/Layout';
import ChallengeData from '../../interfaces/challengeInterface';
import { UserData } from '../../interfaces/userInterface';
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

  // useEffect(() => {
  //   const date = (currentChallenge && currentChallenge.endDate) || new Date();
  // }, [currentChallenge]);

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
      if (fetchCompletedChallenge.length === 0) {
        setIsCompleted(false);
      } else {
        setIsCompleted(true);
      }
    }
  }

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize(); // Appel initial pour définir la largeur de la fenêtre
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    checkCompletedChallenge();
  }, [user, router.query.id]);

  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Flex
          zIndex={5}
          position="relative"
          height="100vh"
          bg="tertiary"
          flexDirection="column"
        >
          <Flex
            flexDirection="column"
            h="25vh"
            bg="primary.100"
            pr="32px"
            pl="32px"
            justifyContent="flex-end"
            gap="8px"
            py="32px"
          >
            <IconButton
              isRound
              variant="solid"
              bg="white"
              aria-label="Done"
              fontSize="20px"
              icon={<ArrowBackIcon />}
              width="fit-content"
              onClick={() => router.push('/challenges')}
            />
            <Text as="h1" mb="0px">
              {currentChallenge?.title}
            </Text>
            <Flex gap={2}>
              <Box
                width="auto"
                bg="primary.300"
                color="white"
                px="16px"
                py="8px"
                borderRadius={8}
              >
                <Text as="h4" color="white">
                  {currentChallenge?.points} pts
                </Text>
              </Box>
              <Box
                width="auto"
                bg="#4FD1C5"
                color="white"
                px="16px"
                py="8px"
                borderRadius={8}
              >
                <Text as="h4" color="white">
                  {' '}
                  {isCompleted && 'Déjà réalisé'}
                  {!isCompleted &&
                    currentChallenge &&
                    currentChallenge.endDate &&
                    (dateGap(currentChallenge.endDate) === 0
                      ? 'Dernier jour pour le faire !'
                      : `Il vous reste ${dateGap(currentChallenge.endDate)} jours`)}
                  {!isCompleted &&
                    (!currentChallenge || !currentChallenge.endDate) &&
                    'Chargement'}
                </Text>
              </Box>
            </Flex>
          </Flex>
          <Flex
            gap={4}
            flexDirection="column"
            pr="32px"
            pl="32px"
            py="16px"
            position="relative"
          >
            <Text as="h2">Description</Text>
            <p>{currentChallenge?.description}</p>
            <Text as="h2">Ressources</Text>
            <Text>{currentChallenge?.pedagogicalExplanation}</Text>

            <Button
              bg={isCompleted ? '#FFFFFF' : 'secondary.300'}
              _hover={{
                boxShadow: isCompleted
                  ? '0 0px 0px rgba(0,0,0,0)'
                  : '0 8px 24px rgba(51, 193, 177, 1)',
              }}
              position={windowWidth < 500 ? 'fixed' : 'absolute'}
              right={windowWidth < 500 ? '50%' : '54px'}
              transform={windowWidth < 500 ? 'translate(50%,0)' : 'auto'}
              top={windowWidth < 500 ? 'auto' : '-30px'}
              bottom={windowWidth < 500 ? '160px' : '#FFFFFF'}
              fontSize="h3"
              fontWeight="semiBold"
              px="32px"
              py="24px"
              borderRadius="16px"
              transition=" box-shadow 0.3s ease"
              width="fit-content"
              border="2px solid"
              borderColor="secondary.300"
              color={isCompleted ? 'secondary.300' : '#FFFFFF'}
              boxShadow={isCompleted ? 'null' : 'button'}
              onClick={() => {
                if (isCompleted) {
                  deleteCompleted();
                } else {
                  createCompleted();
                }
                setIsCompleted(!isCompleted);
              }}
              disabled
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
