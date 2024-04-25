import React from 'react';
import {
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  Input,
  Select,
  Checkbox,
  Text,
  Button,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  newUser: {
    firstName: string;
    lastName: string;
    email: string;
    teamId: string;
    isAdmin: boolean;
  };
  selectedTeam: string;
  teams: { id: string; name: string }[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTeamSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isOpenError: boolean;
  errorMessage: string;
}

function AddUserModal(props: AddUserModalProps) {
  const {
    isOpen,
    onClose,
    newUser,
    selectedTeam,
    teams,
    handleInputChange,
    handleTeamSelectChange,
    handleSubmit,
    isOpenError,
    errorMessage,
  } = props;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="#F8F8F8" p="24px">
        <ModalHeader>Ajouter un utilisateur</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <Flex flexDirection="column" gap={4}>
              <FormControl isRequired>
                <Input
                  type="text"
                  name="firstName"
                  value={newUser.firstName}
                  onChange={handleInputChange}
                  placeholder="Prénom"
                  focusBorderColor="#166879"
                  isRequired
                  bg="white"
                />
              </FormControl>
              <FormControl isRequired>
                <Input
                  type="text"
                  name="lastName"
                  value={newUser.lastName}
                  onChange={handleInputChange}
                  placeholder="Nom"
                  focusBorderColor="#166879"
                  isRequired
                  bg="white"
                />
              </FormControl>
              <FormControl isRequired>
                <Input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  focusBorderColor="#166879"
                  isRequired
                  bg="white"
                />
              </FormControl>
              <FormControl isRequired>
                <Select
                  placeholder="Sélectionner une équipe"
                  focusBorderColor="#166879"
                  value={selectedTeam}
                  onChange={handleTeamSelectChange}
                  isRequired
                  bg="white"
                >
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <Flex alignItems="center">
                  <Checkbox
                    name="isAdmin"
                    isChecked={newUser.isAdmin}
                    onChange={(e) =>
                      handleInputChange(
                        e as React.ChangeEvent<HTMLInputElement>
                      )
                    }
                  />
                  <Text ml={2}>Administrateur</Text>
                </Flex>
              </FormControl>
              <Button type="submit" bg="#166879" color="white">
                Ajouter
              </Button>
              {isOpenError && (
                <Alert status="error">
                  <AlertIcon />
                  {errorMessage}
                </Alert>
              )}
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default AddUserModal;
