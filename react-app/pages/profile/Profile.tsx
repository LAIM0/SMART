import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Button, Image,Icon } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import {UserData} from '../../interfaces/userInterface';
import { handleAuthRouting } from '../../api/AuthApiManager';
import User from '../../interfaces/userAdminInterface';
import ChangeProfilePictureModal from '../../components/Profile/ChangeProfilPictureModal';
import { FaUser } from 'react-icons/fa';
import UserProfileUpdateModal from '../../components/Profile/ModalUpdateuser';






const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [teamName, setTeamName] = useState<any>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [initialFirstName, setInitialFirstName] = useState('');
  const [initialLastName, setInitialLastName] = useState('');

  const router = useRouter();
  useEffect(() => {
    handleAuthRouting(router);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get<UserData>(
          'http://localhost:3001/users/me',
          { withCredentials: true }
        );
        const userId = response.data.id;
        const userResponse = await axios.get(`http://localhost:3001/users/byId/${userId}`);
        const teamId = userResponse.data.teamId;
        const teamname = await axios.get(`http://localhost:3001/teams/byId/${teamId}`);
        setUser(userResponse.data);
        setTeamName(teamname.data);

        // Vérifiez si l'utilisateur a une photo de profil
        if (userResponse.data.profilePicturePath) {
          setProfilePicture(userResponse.data.profilePicturePath);
        } else {
          // Si l'utilisateur n'a pas de photo de profil, utilisez une image par défaut
          setProfilePicture('/profile-picture-default.png-1713451127942-613847853'); // Remplacez '/default-profile-picture.jpg' par le chemin de votre image par défaut
        }
        setInitialFirstName(userResponse.data.firstName);
        setInitialLastName(userResponse.data.lastName);
        console.log(initialFirstName, initialLastName);
      } catch (error) {
        console.error('Erreur lors de la requête:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUploadProfilePicture = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await axios.post(
        `http://localhost:3001/users/upload`,
        formData,
        { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
      );
      console.log('Upload successful:', response.data);
      setProfilePicture(response.data.profilePicturePath);
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la photo de profil:', error);
    }
  };
  const handleUpdateSubmit = async (data: { firstName: string; lastName: string }) => {
    try {
      const userId = user?._id; 
      const response = await axios.put(
        `http://localhost:3001/users/update/${userId}`, 
        {
          firstName: data.firstName,
          lastName: data.lastName,
        },
        { withCredentials: true }
      );
      console.log('Update successful:', response.data);
      
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  };
  
  const handleEditProfileClick = () => {
    
    setIsUpdateModalOpen(true);
  };


  const handlePasswordReset = () => {
    // Gérez la logique de réinitialisation du mot de passe ici
    console.log('Reset password clicked');
  };

  console.log(initialFirstName, initialLastName);
  console.log("profile",profilePicture);

  return (
    <Flex flexDirection="column" p="32px" gap="16px">
    <Flex alignItems="center" justifyContent="space-between">
      <Flex alignItems="center">
        <Text as="h1" ml="8px" gap="10px">
          Mon profil
        </Text>
        <FaUser fontSize="24px" style={{ marginTop: '-15px', marginLeft: '10px' }} />
      </Flex>
      <Button bg="primary.300" color="white" onClick={handleEditProfileClick}>
        Modifier
      </Button>
    </Flex>
    <Flex flexDirection="row" alignItems="center" gap="16px">
      <ChangeProfilePictureModal profilePicture={profilePicture} onSubmit={(file) => handleUploadProfilePicture(file)} />
      <Box flex="2">
        {user && (
          <>
            <Flex flexDirection="column" gap="6px">
              <Text as="h2">
                {user.firstName} {user.lastName}
              </Text>
              <Text as="h3">{teamName.name}</Text>
              <Text>{user.email}</Text>
              <Text color="primary.300" textDecoration="underline" cursor="pointer" onClick={handlePasswordReset}>
                Mot de passe oublié
              </Text>
            </Flex>
          </>
        )}
      </Box>
    </Flex>
    <UserProfileUpdateModal
      isOpen={isUpdateModalOpen}
      onClose={() => setIsUpdateModalOpen(false)}
      onSubmit={handleUpdateSubmit}
      initialFirstName={initialFirstName}
      initialLastName={initialLastName}
    />
  </Flex>
  );
};

export default Profile;
