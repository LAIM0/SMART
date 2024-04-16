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
import TeamData from '../../../interfaces/teamInterface';
import { useRouter } from 'next/router';
import { handleAdminRouting } from '../../../api/AuthApiManager';

interface User {
  _id: string,
  firstName: string ,
  lastName: string ,
  email: string ,
  teamId: string ,
  isAdmin: boolean;
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
  });
  const [selectedTeam, setSelectedTeam] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isOpenError, setIsOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteUserId, setDeleteUserId] = useState<string>('');
  const [isOpenErrorDeleteUser, setIsOpenErrorDeleteUser] = useState(false);
  const [errorMessageDeleteUser, setErrorMessageDeleteUser] = useState('');

  

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

  const handleDeleteConfirmation = (userId :string ) => {
    
    
    if (users.length == 1) {
      // S'il n'y a qu'un seul utilisateur, affichez une erreur
      setErrorMessageDeleteUser("Vous ne pouvez pas supprimer le dernier utilisateur.");
    setIsOpenErrorDeleteUser(true);
    }
    else {
      // S'il y a plus d'un utilisateur, permettez la suppression en définissant l'ID de l'utilisateur à supprimer
      setDeleteUserId(userId);
      onClose();
    }
  };

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleTeamSelectChange = (e:any) => {
    setSelectedTeam(e.target.value);
    setNewUser({ ...newUser, teamId: e.target.value });
  };

  const handleSubmit = async (e:any) => {
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
        const updatedUsers = await fetchUsers();
        setUsers(updatedUsers);
        setIsOpenError(false);
        onClose();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Erreur lors de l'ajout de l'utilisateur:", error.message);
        setErrorMessage(error.message);
      } else {
        console.error("Erreur lors de l'ajout de l'utilisateur:", error);
        setErrorMessage('Une erreur inconnue s\'est produite.');
      }
      setIsOpenError(true);
    }
  };

  const handleDeleteUser = async () => {
    try {
      // Supprimer l'utilisateur avec l'ID fourni
      await deleteUser(deleteUserId);
      setDeleteUserId('');
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setIsOpenErrorDeleteUser(true);
        setErrorMessageDeleteUser("Impossible de supprimer l'administrateur.");
      } else {
        setIsOpenErrorDeleteUser(true);
        setErrorMessageDeleteUser(error.message);
      }
    }
  };

  const handleTeamChange = async (userId:string, teamId:string) => {
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

  const handleToggleAdmin = async (userId: string,isAdmin:boolean) => {
    try {
      await updateUserAdminStatus(userId, isAdmin);
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut d'administrateur:", error);
    }
  };

  return (
    <Flex flexDirection='column' gap='16px'>
       <Flex gap="16px">
        <Text as="h1">Gestion des utilisateurs </Text>
        <Button
        bg='primary.300'
        color='white'
        width='fit-content'
        onClick={onOpen}
      >
        Ajouter un utilisateur
      </Button>
      </Flex>
      <Text as="h2">Liste des utilisateurs</Text>
      
      <TableContainer bg='white' borderRadius={16}>
        <Table variant='simple'>
          <Thead bg="secondary.100">
            <Tr >
              <Th>Prénom</Th>
              <Th>Nom</Th>
              <Th>Email</Th>
              <Th>Équipe</Th>
              <Th>Admin</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user._id} >
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
                    onClick={() => handleDeleteConfirmation(user._id)}
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
      <Modal isOpen={deleteUserId !== ''} onClose={() => setDeleteUserId('')}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmation de la suppression</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Êtes-vous sûr de vouloir supprimer cet utilisateur ?
            <Flex justifyContent="flex-end" mt={4}>
              <Button variant="outline" onClick={() => {setDeleteUserId(''); onClose()}}>Annuler</Button>
              <Button colorScheme="red" ml={2} onClick={() => {handleDeleteUser(); onClose()}}>Confirmer</Button>
      
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenErrorDeleteUser} onClose={() => setIsOpenErrorDeleteUser(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Erreur de suppression</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {errorMessageDeleteUser}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default AdminUsers;