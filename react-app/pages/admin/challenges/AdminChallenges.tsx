import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Flex,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import FormCreateChallenge from './FormCreateChallenge';
import ChallengeData from '../../../interfaces/challengeInterface';
import dateGap from '../../../utils/mathFunctions';
import FormUpdateChallenge from './FormUpdateChallenge';

function AdminChallenges() {
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);

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
  }, [challenges]);

  return (
    <Flex flexDirection="column" gap="16px">
      <FormCreateChallenge />
      <TableContainer bg="white" borderRadius={16}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th width="30%">Nom du défi</Th>
              <Th width="20%">Catégorie</Th>
              <Th width="20%">Points</Th>
              <Th width="20%">Date de fin</Th>
              <Th width="10%">Modifier</Th>
            </Tr>
          </Thead>
          {challenges.map((challenge) => (
            <Tr key={challenge.id}>
              <Td width="30%">{challenge.title}</Td>
              <Td width="30%">{challenge.category}</Td>
              <Td width="20%">{challenge.points}</Td>
              <Td width="20%">{dateGap(challenge.endDate)} jours</Td>
              <Td width="10%">
                <FormUpdateChallenge currentChallenge={challenge} />
              </Td>
            </Tr>
          ))}
        </Table>
      </TableContainer>
    </Flex>
  );
}

export default AdminChallenges;
