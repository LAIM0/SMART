/* eslint-disable no-underscore-dangle */
// Profile.tsx
import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { handleAuthRouting } from '../../api/AuthApiManager';
import TeamApiManager from '../../api/TeamApiManager';
import { UserData } from '../../interfaces/userInterface';
import ChangeTeamPictureModal from './ChangeTeamPictureModal';

import ModalUpdateTeam from './ModalUpdateTeam';

import TeamData from '../../interfaces/teamInterface';

function Team() {
  const [teamId, setTeamId] = useState<any>(null);
  const [teamPicture, setProfilePicture] = useState<string | null>(null);
  const [isUpdateTeamModalOpen, setIsUpdateTeamModalOpen] = useState(false);
  const [team, setTeam] = useState<TeamData>();
  const [isTeamLeader, setisTeamLeader] = useState(false);
  const router = useRouter();
  useEffect(() => {
    handleAuthRouting(router);
  }, []);

  const fetchTeam = async () => {
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

      setTeam(teamResponse.data);
      setTeamId(teamId);
      setisTeamLeader(userId === teamResponse.data.leaderId);

      if (teamResponse.data.picturePath) {
        setProfilePicture(teamResponse.data.picturePath);
      }
    } catch (error) {
      /* empty */
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleUploadTeamPicture = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('teamId', teamId);

      const response = await axios.post(
        `http://localhost:3001/teams/upload/${teamId}`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      console.log('Upload successful:', response.data);
      setProfilePicture(response.data.profilePicturePath);
      fetchTeam();
    } catch (error) {
      console.error("Erreur lors de l'upload de la photo d'équipe :", error);
    }
  };

  const handleUpdateTeamSubmit = async (name: string) => {
    try {
      const updatedTeam = {
        id: teamId,
        name,
        leaderId: team ? `${team.leaderId}` : ``,
        picturePath: team ? team.picturePath : '',
      };
      await TeamApiManager.modify(updatedTeam);
      fetchTeam();
    } catch (error) {
      console.error("Erreur lors de la modification de l'équipe :", error);
    }
  };

  const handleEditTeam = () => {
    setIsUpdateTeamModalOpen(true);
  };

  return (
    <Flex flexDirection="column" p="32px" gap="16px">
      <Flex alignItems="center" justifyContent="space-between" gap="16px">
        <Flex alignItems="center" flex="1" maxWidth="200px">
          <Text
            as="h1"
            ml="8px"
            gap="10px"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            Mon équipe
          </Text>
        </Flex>
        {isTeamLeader && (
          <Flex flexDirection={['column', 'row']} gap={['0', '4px']}>
            <Button
              bg="primary.300"
              color="white"
              onClick={handleEditTeam}
              marginBottom={['8px', '0']}
            >
              Modifier
            </Button>
          </Flex>
        )}
      </Flex>
      <Flex flexDirection={['row', 'row']} alignItems="center" gap="16px">
        <ChangeTeamPictureModal
          teamPicture={teamPicture}
          isTeamLeader={isTeamLeader}
          onSubmit={(file) => handleUploadTeamPicture(file)}
        />
        <Box flex="2">
          {team && (
            <Flex flexDirection="column" gap="6px">
              <Text as="h2">{team.name}</Text>
            </Flex>
          )}
        </Box>
      </Flex>
      {team && (
        <ModalUpdateTeam
          isOpen={isUpdateTeamModalOpen}
          onClose={() => setIsUpdateTeamModalOpen(false)}
          onSubmit={handleUpdateTeamSubmit}
          team={team}
        />
      )}
    </Flex>
  );
}

export default Team;
