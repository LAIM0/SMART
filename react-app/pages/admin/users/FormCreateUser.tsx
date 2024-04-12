/* eslint-disable */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FormControl,
  Input,
  Flex,
  Button,
  Select,
  useDisclosure
} from "@chakra-ui/react";

interface Team {
  _id: string;
  name: string;
}

function FormCreateUser() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [teamId, setTeamId] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    teamId: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/users/signup", {
        ...newUser,
        passwordHash: "Ecoexya24",
        isAdmin: false, 
      });
      onClose(); // Fermer la modal après l'ajout
      // Rafraîchir la liste des utilisateurs
      const response = await axios.get<UserData[]>("http://localhost:3001/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
    }
  }
    setFirstName("");
    setLastName("");
    setEmail("");
    setTeamId("");
  };

  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get<Team[]>(
        "http://localhost:3001/teams/all"
      );
      setTeams(response.data);
    };

    fetchData();
  }, []);

  return (
    <FormControl>
      <Flex flexDirection="column" gap={4} borderRadius={8}>
        <Input
          placeholder="Prénom"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          focusBorderColor="#166879"
          isRequired={true}
          bg="white"
        />
        <Input
          placeholder="Nom"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          focusBorderColor="#166879"
          isRequired={true}
          bg="white"
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          focusBorderColor="#166879"
          isRequired={true}
          bg="white"
        />
        <Select
          placeholder="Équipe"
          focusBorderColor="#166879"
          onChange={(e) => setTeamId(e.target.value)}
          isRequired={true}
          bg="white"
        >
          {teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.name}
            </option>
          ))}
        </Select>
        <Button bg="#166879" color="white" onClick={handleSubmit}>
          Ajouter un utilisateur
        </Button>
      </Flex>
    </FormControl>
  );
}

export default FormCreateUser;
