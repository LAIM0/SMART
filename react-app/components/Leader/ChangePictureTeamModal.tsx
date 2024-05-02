import React, { useState } from 'react';
import {
  Box,
  Image,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

interface ChangeTeamPictureModalProps {
  picture: string | null;
  onSubmit: (file: File) => void;
}

function ChangeTeamPictureModal(props: ChangeTeamPictureModalProps) {
  const { picture, onSubmit } = props;
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
    console.log(file);
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

  console.log("picture dan smodal",picture);

  return (
    <>
      <Box onClick={handleOpenModal} cursor="pointer">
        {picture ? (
          <Image
            src={`http://localhost:3001/teams/picture/${picture}`}
            objectFit="cover"
            alt="Team Picture"
            boxSize="150px"
            borderRadius="xl"
          />
        ) : (
          <Box boxSize="150px" bg="gray.200" borderRadius="full" />
        )}
      </Box>
      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Changer de photo d&apos;équipe</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </ModalBody>
          <ModalFooter>
            <Button
              bg="primary.300"
              color="white"
              mr={3}
              onClick={handleConfirm}
            >
              Confirmer
            </Button>
            <Button onClick={handleCloseModal}>Annuler</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ChangeTeamPictureModal;
