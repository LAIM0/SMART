import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function LogoutConfirmationModal(props: LogoutConfirmationModalProps) {
  const { isOpen, onClose, onConfirm } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirmation</ModalHeader>
        <ModalBody>Êtes-vous sûr de vouloir vous déconnecter ?</ModalBody>
        <ModalFooter>
          <Button bg="primary.300" color="white" mr={3} onClick={onConfirm}>
            Oui
          </Button>
          <Button onClick={onClose}>Non</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default LogoutConfirmationModal;
