// Profile.tsx
import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FaUser } from 'react-icons/fa';
import { UserData } from '../../interfaces/userInterface';
import { handleAuthRouting, resetPassword } from '../../api/AuthApiManager';
import User from '../../interfaces/userAdminInterface';
import ChangeProfilePictureModal from '../../components/Profile/ChangeProfilPictureModal';
import UserProfileUpdateModal from '../../components/Profile/ModalUpdateuser';
import TeamData from '../../interfaces/teamInterface';
import { fetchTeams } from '../../api/TeamApiManager';

function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [teamName, setTeamName] = useState<any>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [initialFirstName, setInitialFirstName] = useState('');
  const [initialLastName, setInitialLastName] = useState('');
  const [teams, setTeams] = useState<TeamData[]>([]);
  const toast = useToast();
  const router = useRouter();
  useEffect(() => {
    handleAuthRouting(router);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get<UserData>(
        'http://localhost:3001/users/me',
        { withCredentials: true }
      );
      const userId = response.data.id;
      const userResponse = await axios.get(
        `http://localhost:3001/users/byId/${userId}`
      );
      const { teamId } = userResponse.data;
      const teamname = await axios.get(
        `http://localhost:3001/teams/byId/${teamId}`
      );
      const fetchedTeams = await fetchTeams();
      setTeams(fetchedTeams);
      setUser(userResponse.data);
      setTeamName(teamname.data);

      if (userResponse.data.profilePicturePath) {
        setProfilePicture(userResponse.data.profilePicturePath);
      } else {
        setProfilePicture(
          '/profile-picture-default.png-1713451127942-613847853'
        );
      }
      setInitialFirstName(userResponse.data.firstName);
      setInitialLastName(userResponse.data.lastName);
    } catch (error) {
      /* empty */
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []); // Effect se déclenche une seule fois au chargement initial

  const handleUploadProfilePicture = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `http://localhost:3001/users/upload`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      console.log('Upload successful:', response.data);
      setProfilePicture(response.data.profilePicturePath);
    } catch (error) {
      /* empty */
    }
  };

  const handleUpdateSubmit = async (data: {
    firstName: string;
    lastName: string;
    teamId: string;
  }) => {
    try {
      // eslint-disable-next-line no-underscore-dangle
      const userId = user?._id;
      const response = await axios.put(
        `http://localhost:3001/users/update/${userId}`,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          teamId: data.teamId,
        },
        { withCredentials: true }
      );
      console.log('Update successful:', response.data);
      fetchUserProfile();
    } catch (error) {
      /* empty */
    }
  };

  const handleEditProfileClick = () => {
    setIsUpdateModalOpen(true);
  };

  const handlePasswordReset = () => {
    try {
      if (user) {
        const { email } = user;
        resetPassword(email);
        toast({
          title: 'Demande envoyée',
          description:
            'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        localStorage.setItem(
          'resetSuccessMessage',
          'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.'
        );
      }
    } catch (error) {
      /* empty */
    }
  };

  return (
    <Flex flexDirection="column" p="32px" gap="16px">
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Text as="h1" ml="8px" gap="10px">
            Mon profil
          </Text>
          <FaUser
            fontSize="24px"
            style={{ marginTop: '-15px', marginLeft: '10px' }}
          />
        </Flex>
        <Button bg="primary.300" color="white" onClick={handleEditProfileClick}>
          Modifier
        </Button>
      </Flex>
      <Flex flexDirection="row" alignItems="center" gap="16px">
        <ChangeProfilePictureModal
          profilePicture={profilePicture}
          onSubmit={(file) => handleUploadProfilePicture(file)}
        />
        <Box flex="2">
          {user && (
            <Flex flexDirection="column" gap="6px">
              <Text as="h2">
                {user.firstName} {user.lastName}
              </Text>
              <Text as="h3">{teamName.name}</Text>
              <Text>{user.email}</Text>
              <Text
                color="primary.300"
                textDecoration="underline"
                cursor="pointer"
                onClick={handlePasswordReset}
              >
                Mot de passe oublié
              </Text>
            </Flex>
          )}
        </Box>
      </Flex>
      {user && (
        <UserProfileUpdateModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          onSubmit={handleUpdateSubmit}
          initialFirstName={initialFirstName}
          initialLastName={initialLastName}
          user={user}
          teams={teams}
        />
      )}
    </Flex>
  );
}

export default Profile;
