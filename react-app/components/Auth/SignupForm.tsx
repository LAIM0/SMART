/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect, useContext } from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  CircularProgress,
  InputRightElement,
  InputGroup,
  Select,
  Image,
  IconButton,
} from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ViewIcon } from '@chakra-ui/icons';
import { LogoContext } from '../Layout/LayouAuth';
import { sendValitaionEmail } from '../../api/AuthApiManager';

export default function SignupForm() {
  const [email, setUsername] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [passwordHash, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordVisibility = () => setShowPassword(!showPassword);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('http://localhost:3001/teams');
      setTeams(response.data);
      if (response.data.length === 0) {
        const defaultTeam = await axios.post(
          'http://localhost:3001/teams/default',
          {
            name: 'Equipe par défaut',
          }
        );
        // Mettre à jour la liste des équipes après l'ajout de l'équipe par défaut
        setTeams([defaultTeam.data]);
      }
    };

    fetchData();
  }, []);

  const handleLoginClick = () => {
    window.location.href = '/auth/login';
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent form from submitting and refreshing the page
    setIsLoading(true);

    try {
      if (passwordHash !== confirmPassword) {
        throw new Error("Passwords don't match");
      }
      console.log('selectedData', selectedTeam);
      const response = await fetch('http://localhost:3001/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          passwordHash,
          lastName,
          firstName,
          isAdmin: false,
          teamId: selectedTeam,
          passwordInitialized: true,
          firstLogin: true,
        }),
      });

      console.log(response);

      setIsLoading(false);
      if (!response.ok) throw new Error('Sign up failed');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const data = await response.json();

      // Maintenant, l'utilisateur est créé avec succès, nous pouvons envoyer l'e-mail de validation
      await sendValitaionEmail(email);

      router.push('/auth/login');
    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <Flex width="full" align="center" justifyContent="center" minHeight="100vh">
      <Box
        p={8}
        maxWidth="500px"
        borderWidth={0}
        borderRadius={8}
        boxShadow="lg"
      >
        <Box
          textAlign="center"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Image
            src={`http://localhost:3001/users/profile-picture/${useContext(LogoContext)}`}
            w="160px"
            alt="logo"
            m={4}
          />
        </Box>
        <Box my={4} textAlign="left">
          <form onSubmit={handleSignup}>
            <FormControl isRequired>
              <FormLabel>Prénom</FormLabel>
              <Input
                type="firstName"
                placeholder="Berthille"
                size="lg"
                onChange={(event) => setFirstName(event.currentTarget.value)}
              />
            </FormControl>
            <FormControl isRequired mt={6}>
              <FormLabel>Nom</FormLabel>
              <Input
                type="lastName"
                placeholder="SELLIER"
                size="lg"
                onChange={(event) => setLastName(event.currentTarget.value)}
              />
            </FormControl>
            <FormControl isRequired mt={6}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="berthille.sellier@coexya.eu"
                size="lg"
                onChange={(event) => setUsername(event.currentTarget.value)}
              />
            </FormControl>
            <FormControl isRequired mt={6}>
              <FormLabel>Mot de passe</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="*******"
                  size="lg"
                  onChange={(event) => setPassword(event.currentTarget.value)}
                />
                <InputRightElement
                  width="4.5rem"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <IconButton
                    h="1.5rem"
                    size="sm"
                    onClick={handlePasswordVisibility}
                    icon={<ViewIcon />}
                    aria-label="show password"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl isRequired mt={6}>
              <FormLabel>Confirmation du mot de passe </FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="*******"
                  size="lg"
                  onChange={(event) =>
                    setConfirmPassword(event.currentTarget.value)
                  }
                />
                <InputRightElement
                  width="4.5rem"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <IconButton
                    h="1.5rem"
                    size="sm"
                    onClick={handlePasswordVisibility}
                    icon={<ViewIcon />}
                    aria-label="show password"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl isRequired mt={6}>
              <FormLabel>Chosir mon équipe</FormLabel>
              <Select
                placeholder="Mon équipe"
                value={selectedTeam}
                onChange={(event) => setSelectedTeam(event.target.value)}
                size="lg"
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <Button
              bg="primary.300"
              color="white"
              variant="outline"
              type="submit"
              width="full"
              mt={4}
            >
              {isLoading ? (
                <CircularProgress isIndeterminate size="24px" color="teal" />
              ) : (
                'Sign Up'
              )}
            </Button>
            <Button variant="link" mt={4} onClick={handleLoginClick}>
              J'ai déjà un compte
            </Button>
            {error && <Box color="redCoexya">{error}</Box>}
          </form>
        </Box>
      </Box>
    </Flex>
  );
}
