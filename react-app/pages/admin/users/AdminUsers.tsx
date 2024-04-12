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
  Select,
  FormControl,
  Input,
  Text,
  Checkbox,
  Alert,
  AlertIcon,Switch
} from '@chakra-ui/react';
import {
  fetchUsers,
  addUser,
  deleteUser,
  updateUserTeam,
  updateUserAdminStatus,
} from '../../../api/UserApiManager';

import fetchTeams from '../../../api/TeamApiManager';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    teamId: '',
    isAdmin: false,
  });
  const [selectedTeam, setSelectedTeam] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isOpenError, setIsOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleTeamSelectChange = (e) => {
    setSelectedTeam(e.target.value);
    setNewUser({ ...newUser, teamId: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userExists = users.some((user) => user.email === newUser.email);
      if (userExists) {
        throw new Error("Un utilisateur avec cette adresse e-mail existe déjà.");
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
        });
        setSelectedTeam('');
        onClose();
        const updatedUsers = await fetchUsers();
        setUsers(updatedUsers);
        setIsOpenError(false);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
      setErrorMessage(error.message);
      setIsOpenError(true);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
    }
  };

  const handleTeamChange = async (userId, teamId) => {
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
  const handleToggleAdmin = async (userId, isAdmin) => {
    try {
      // Appeler l'API pour mettre à jour le statut d'administrateur de l'utilisateur
      await updateUserAdminStatus(userId, isAdmin);
      // Mettre à jour la liste des utilisateurs après la modification
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut d'administrateur:", error);
    }
  };

  return (
    <Flex flexDirection='column' gap='16px'>
      <Button
        bg='primary.300'
        color='white'
        width='fit-content'
        onClick={onOpen}
      >
        Ajouter un utilisateur
      </Button>
      <TableContainer bg='white' borderRadius={16}>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>Prénom</Th>
              <Th>Nom</Th>
              <Th>Email</Th>
              <Th>Équipe</Th>
              <Th>Admin</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user._id}>
                <Td>{user.firstName}</Td>
                <Td>{user.lastName}</Td>
                <Td>{user.email}</Td>
                <Td>
                  <Select
                    value={user.teamId}
                    onChange={(e) => handleTeamChange(user._id, e.target.value)}
                  >
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </Select>
                </Td>
                <Td>
              <Flex align="center">
                <Switch
                  isChecked={user.isAdmin}
                  onChange={(e) => handleToggleAdmin(user._id, e.target.checked)}
                />
                <Text ml={2}>{user.isAdmin ? 'Oui' : 'Non'}</Text>
              </Flex>
            </Td>
                <Td>
                  <Button
                    colorScheme='red'
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Supprimer
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg='#F8F8F8' p='24px'>
          <ModalHeader>Ajouter un utilisateur</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Flex flexDirection='column' gap={4}>
                <FormControl isRequired>
                  <Input
                    type='text'
                    name='firstName'
                    value={newUser.firstName}
                    onChange={handleInputChange}
                    placeholder='Prénom'
                    focusBorderColor='#166879'
                    isRequired
                    bg='white'
                  />
                </FormControl>
                <FormControl isRequired>
                  <Input
                    type='text'
                    name='lastName'
                    value={newUser.lastName}
                    onChange={handleInputChange}
                    placeholder='Nom'
                    focusBorderColor='#166879'
                    isRequired
                    bg='white'
                  />
                </FormControl>
                <FormControl isRequired>
                  <Input
                    type='email'
                    name='email'
                    value={newUser.email}
                    onChange={handleInputChange}
                    placeholder='Email'
                    focusBorderColor='#166879'
                    isRequired
                    bg='white'
                  />
                </FormControl>
                <FormControl isRequired>
                  <Select
                    placeholder='Sélectionner une équipe'
                    focusBorderColor='#166879'
                    value={selectedTeam}
                    onChange={handleTeamSelectChange}
                    isRequired
                    bg='white'
                  >
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <Flex alignItems="center">
                    <Checkbox
                      name="isAdmin"
                      isChecked={newUser.isAdmin}
                      onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
                    />
                    <Text ml={2}>Administrateur</Text>
                  </Flex>
                </FormControl>
                <Button type='submit' bg='#166879' color='white'>
                  Ajouter
                </Button>
                {isOpenError && (
                  <Alert status="error">
                    <AlertIcon />
                    {errorMessage}
                  </Alert>
                )}
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default AdminUsers;
