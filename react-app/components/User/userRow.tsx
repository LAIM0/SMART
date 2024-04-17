// UserRow.tsx

import React from 'react';
import { Tr, Td, Select, Switch, Button, Flex, Text } from '@chakra-ui/react';
import TeamData from '../../interfaces/teamInterface';
import User from '../../interfaces/userAdminInterface';
interface UserRowProps {
  user: User;
  teams: TeamData[];
  onDelete: (userId: string) => void;
  onTeamChange: (userId: string, teamId: string) => void;
  onToggleAdmin: (userId: string, isAdmin: boolean) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, teams, onDelete, onTeamChange, onToggleAdmin }) => {
  return (
    <Tr>
      <Td>{user.firstName}</Td>
      <Td>{user.lastName}</Td>
      <Td>{user.email}</Td>
      <Td>
        <Select
          value={user.teamId}
          onChange={(e) => onTeamChange(user._id, e.target.value)}
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
            onChange={(e) => onToggleAdmin(user._id, e.target.checked)}
          />
          <Text ml={2}>{user.isAdmin ? 'Oui' : 'Non'}</Text>
        </Flex>
      </Td>
      <Td>
        <Button
          colorScheme='red'
          onClick={() => onDelete(user._id)}
        >
          Supprimer
        </Button>
      </Td>
    </Tr>
  );
};

export default UserRow;
