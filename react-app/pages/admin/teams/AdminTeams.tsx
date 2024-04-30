import React, { useState, useEffect } from 'react';
import {
  Flex,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
import TeamData from '../../../interfaces/teamInterface';
import FormCreateModifyTeam from './FormCreateModifyTeam';
import FormConfirmationDeleteTeam from './FormConfirmationDeleteTeam';
import TeamApiManager from '../../../api/TeamApiManager';
import { getUserById } from '../../../api/UserApiManager';

function AdminTeams() {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [currentTeam, setCurrentTeam] = useState<TeamData | null>(null);
  const [teamToDelete, setTeamToDelete] = useState<TeamData>({
    id: '',
    name: '',
    picturePath: '',
    leaderId: '',
  });

  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const allTeams = await TeamApiManager.fetchTeams();
      // Récupérer les détails de l'utilisateur chef d'équipe pour chaque équipe
      const teamsWithLeaders = await Promise.all(
        allTeams.map(async (team: TeamData) => {
          if (team.leaderId) {
            const leader = await getUserById(team.leaderId);
            console.log('leader', leader);
            return {
              ...team,
              leaderName: `${leader.firstName} ${leader.lastName}`,
            };
          }
          // Si l'équipe n'a pas de leader, retournez simplement l'équipe sans les détails du leader
          return team;
        })
      );
      setTeams(teamsWithLeaders);
      console.log(teams);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const {
    isOpen: isOpenFormModal,
    onOpen: onOpenFormModal,
    onClose: onCloseFormModal,
  } = useDisclosure();

  const {
    isOpen: isOpenConfirmationDeleteModal,
    onOpen: onOpenConfirmationDeleteModal,
    onClose: onCloseConfirmationDeleteModal,
  } = useDisclosure();

  const handleOpenConfirmationDeleteModal = async (team: TeamData) => {
    await setTeamToDelete(team);
    onOpenConfirmationDeleteModal();
  };

  const handleOpenreateModifyModal = async (team: TeamData) => {
    await setCurrentTeam(team);
    onOpenFormModal();
  };

  const handleCloseConfirmationDeleteModal = () => {
    setCurrentTeam(null);
    onCloseConfirmationDeleteModal();
    setLoading(!loading);
  };

  const handleCloseCreateModifyModal = () => {
    setCurrentTeam(null);
    onCloseFormModal();
    setLoading(!loading);
  };

  return (
    <Flex flexDirection="column" gap="16px">
      <Flex gap="16px">
        <Text as="h1">Gestion des utilisateurs </Text>
        <Button
          bg="primary.300"
          color="white"
          width="fit-content"
          onClick={onOpenFormModal}
        >
          Ajouter une équipe
        </Button>
      </Flex>
      <TableContainer bg="white" borderRadius={16}>
        <Table variant="simple">
          <Thead bg="secondary.100">
            <Tr>
              <Th>Nom d&apos; équipe</Th>
              <Th>Chef d&apos;équipe</Th>
              <Th />
              <Th> </Th>
            </Tr>
          </Thead>
          <Tbody>
            {teams.map((team) => (
              <Tr key={team.id}>
                <Td>{team.name}</Td>
                <Td>{team.leaderName ? team.leaderName : 'Aucun'}</Td>
                <Td textAlign="right" />
                <Td width="20%" textAlign="right" paddingRight="24px">
                  {team.name !== 'Équipe par défaut' && (
                    <Flex>
                      <Button
                        color="#718096"
                        mr={4}
                        onClick={() => handleOpenreateModifyModal(team)}
                      >
                        Modifier
                      </Button>
                      <Button
                        marginLeft="16px"
                        colorScheme="red"
                        onClick={() => handleOpenConfirmationDeleteModal(team)}
                      >
                        Supprimer
                      </Button>
                    </Flex>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal isOpen={isOpenFormModal} onClose={handleCloseCreateModifyModal}>
        <ModalOverlay />
        <ModalContent bg="#F8F8F8" p="24px">
          {currentTeam !== null && (
            <ModalHeader>Modifier {currentTeam?.name}</ModalHeader>
          )}
          {currentTeam === null && (
            <ModalHeader>Ajouter une équipe</ModalHeader>
          )}
          <ModalCloseButton />
          <ModalBody>
            <FormCreateModifyTeam
              onCloseModal={() => {
                handleCloseCreateModifyModal();
                fetchData(); // Mettre à jour la liste après la fermeture du modal
              }}
              teamToModify={currentTeam}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOpenConfirmationDeleteModal}
        onClose={handleCloseConfirmationDeleteModal}
      >
        <ModalOverlay />
        <ModalContent bg="#F8F8F8" p="24px">
          <ModalHeader>
            Supprimer l&apos;équipe {teamToDelete?.name} ?{' '}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormConfirmationDeleteTeam
              onCloseModal={handleCloseConfirmationDeleteModal}
              teamToDelete={teamToDelete}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default AdminTeams;
