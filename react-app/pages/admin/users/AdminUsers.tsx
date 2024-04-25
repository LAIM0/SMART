import React, { useState, useEffect } from 'react';
import {
  Flex,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
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
import { AxiosError } from 'axios';
import { TriangleDownIcon } from '@chakra-ui/icons';
import {
  fetchUsers,
  addUser,
  deleteUser,
  updateUserTeam,
  updateUserAdminStatus,
} from '../../../api/UserApiManager';

import { fetchTeams } from '../../../api/TeamApiManager';
import TeamData from '../../../interfaces/teamInterface';
import { Filter } from '../../../utils/constants';
import User from '../../../interfaces/userAdminInterface';
import UserSearch from '../../../components/User/searchbar';
import UserRow from '../../../components/User/userRow';
import AddUserModal from '../../../components/User/addUserModal';
import { initializePassword } from '../../../api/AuthApiManager';

function isAxiosError(error: any): error is AxiosError {
  return error.isAxiosError !== undefined;
}

// eslint-disable-next-line react-hooks/exhaustive-deps
function AdminUsers() {
  // const router = useRouter();
  // useEffect(() => {
  //   handleAdminRouting(router);
  // }, []);

  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    teamId: '',
    isAdmin: false,
    passwordInitialized: false,
    firstLogin: false,
  });
  const [selectedTeam, setSelectedTeam] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isOpenError, setIsOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteUserId, setDeleteUserId] = useState<string>('');
  const [isOpenErrorDeleteUser, setIsOpenErrorDeleteUser] = useState(false);
  const [errorMessageDeleteUser, setErrorMessageDeleteUser] = useState('');
  const [filterByFirstName, setFilterByFirstName] = useState<Filter>(
    Filter.INACTIVE
  );
  const [filterByLastName, setFilterByLastName] = useState<Filter>(
    Filter.INACTIVE
  );
  const [filterByEmail, setFilterByEmail] = useState<Filter>(Filter.INACTIVE);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUsers();
        setUsers(userData);
        const response = await fetchTeams();
        setTeams(response);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteConfirmation = (userId: string) => {
    console.log(users.length, userId);
    if (users.length === 1) {
      // S'il n'y a qu'un seul utilisateur, affichez une erreur
      setErrorMessageDeleteUser(
        'Vous ne pouvez pas supprimer le dernier utilisateur.'
      );
      setIsOpenErrorDeleteUser(true);
    } else {
      // S'il y a plus d'un utilisateur, permettez la suppression en définissant l'ID de l'utilisateur à supprimer
      setDeleteUserId(userId);
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setNewUser({ ...newUser, [name]: checked });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  

  const handleTeamSelectChange = (e: any) => {
    setSelectedTeam(e.target.value);
    setNewUser({ ...newUser, teamId: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const userExists = users.some((user) => user.email === newUser.email);

      if (userExists) {
        throw new Error(
          'Un utilisateur avec cette adresse e-mail existe déjà.'
        );
      } else {
        await addUser({
          ...newUser,
          isAdmin: newUser.isAdmin || false,
        });
        setNewUser({
          firstName: '',
          lastName: '',
          email: '',
          teamId: '',
          isAdmin: false,
          passwordInitialized: false,
          firstLogin: false,
        });
        setSelectedTeam('');
        const updatedUsers = await fetchUsers();
        setUsers(updatedUsers);
        setIsOpenError(false);
        onClose();
        await initializePassword(newUser.email);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          "Erreur lors de l'ajout de l'utilisateur:",
          error.message
        );
        setErrorMessage(error.message);
      } else {
        console.error("Erreur lors de l'ajout de l'utilisateur:", error);
        setErrorMessage("Une erreur inconnue s'est produite.");
      }
      setIsOpenError(true);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(deleteUserId);
      setDeleteUserId('');
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.response &&
        error.response.status === 500
      ) {
        setIsOpenErrorDeleteUser(true);
        setErrorMessageDeleteUser("Impossible de supprimer l'administrateur.");
      } else if (isAxiosError(error)) {
        setIsOpenErrorDeleteUser(true);
        setErrorMessageDeleteUser(error.message);
      }
    }
  };

  const handleTeamChange = async (userId: string, teamId: string) => {
    try {
      await updateUserTeam(userId, teamId);
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de l'équipe de l'utilisateur:",
        error
      );
    }
  };

  const handleToggleAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      await updateUserAdminStatus(userId, isAdmin);
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.response &&
        error.response.status === 500
      ) {
        setIsOpenErrorDeleteUser(true);
        setErrorMessageDeleteUser(
          "Impossible de changer les droits de l'administrateur."
        );
      } else if (isAxiosError(error)) {
        setIsOpenErrorDeleteUser(true);
        setErrorMessageDeleteUser(error.message);
      }
    }
  };

  const handleSearch = async (searchTerm: string): Promise<void> => {
    try {
      const response = await fetchUsers();
      const filteredUsers = response.filter(
        (user: User) =>
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Erreur lors de la recherche des utilisateurs:', error);
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
    switch (filterByFirstName) {
      case Filter.INACTIVE:
        setUsers((users) => sortByProperty(users, 'firstName', true));
        break;
      case Filter.ASC:
        setUsers((users) => sortByProperty(users, 'firstName', true));
        break;
      case Filter.DESC:
        setUsers((users) => sortByProperty(users, 'firstName', false));
        break;
      default:
    }
  }, [filterByFirstName]);

  useEffect(() => {
    switch (filterByLastName) {
      case Filter.INACTIVE:
        setUsers((users) => sortByProperty(users, 'lastName', true));
        break;
      case Filter.ASC:
        setUsers((users) => sortByProperty(users, 'lastName', true));
        break;
      case Filter.DESC:
        setUsers((users) => sortByProperty(users, 'lastName', false));
        break;
      default:
    }
  }, [filterByLastName]);

  useEffect(() => {
    switch (filterByEmail) {
      case Filter.INACTIVE:
        setUsers((users) => sortByProperty(users, 'email', true));
        break;
      case Filter.ASC:
        setUsers((users) => sortByProperty(users, 'email', true));
        break;
      case Filter.DESC:
        setUsers((users) => sortByProperty(users, 'email', false));
        break;
      default:
    }
  }, [filterByEmail]);

  return (
    <Flex flexDirection="column" gap="16px">
      <Flex gap="16px">
        <Text as="h1">Gestion des utilisateurs </Text>
        <Button
          bg="primary.300"
          color="white"
          width="fit-content"
          onClick={onOpen}
        >
          Ajouter un utilisateur
        </Button>
      </Flex>
      <Flex justifyContent="space-between">
        <Text as="h2">Liste des utilisateurs</Text>
        <UserSearch onSearch={handleSearch} />{' '}
        {/* Composant de recherche à droite */}
      </Flex>
      <TableContainer bg="white" borderRadius={16}>
        <Table variant="simple">
          <Thead bg="secondary.100">
            <Tr>
              <Th>
                Prénom
                <IconButton
                  ml="0px"
                  mt="-4px"
                  aria-label="filter"
                  icon={<TriangleDownIcon />}
                  bg="transparent"
                  onClick={() =>
                    setFilterByFirstName((prevState) => (prevState + 1) % 3)
                  }
                  _hover={{ bg: 'transparent' }}
                  color={
                    filterByFirstName === Filter.INACTIVE
                      ? 'primary.300'
                      : filterByFirstName === Filter.ASC
                        ? 'secondary.300'
                        : 'redCoexya'
                  }
                  transform={
                    filterByFirstName === Filter.INACTIVE
                      ? 'rotate(270deg)'
                      : filterByFirstName === Filter.ASC
                        ? 'rotate(180deg)'
                        : 'auto'
                  }
                  transition="transform 0.3s ease-in-out"
                />
              </Th>
              <Th>
                Nom
                <IconButton
                  ml="0px"
                  mt="-4px"
                  aria-label="filter"
                  icon={<TriangleDownIcon />}
                  bg="transparent"
                  onClick={() =>
                    setFilterByLastName((prevState) => (prevState + 1) % 3)
                  }
                  _hover={{ bg: 'transparent' }}
                  color={
                    filterByLastName === Filter.INACTIVE
                      ? 'primary.300'
                      : filterByLastName === Filter.ASC
                        ? 'secondary.300'
                        : 'redCoexya'
                  }
                  transform={
                    filterByLastName === Filter.INACTIVE
                      ? 'rotate(270deg)'
                      : filterByLastName === Filter.ASC
                        ? 'rotate(180deg)'
                        : 'auto'
                  }
                  transition="transform 0.3s ease-in-out"
                />
              </Th>
              <Th>
                Email
                <IconButton
                  ml="0px"
                  mt="-4px"
                  aria-label="filter"
                  icon={<TriangleDownIcon />}
                  bg="transparent"
                  onClick={() =>
                    setFilterByEmail((prevState) => (prevState + 1) % 3)
                  }
                  _hover={{ bg: 'transparent' }}
                  color={
                    filterByEmail === Filter.INACTIVE
                      ? 'primary.300'
                      : filterByEmail === Filter.ASC
                        ? 'secondary.300'
                        : 'redCoexya'
                  }
                  transform={
                    filterByEmail === Filter.INACTIVE
                      ? 'rotate(270deg)'
                      : filterByEmail === Filter.ASC
                        ? 'rotate(180deg)'
                        : 'auto'
                  }
                  transition="transform 0.3s ease-in-out"
                />
              </Th>
              <Th>Équipe</Th>
              <Th>Admin</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <UserRow
                key={user._id}
                user={user}
                teams={teams}
                onDelete={() => {
                  setDeleteUserId(user._id);
                  setDeleteUserId(user._id);
                }}
                onTeamChange={handleTeamChange}
                onToggleAdmin={handleToggleAdmin}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <AddUserModal
        isOpen={isOpen}
        onClose={onClose}
        newUser={newUser}
        selectedTeam={selectedTeam}
        teams={teams}
        handleInputChange={handleInputChange}
        handleTeamSelectChange={handleTeamSelectChange}
        handleSubmit={handleSubmit}
        isOpenError={isOpenError}
        errorMessage={errorMessage}
      />
      <Modal isOpen={deleteUserId !== ''} onClose={() => setDeleteUserId('')}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmation de la suppression</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Êtes-vous sûr de vouloir supprimer cet utilisateur ?
            <Flex justifyContent="flex-end" mt={4}>
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteUserId('');
                  onClose();
                }}
              >
                Annuler
              </Button>
              <Button
                colorScheme="red"
                ml={2}
                onClick={() => {
                  handleDeleteUser();
                  onClose();
                }}
              >
                Confirmer
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isOpenErrorDeleteUser}
        onClose={() => setIsOpenErrorDeleteUser(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Erreur de suppression</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{errorMessageDeleteUser}</ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default AdminUsers;
