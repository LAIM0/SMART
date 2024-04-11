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

interface ChallengeData {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  endDate: Date;
  pedagogicalExplanation: string;
}

function AdminChallenges() {
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);

  const [currentChallenge, setCurrentChallenge] =
    useState<ChallengeData | null>(null);

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

  // State for first modal
  const {
    isOpen: isOpenFormModal,
    onOpen: onOpenFormModal,
    onClose: onCloseFormModal,
  } = useDisclosure();

  // State for second modal
  const {
    isOpen: isOpenDeleteModal,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();

  const clearCurrentChallenge = () => {
    setCurrentChallenge(null);
  };

  const deleteChallenge = async () => {
    try {
      await axios.delete<ChallengeData[]>(
        `http://localhost:3001/challenges/delete/${currentChallenge?.id}`
      );
      setChallenges(
        challenges.filter((challenge) => challenge.id !== currentChallenge?.id)
      );
    } catch (error) {
      console.error('Erreur lors de la suppression des données:', error);
    }
  };

  return (
    <Flex flexDirection="column" gap="16px">
      <Button
        bg="primary.300"
        color="white"
        width="fit-content"
        onClick={onOpenFormModal}
      >
        Ajouter un défi
      </Button>
      <TableContainer bg="white" borderRadius={16}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th width="20%">Nom du défi</Th>
              <Th width="60%">Description</Th>
              <Th width="20%" isNumeric>
                Points
              </Th>
            </Tr>
          </Thead>
          {challenges.map((challenge) => (
            <Tr
              onClick={() => {
                onOpenDeleteModal(); // Appeler la fonction onOpen
                setCurrentChallenge(challenge); // Appeler setCurrentChallenge avec le défi actuel
              }}
              key={challenge.id}
              _hover={{ bg: 'lightgray', cursor: 'pointer' }}
            >
              <Td width="20%">{challenge.title}</Td>
              <Td width="60%">{challenge.description}</Td>
              <Td width="20%">{challenge.points}</Td>
            </Tr>
          ))}
        </Table>
      </TableContainer>
      <Modal isOpen={isOpenDeleteModal} onClose={onCloseDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{currentChallenge?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{currentChallenge?.description}</ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                onCloseDeleteModal();
                clearCurrentChallenge();
              }}
            >
              Close
            </Button>
            <Button
              color="white"
              bg="#E00261"
              onClick={() => {
                deleteChallenge();
                onCloseDeleteModal();
              }}
            >
              Supprimer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenFormModal} onClose={onCloseFormModal}>
        <ModalOverlay />
        <ModalContent bg="#F8F8F8" p="24px">
          <ModalHeader>Ajouter un défi</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormCreateChallenge />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default AdminChallenges;
