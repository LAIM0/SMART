import React, { useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Icon,
  Button,
  Box,
} from '@chakra-ui/react';
import TeamData from '../../interfaces/teamInterface';

interface TeamListProps {
  teams: TeamData[];
}

function TeamAdminList({ teams }: TeamListProps) {
  const [selectedTeam, setSelectedTeam] = useState<TeamData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClickEditTeam = (team: TeamData) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveChanges = async (updatedTeam: TeamData) => {
    try {
      const savedTeam = await updateTeam(updatedTeam);
      const updatedTeams = teamsState.map((team) =>
        team._id === savedTeam._id ? savedTeam : team
      );
      setTeamsState(updatedTeams);
      closeModal();
    } catch (error) {
      console.error('Failed to update team:', error);
      // Gérer l'erreur ici, peut-être informer l'utilisateur
    }
  };

  return (
    <Box>
      <TableContainer bg="white" borderRadius={16}>
        <Table variant="simple">
          <Thead bg="secondary.100">
            <Tr>
              <Th>Icone</Th>
              <Th>Nom d'équipe</Th>
              <Th>Score</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {teams.map((team) => (
              <Tr key={team.id}>
                <Td>
                  <Icon as={team.icon} />
                </Td>{' '}
                {/* Supposant que `team.icon` est un composant d'icône */}
                <Td>{team.name}</Td>
                <Td>10</Td>
                <Td textAlign="right">
                  <Button
                    color="#718096"
                    mr={4}
                    onClick={() => onClickEditTeam(team)}
                  >
                    Modifier
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {selectedTeam && (
        <EditTeamModal
          team={selectedTeam}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveChanges}
        />
      )}
    </Box>
  );
}

export default TeamAdminList;
