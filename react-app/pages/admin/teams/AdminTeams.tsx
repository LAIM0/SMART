import React, { useEffect, useState } from 'react';
import { Flex, Button, Text } from '@chakra-ui/react';
import { fetchTeams } from '../../../api/TeamApiManager';
import TeamData from '../../../interfaces/teamInterface';
import TeamAdminList from '../../../components/Table/TeamAdminList';

function AdminTeams() {
  const [teams, setTeams] = useState<TeamData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchTeams();
        setTeams(response);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Flex flexDirection="column" gap="16px">
      <Flex gap="16px">
        <Text as="h1">Gestion des équipes </Text>
        <Button bg="primary.300" color="white" width="fit-content">
          Créer une équipe
        </Button>
      </Flex>
      <Flex justifyContent="space-between">
        <Text as="h2">Liste des équipes</Text>
      </Flex>
      <TeamAdminList teams={teams} />
    </Flex>
  );
}

export default AdminTeams;
