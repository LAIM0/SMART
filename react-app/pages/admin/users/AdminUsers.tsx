/* eslint-disable */
import React, { useState, useEffect } from "react";
import axios from "axios";
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
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
} from "@chakra-ui/react";

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  teamId: string;
}

function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [userTeams, setUserTeams] = useState<{ [userId: string]: string }>({});
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    teamId: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<UserData[]>(
          "http://localhost:3001/users"
        );
        setUsers(response.data);

        const initialUserTeams: { [userId: string]: string } = {};
        response.data.forEach((user) => {
          initialUserTeams[user._id] = user.teamId;
        });
        setUserTeams(initialUserTeams);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      }
    };

    const fetchTeams = async () => {
      const response = await axios.get("http://localhost:3001/teams");
      setTeams(response.data);
    };

    fetchUsers();
    fetchTeams();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleTeamSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeam(e.target.value);
    setNewUser({ ...newUser, teamId: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/users/signup", {
        ...newUser,
        passwordHash: "Ecoexya24",
        isAdmin: false, 
      });
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        teamId: "",
      });
      setSelectedTeam("");
      onClose(); // Fermer la modal après l'ajout
      // Rafraîchir la liste des utilisateurs
      const response = await axios.get<UserData[]>("http://localhost:3001/users");
      setUsers(response.data);
      
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const deleteUser = async (userId: string) => {
    try {
      await axios.delete(`http://localhost:3001/users/delete/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
    }
  };

  const handleTeamChange = async (userId: string, teamId: string) => {
    try {
      await axios.put(`http://localhost:3001/users/${userId}/team`, { teamId });
      setUserTeams({ ...userTeams, [userId]: teamId });
      setUsers(users.map((user) => (user._id === userId ? { ...user, team: teamId } : user)));
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'équipe de l'utilisateur:", error);
    }
  };

  return (
    <Flex flexDirection="column" gap="16px">
      <Button bg="primary.300" color="white" width="fit-content" onClick={onOpen}>
        Ajouter un utilisateur
      </Button>
      <TableContainer bg="white" borderRadius={16}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Prénom</Th>
              <Th>Nom</Th>
              <Th>Email</Th>
              <Th>Équipe</Th>
              <Th>Action</Th>
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
                    value={userTeams[user._id] || ""}
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
                  <Button
                    colorScheme="red"
                    onClick={() => deleteUser(user._id)}
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
  <ModalContent bg="#F8F8F8" p="24px">
    <ModalHeader>Ajouter un utilisateur</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <form onSubmit={handleSubmit}>
        <Flex flexDirection="column" gap={4}>
          <FormControl isRequired>
            <Input
              type="text"
              name="firstName"
              value={newUser.firstName}
              onChange={handleInputChange}
              placeholder="Prénom"
              focusBorderColor="#166879"
              isRequired
              bg="white"
            />
          </FormControl>
          <FormControl isRequired>
            <Input
              type="text"
              name="lastName"
              value={newUser.lastName}
              onChange={handleInputChange}
              placeholder="Nom"
              focusBorderColor="#166879"
              isRequired
              bg="white"
            />
          </FormControl>
          <FormControl isRequired>
            <Input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              placeholder="Email"
              focusBorderColor="#166879"
              isRequired
              bg="white"
            />
          </FormControl>
          <FormControl isRequired>
            <Select
              placeholder="Sélectionner une équipe"
              focusBorderColor="#166879"
              value={selectedTeam}
              onChange={handleTeamSelectChange}
              isRequired
              bg="white"
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" bg="#166879" color="white">
            Ajouter
          </Button>
        </Flex>
      </form>
    </ModalBody>
  </ModalContent>
</Modal>

    </Flex>
  );
}

export default AdminUsers;
