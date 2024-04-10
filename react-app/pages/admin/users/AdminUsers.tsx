/*eslint-disable*/
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
      console.log("teamID",teamId)
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
                  value={userTeams[user._id] || ""} // ou user.team.id en fonction de la structure de vos données
                  onChange={(e) => handleTeamChange(user._id, e.target.value)}
                >
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}> {/* ou team.id */}
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
        <ModalContent>
          <ModalHeader>Ajouter un utilisateur</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{/* Insérez ici votre formulaire pour ajouter un utilisateur */}</ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default AdminUsers;
