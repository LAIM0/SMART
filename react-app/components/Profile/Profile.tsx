/* eslint-disable no-underscore-dangle */
// Profile.tsx
import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import {
  handleAuthRouting,
  logout,
  resetPassword,
} from '../../api/AuthApiManager';
import { ScoreByCatData, UserData } from '../../interfaces/userInterface';
import User from '../../interfaces/userAdminInterface';
import ChangeProfilePictureModal from './ChangeProfilPictureModal';
import UserProfileUpdateModal from './ModalUpdateuser';
import ChallengeCard from '../Challenges/ChallengeCard';
import CompletedApiManager from '../../api/CompletedApiManager';
import CompletedChallengeData from '../../interfaces/completedInterface';
import TeamData from '../../interfaces/teamInterface';
import TeamApiManager from '../../api/TeamApiManager';
import {
  getLevel,
  getScoreByCat,
  updateAllLevels,
} from '../../api/UserApiManager';
import LogoutConfirmationModal from './logoutModal';
import CategoryList from './CategoryList';
import ProgressBar from './ProgressBar';

function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [teamName, setTeamName] = useState<any>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [initialFirstName, setInitialFirstName] = useState('');
  const [initialLastName, setInitialLastName] = useState('');
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [level, setLevel] = useState<number>(0.0);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [categoriesScore, setCategoriesScore] = useState<ScoreByCatData[]>([]);

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

      console.log('Try to update all users levels...');
      await updateAllLevels();
      console.log('User levels updated successfully.');

      const fetchedTeams = await TeamApiManager.fetchTeams();
      const fetchedCatScore = await getScoreByCat(userId);
      const fetchedLevel = await getLevel(userId);
      setLevel(fetchedLevel.level);
      setCategoriesScore(fetchedCatScore);
      setTeams(fetchedTeams);
      setUser(userResponse.data);
      setTeamName(teamname.data);

      if (userResponse.data.profilePicturePath) {
        setProfilePicture(userResponse.data.profilePicturePath);
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

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    try {
      logout();

      router.push('/auth/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    } finally {
      setIsLogoutModalOpen(false);
    }
  };

  // Fonction pour fermer la modal de confirmation
  const handleCloseLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  console.log(initialFirstName, initialLastName);
  console.log('profile', profilePicture);

  const [completedChallenges, setCompletedChallenges] = useState<
    CompletedChallengeData[]
  >([]);

  useEffect(() => {
    const fetchCompletedChallenges = async () => {
      try {
        if (user) {
          const tempCompletedChallenges =
            await CompletedApiManager.getCompletedChallengesByUserId(user._id);
          setCompletedChallenges(tempCompletedChallenges);
          console.log(tempCompletedChallenges);
        }
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des challenges complétés:',
          error
        );
      }
    };

    fetchCompletedChallenges();
  }, [user]);

  return (
    <Flex flexDirection="column" p="32px" gap="16px">
      <Text
        as="h1"
        ml="8px"
        gap="10px"
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        mb="-8px"
      >
        Mon profil
      </Text>
      <Flex flexDirection={['row', 'row']} alignItems="center" gap="16px">
        <ChangeProfilePictureModal
          profilePicture={profilePicture}
          onSubmit={(file) => handleUploadProfilePicture(file)}
        />
        <Box flex="2">
          {user && (
            <Flex flexDirection="column" gap="6px">
              <Text as="h2">
                {user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)}{' '}
                {user.firstName.charAt(0).toUpperCase() +
                  user.firstName.slice(1)}
              </Text>
              <Text as="h3">
                {teamName.name.charAt(0).toUpperCase() + teamName.name.slice(1)}
              </Text>
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
      <Flex flexDirection={['column', 'row']} gap={['0', '8px']} mb="8px">
        <Button
          bg="primary.300"
          color="white"
          onClick={handleEditProfileClick}
          marginBottom={['8px', '0']}
        >
          Modifier
        </Button>
        <Button bg="#D9D9D9" color="grey.600" onClick={handleLogoutClick}>
          Se déconnecter
        </Button>
      </Flex>
      <Flex flexDirection="column">
        <Text as="h1" mb="-8px">
          Ma Progression
        </Text>
        <ProgressBar
          level={Math.floor(level)}
          percentage={Math.round((level - Math.floor(level)) * 100)}
        />
        <CategoryList listScore={categoriesScore} />
      </Flex>
      <Flex flexDirection="column" bg="#F8F8F8">
        <Text as="h1">Relevés récemment</Text>
        <Flex flexDirection="row" flexWrap="wrap" mb="24px">
          {completedChallenges.length > 0 ? (
            <Flex flexDirection="row" flexWrap="wrap" gap="16px">
              {completedChallenges.map((completedChallenge) => (
                <ChallengeCard
                  key={completedChallenge.completed.id}
                  challenge={completedChallenge.challenge}
                  onClick={() =>
                    router.push(
                      `/challenges/${completedChallenge.challenge.id}`
                    )
                  }
                  type="recentlyCompleted"
                  completionDate={completedChallenge.completed.completionDate}
                />
              ))}
            </Flex>
          ) : (
            <Text as="p">Aucun challenge relevé récemment</Text>
          )}
        </Flex>
        <LogoutConfirmationModal
          isOpen={isLogoutModalOpen}
          onClose={handleCloseLogoutModal}
          onConfirm={handleConfirmLogout}
        />
      </Flex>
    </Flex>
  );
}

export default Profile;
