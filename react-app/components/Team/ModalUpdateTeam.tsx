import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import TeamData from '../../interfaces/teamInterface';

interface ModalUpdateTeamProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  team: TeamData;
}

function ModalUpdateTeam(props: ModalUpdateTeamProps) {
  const { isOpen, onClose, onSubmit, team } = props;
  const [teamName, setTeamName] = useState(team.name);

  const handleSubmit = () => {
    onSubmit(teamName);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent maxW="80vw">
        <ModalHeader>Mettre à jour l&apos;équipe</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Nom d&apos;équipe</FormLabel>
            <Input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
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

export default ModalUpdateTeam;
