import React, { useEffect, useState } from 'react';
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
import { ArrowBackIcon } from '@chakra-ui/icons';
import getById from '../../api/challenges';
import theme from '../../styles/theme';
import Layout from '../../components/Layout/Layout';

interface ChallengeData {
  title: string;
  description: string;
  points: number;
  days: number;
  pedagogicalExplanation: string;
}

function Challenge() {
  const router = useRouter();

  const [currentChallenge, setCurrentChallenge] = useState<ChallengeData>();

  useEffect(() => {
    async function fetchCurrentChallenge() {
      console.log(`affichage de l'id dans le router : ${router.query.id}`);
      const fetchChallenge: ChallengeData = await getById(
        router.query.id as string
      );
      console.log(fetchChallenge);
      setCurrentChallenge(fetchChallenge);
    }
    fetchCurrentChallenge();
  }, [router.query.id]);

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
                <Text fontWeight="bold">{currentChallenge?.days} jours</Text>
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
              bg="#54C8C3"
              width="fit-content"
              color="white"
              boxShadow="md"
            >
              Valider le défi
            </Button>
          </Flex>
        </Flex>
      </Layout>
    </ChakraProvider>
  );
}
export default Challenge;
