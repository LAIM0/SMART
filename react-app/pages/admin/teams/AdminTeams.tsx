/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-nested-ternary */
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
  IconButton,
} from '@chakra-ui/react';
import { TriangleDownIcon } from '@chakra-ui/icons';
import TeamData from '../../../interfaces/teamInterface';
import FormCreateModifyTeam from './FormCreateModifyTeam';
import FormConfirmationDeleteTeam from './FormConfirmationDeleteTeam';
import TeamApiManager from '../../../api/TeamApiManager';
import { getUserById, getFromTeam } from '../../../api/UserApiManager';
import UserSearch from '../../../components/User/searchbar';
import { Filter } from '../../../utils/constants';

function AdminTeams() {
  const [filterByTeamName, setFilterByTeamName] = useState<Filter>(
    Filter.INACTIVE
  );
  const [filterByTeamLeader, setFilterByTeamLeader] = useState<Filter>(
    Filter.INACTIVE
  );

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
      const teamsWithLeadersAndCount = await Promise.all(
        allTeams.map(async (team: TeamData) => {
          const users = await getFromTeam(team.id);
          console.log('count', users.length);

          if (team.leaderId) {
            const leader = await getUserById(team.leaderId);
            console.log('leader', leader);

            return {
              ...team,
              leaderName: `${leader.firstName} ${leader.lastName}`,
              userCount: users.length,
            };
          }
          // Si l'équipe n'a pas de leader, retournez simplement l'équipe sans les détails du leader
          return {
            ...team,
            userCount: users.length,
          };
        })
      );
      setTeams(teamsWithLeadersAndCount);
      console.log(teams);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [loading]);

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

  const handleSearch = async (searchTerm: string): Promise<void> => {
    try {
      const response = await TeamApiManager.fetchTeams();
      const filteredTeams = response.filter((team: TeamData) =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setTeams(filteredTeams);
    } catch (error) {
      console.error('Erreur lors de la recherche des équipes:', error);
    }
  };

  function sortByProperty<T>(
    array: T[],
    property: keyof T,
    ascending: boolean = true
  ): T[] {
    return [...array].sort((a, b) => {
      let comparison = 0;
      if (a[property] < b[property]) {
        comparison = -1;
      } else if (a[property] > b[property]) {
        comparison = 1;
      }
      if (!ascending) {
        comparison = -comparison;
      }
      return comparison;
    });
  }

  useEffect(() => {
    switch (filterByTeamName) {
      case Filter.INACTIVE:
        setTeams((teams) => sortByProperty(teams, 'name', true));
        break;
      case Filter.ASC:
        setTeams((teams) => sortByProperty(teams, 'name', true));
        break;
      case Filter.DESC:
        setTeams((teams) => sortByProperty(teams, 'name', false));
        break;
      default:
    }
  }, [filterByTeamName]);

  useEffect(() => {
    switch (filterByTeamLeader) {
      case Filter.INACTIVE:
        setTeams((teams) => sortByProperty(teams, 'leaderName', true));
        break;
      case Filter.ASC:
        setTeams((teams) => sortByProperty(teams, 'leaderName', true));
        break;
      case Filter.DESC:
        setTeams((teams) => sortByProperty(teams, 'leaderName', false));
        break;
      default:
    }
  }, [filterByTeamLeader]);

  return (
    <Flex flexDirection="column" gap="16px">
      <Flex gap="16px">
        <Text as="h1">Gestion des équipes </Text>
        <Button
          bg="primary.300"
          color="white"
          width="fit-content"
          onClick={onOpenFormModal}
        >
          Ajouter une équipe
        </Button>
      </Flex>
      <Flex justifyContent="space-between">
        <Text as="h2">Liste des équipes</Text>
        <UserSearch onSearch={handleSearch} />{' '}
        {/* Composant de recherche à droite */}
      </Flex>
      <TableContainer bg="white" borderRadius={16}>
        <Table variant="simple">
          <Thead bg="secondary.100">
            <Tr>
              <Th>
                Nom d&apos; équipe
                <IconButton
                  ml="0px"
                  mt="-4px"
                  aria-label="filter"
                  icon={<TriangleDownIcon />}
                  bg="transparent"
                  onClick={() =>
                    setFilterByTeamName((prevState) => (prevState + 1) % 3)
                  }
                  _hover={{ bg: 'transparent' }}
                  color={
                    filterByTeamName === Filter.INACTIVE
                      ? 'primary.300'
                      : filterByTeamName === Filter.ASC
                        ? 'secondary.300'
                        : 'redCoexya'
                  }
                  transform={
                    filterByTeamName === Filter.INACTIVE
                      ? 'rotate(270deg)'
                      : filterByTeamName === Filter.ASC
                        ? 'rotate(180deg)'
                        : 'auto'
                  }
                  transition="transform 0.3s ease-in-out"
                />
              </Th>
              <Th>
                Chef d&apos;équipe
                <IconButton
                  ml="0px"
                  mt="-4px"
                  aria-label="filter"
                  icon={<TriangleDownIcon />}
                  bg="transparent"
                  onClick={() =>
                    setFilterByTeamLeader((prevState) => (prevState + 1) % 3)
                  }
                  _hover={{ bg: 'transparent' }}
                  color={
                    filterByTeamLeader === Filter.INACTIVE
                      ? 'primary.300'
                      : filterByTeamLeader === Filter.ASC
                        ? 'secondary.300'
                        : 'redCoexya'
                  }
                  transform={
                    filterByTeamLeader === Filter.INACTIVE
                      ? 'rotate(270deg)'
                      : filterByTeamLeader === Filter.ASC
                        ? 'rotate(180deg)'
                        : 'auto'
                  }
                  transition="transform 0.3s ease-in-out"
                />
              </Th>
              <Th>
                {' '}
                Nombre d&apos;utilsateurs
                <IconButton
                  ml="0px"
                  mt="-4px"
                  aria-label="filter"
                  icon={<TriangleDownIcon />}
                  bg="transparent"
                  onClick={() =>
                    setFilterByTeamLeader((prevState) => (prevState + 1) % 3)
                  }
                  _hover={{ bg: 'transparent' }}
                  color={
                    filterByTeamLeader === Filter.INACTIVE
                      ? 'primary.300'
                      : filterByTeamLeader === Filter.ASC
                        ? 'secondary.300'
                        : 'redCoexya'
                  }
                  transform={
                    filterByTeamLeader === Filter.INACTIVE
                      ? 'rotate(270deg)'
                      : filterByTeamLeader === Filter.ASC
                        ? 'rotate(180deg)'
                        : 'auto'
                  }
                  transition="transform 0.3s ease-in-out"
                />
              </Th>
              <Th> </Th>
            </Tr>
          </Thead>
          <Tbody>
            {teams.map((team) => (
              <Tr key={team.id}>
                <Td>
                  {team.name.charAt(0).toUpperCase() + team.name.slice(1)}
                </Td>
                <Td>
                  {team.leaderName
                    ? team.leaderName.charAt(0).toUpperCase() +
                      team.leaderName.slice(1)
                    : 'Aucun'}
                </Td>
                <Td> {team.userCount ? team.userCount : '0'}</Td>
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
