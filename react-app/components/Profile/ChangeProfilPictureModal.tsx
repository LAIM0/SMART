import React, { useState } from 'react';
import { Box, Image, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';

interface ChangeProfilePictureModalProps {
  profilePicture: string | null;
  onSubmit: (file: File) => void;
}

const ChangeProfilePictureModal: React.FC<ChangeProfilePictureModalProps> = ({ profilePicture, onSubmit }) => {
  console.log("dans modal",profilePicture);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleConfirm = () => {
    if (selectedFile) {
      onSubmit(selectedFile);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Box onClick={handleOpenModal} cursor="pointer">
        {profilePicture ? (
          <Image src={`http://localhost:3001/users/profile-picture/${profilePicture}`} alt="Profile Picture" boxSize="150px" borderRadius="xl" />
        ) : (
          <Box boxSize="150px" bg="gray.200" borderRadius="full" />
        )}
      </Box>
      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Changer de photo de profil</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </ModalBody>
          <ModalFooter>
            <Button bg="primary.300" color="white" mr={3} onClick={handleConfirm}>
              Confirmer
            </Button>
            <Button onClick={handleCloseModal}>Annuler</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChangeProfilePictureModal;
