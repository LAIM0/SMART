/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';

import {
  FormControl,
  Input,
  Flex,
  Button,
  Select,
  Text,
} from '@chakra-ui/react';
import TeamApiManager from '../../../api/TeamApiManager';
import TeamData from '../../../interfaces/teamInterface';
import { UserDataLeaderAttribution } from '../../../interfaces/userInterface';
import { getFromTeam } from '../../../api/UserApiManager';

interface FormCreateModifyTeamProps {
  onCloseModal: () => void;
  teamToModify: TeamData | null;
}

function FormCreateModifyTeam({
  onCloseModal,
  teamToModify,
}: FormCreateModifyTeamProps) {
  const [teamName, setTeamName] = useState<string>(
    teamToModify ? teamToModify.name : ''
  );
  const [teamHasNoUsers, setTeamHasNoUsers] = useState(false);

  const [selectedLeaderId, setSelectedLeaderId] = useState<string>('');
  const [usersOfTeam, setUsersOfTeam] = useState<UserDataLeaderAttribution[]>(
    []
  );

  useEffect(() => {
    if (teamToModify !== null) {
      const fetchData = async () => {
        try {
          const users = await getFromTeam(teamToModify?.id);
          console.log('users', users);
          if (users.length === 0) {
            setTeamHasNoUsers(true);
          } else {
            setSelectedLeaderId(teamToModify?.leaderId);
            setUsersOfTeam(users);
            setTeamHasNoUsers(false);
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des utilisateurs de l'équipe :",
            error
          );
          setUsersOfTeam([]);
          setTeamHasNoUsers(true);
        }
      };

      fetchData();
    }
  }, [teamToModify]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (teamToModify === null) {
      const fetchData = async () => {
        try {
          const newTeam = {
            id: ``,
            name: teamName,
            picturePath: ``, // Modifiez cette valeur si nécessaire
            leaderId: ``, // Utilisez selectedLeaderId ici
          };
          await TeamApiManager.create(newTeam);
          onCloseModal();
        } catch (error) {
          console.error('Erreur lors de la création des données :', error);
        }
      };

      fetchData();
    } else {
      console.log(selectedLeaderId);
      const updatedTeam = {
        id: `${teamToModify.id}`,
        name: teamName,
        picturePath: teamToModify.picturePath, // Modifiez cette valeur si nécessaire
        leaderId: selectedLeaderId, // Utilisez selectedLeaderId ici
      };

      const fetchData = async () => {
        try {
          await TeamApiManager.modify(updatedTeam);
          onCloseModal();
        } catch (error) {
          console.error('Erreur lors de la modification des données :', error);
        }
      };

      fetchData();
    }
  };

  return (
    <FormControl>
      <Flex flexDirection="column" gap={4} borderRadius={8}>
        <FormControl isRequired>
          <Input
            placeholder="Nom de l'équipe"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            focusBorderColor="#166879"
            isRequired
            bg="white"
          />
        </FormControl>
        {teamToModify !== null && (
          <FormControl>
            <Select
              placeholder="Chef d'équipe"
              value={selectedLeaderId}
              onChange={(e) => setSelectedLeaderId(e.target.value)}
              focusBorderColor="primary.300"
              bg="white"
            >
              {usersOfTeam.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </Select>
          </FormControl>
        )}
        {teamToModify === null && (
          <Button bg="#166879" color="white" onClick={handleSubmit}>
            Créer une équipe
          </Button>
        )}
        {teamToModify !== null && (
          <Button bg="#166879" color="white" onClick={handleSubmit}>
            Enregistrer les modifications
          </Button>
        )}
        {teamToModify !== null && teamHasNoUsers && (
          <Text color="red">
            Il n&apos;y a aucun utilisateur dans cette équipe.
          </Text>
        )}
      </Flex>
    </FormControl>
  );
}

FormCreateModifyTeam.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
};

export default FormCreateModifyTeam;
