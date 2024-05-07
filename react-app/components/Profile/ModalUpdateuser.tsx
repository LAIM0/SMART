import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import TeamData from '../../interfaces/teamInterface';
import User from '../../interfaces/userAdminInterface';

interface UserProfileUpdateModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    teamId: string;
  }) => void;
  initialFirstName: string;
  initialLastName: string;
  teams: TeamData[];
}

function UserProfileUpdateModal(props: UserProfileUpdateModalProps) {
  const {
    isOpen,
    onClose,
    onSubmit,
    initialFirstName,
    initialLastName,
    user,
    teams,
  } = props;

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [selectedTeam, setSelectedTeam] = useState(user.teamId || '');

  useEffect(() => {
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setSelectedTeam(user.teamId);
  }, [isOpen, initialFirstName, initialLastName, user.teamId]);

  const handleSubmit = () => {
    onSubmit({ firstName, lastName, teamId: selectedTeam });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent maxW="80vw">
        <ModalHeader>Mettre à jour le profil</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Prénom</FormLabel>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Nom de famille</FormLabel>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Équipe</FormLabel>
            <Select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button bg="primary.300" color="white" mr={3} onClick={handleSubmit}>
            Enregistrer
          </Button>
          <Button onClick={onClose}>Annuler</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default UserProfileUpdateModal;
