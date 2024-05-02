// EditTeamNameModal.tsx

import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

interface EditTeamNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSubmit: (newName: string) => void;
  errorMessage: string;
  isOpenError: boolean;
}

function EditTeamNameModal(props: EditTeamNameModalProps) {
  const { isOpen, onClose, currentName, onSubmit, errorMessage, isOpenError } =
    props;
  const [newName, setNewName] = useState(currentName);

  const handleSubmit = () => {
    onSubmit(newName);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modifier le nom de l&apos;équipe</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nouveau nom de l'équipe"
          />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Enregistrer
          </Button>
          <Button onClick={onClose}>Annuler</Button>
          {isOpenError && (
            <Alert status="error">
              <AlertIcon />
              {errorMessage}
            </Alert>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditTeamNameModal;
