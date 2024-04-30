import React, { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';

import { FormControl, Input, Flex, Button, Select } from '@chakra-ui/react';
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
  // const [icon, setIcon] = useState<string>(''); -> Assuming icon is a string representing icon name or URL

  const [teamName, setTeamName] = useState<string>(
    teamToModify ? teamToModify.name : ''
  );
  const [leader, setLeader] = useState('');
  const [usersOfTeam, setUsersOfTeam] = useState<UserDataLeaderAttribution[]>(
    []
  );

  useEffect(() => {
    if (teamToModify !== null) {
      const fetchData = async () => {
        const users = await getFromTeam(teamToModify?.id);
        setUsersOfTeam(users);
      };

      fetchData();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamToModify === null) {
      const newTeam = {
        id: ``,
        name: teamName,
        icon: ``,
      };

      const fetchData = async () => {
        try {
          await TeamApiManager.create(newTeam);
          onCloseModal();
        } catch (error) {
          console.error('Erreur lors de la création des données :', error);
        }
      };

      fetchData();
    } else {
      const newTeam = {
        id: `${teamToModify.id}`,
        name: teamName,
        icon: ``,
      };

      const fetchData = async () => {
        try {
          await TeamApiManager.modify(newTeam);
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
              value={leader}
              onChange={(e) => {
                setLeader(e.target.value);
              }}
              focusBorderColor="primary.300"
              bg="white"
            >
              {usersOfTeam.map((user) => (
                <option key={user.id + user.lastName} value={user.id}>
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
      </Flex>
    </FormControl>
  );
}

FormCreateModifyTeam.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
};

export default FormCreateModifyTeam;
