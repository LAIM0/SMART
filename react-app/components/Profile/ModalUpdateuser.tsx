// UserProfileUpdateModal.tsx
import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input } from '@chakra-ui/react';

interface UserProfileUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { firstName: string; lastName: string }) => void;
  initialFirstName: string;
  initialLastName: string;
}

const UserProfileUpdateModal: React.FC<UserProfileUpdateModalProps> = ({ isOpen, onClose, onSubmit, initialFirstName, initialLastName }) => {
  const [firstName, setFirstName] = React.useState(initialFirstName);
  console.log("UserProfileUpdateModal", firstName);
  const [lastName, setLastName] = React.useState(initialLastName);

  useEffect(() => {
    setFirstName(initialFirstName);
    setLastName(initialLastName);
  }, [isOpen, initialFirstName, initialLastName]);
  

  const handleSubmit = () => {
    onSubmit({ firstName, lastName });
    
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Mettre à jour le profil</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Prénom</FormLabel>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Nom de famille</FormLabel>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button bg='primary.300' color="white" mr={3} onClick={handleSubmit}>
            Enregistrer
          </Button>
          <Button onClick={onClose}>Annuler</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserProfileUpdateModal;
