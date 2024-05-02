/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import ChangeTeamPictureModal from './ChangePictureTeamModal';
import TeamData from '../../interfaces/teamInterface';
import { UserData } from '../../interfaces/userInterface';
import { handleAuthRouting } from '../../api/AuthApiManager';
import User from '../../interfaces/userAdminInterface';

function TeamLeader() {
  const router = useRouter();
  useEffect(() => {
    handleAuthRouting(router);
  }, []);
  const [team, setTeam] = useState<TeamData | null>(null); // Correction du nom de la variable
  const [picture, setPicture] = useState<string | null>(null); // Correction du nom de la variable
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await axios.get<UserData>(
          'http://localhost:3001/users/me',
          { withCredentials: true }
        );

        const userId = response.data.id;
        const userResponse = await axios.get(
          `http://localhost:3001/users/byId/${userId}`
        );

        const { teamId } = userResponse.data;
        const teamResponse = await axios.get(
          `http://localhost:3001/teams/byId/${teamId}`
        );

        console.log('id', teamResponse.data);

        setPicture(teamResponse.data.picturePath);

        setTeam(teamResponse.data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchTeamData();
  }, []); // empty dependency array means this effect runs only once after the component mounts

  useEffect(() => {
    console.log('Team updated:', team);
  }, [team]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (team) {
          console.log('Fetching users', team._id);
          // Vérifiez si team est défini
          const response = await axios.get(
            `http://localhost:3001/teams/${team?._id}/users`
          );
          setUsers(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch team users:', error);
      }
    };

    fetchUsers();
  }, [team]);

  useEffect(() => {
    console.log('users updated:', users);
  }, [users]);

  const handleUploadTeamPicture = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `http://localhost:3001/teams/upload/${team?._id}`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      console.log('Upload successful:', response.data);

      // Mettre à jour l'état de l'image après l'upload réussi
      setPicture(response.data.picturePath);
    } catch (error) {
      console.error('Failed to upload team picture:', error);
      // Gérer les erreurs de manière appropriée
    }
  };

  return (
    <Flex flexDirection="column" p="32px" gap="16px">
      <Flex alignItems="center" justifyContent="space-between" gap="16px">
        <Flex alignItems="center" gap="10px">
          <Text as="h1" ml="8px">
            Mon équipe
          </Text>
        </Flex>
        <Flex flexDirection={['column', 'row']} gap={['0', '4px']}>
          <Button bg="primary.300" color="white">
            Modifier
          </Button>
          {/* Autres boutons d'action si nécessaire */}
        </Flex>
      </Flex>
      <Flex flexDirection={['row', 'row']} alignItems="center" gap="16px">
        {picture && (
          <ChangeTeamPictureModal
            picture={picture}
            onSubmit={(file) => handleUploadTeamPicture(file)}
          />
        )}
        <Box flex="2">
          {team && (
            <Flex flexDirection="column" gap="6px">
              <Text as="h2">{team.name}</Text>
              {/* Autres détails de l'équipe si nécessaire */}
            </Flex>
          )}
        </Box>
      </Flex>
      <Box>
        <Text as="h3">Membres de l&apos;équipe</Text>
        {/* Tableau pour afficher la liste des utilisateurs de l'équipe */}
        <TableContainer bg="white" borderRadius={16}>
          <Table variant="simple">
            <Thead bg="secondary.100">
              <Tr>
                <Th>Nom</Th>
                <Th>Prénom</Th>
                <Th>Score</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user._id}>
                  <Td>{user.lastName}</Td>
                  <Td>{user.firstName}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Flex>
  );
}

export default TeamLeader;