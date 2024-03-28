/* eslint-disable */
import React from 'react';
import { useState,useEffect } from 'react';
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  CircularProgress,
  InputRightElement,
  Icon,
  InputGroup,
  Select,
Image} from '@chakra-ui/react'
  import axios from 'axios';
  import logoApp from '../Sidebar/Ecoexya.png';


export default function SignupForm() {
    const [email, setUsername] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [passwordHash, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<string>('');
    const handlePasswordVisibility = () => setShowPassword(!showPassword);
    

    useEffect(() => {
      const fetchData = async () => {
        const response = await axios.get("http://localhost:3001/teams");
        setTeams(response.data);
        console.log("Response data:", response.data);
      };
  
      fetchData();
    }, []);
  
    const handleLoginClick = () => {
      window.location.href = '/login';
    };

    const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent form from submitting and refreshing the page
    setIsLoading(true);

    // Implement your API call here. Replace the URL with your login endpoint
    try {
      if (passwordHash !== confirmPassword) {
        throw new Error("Passwords don't match");
      }
      console.log("selectedData",selectedTeam);
      //const selectedTeamData = teams.find(team => team.id === selectedTeam.id);
      //console.log(selectedTeamData);
      
      // if (!selectedTeamData) {
      //   throw new Error('Selected team not found');
      // }

      
      const requestData = { email, passwordHash, lastName, firstName, isAdmin: false, teamId: selectedTeam };
      console.log('Request Data:', requestData);
      const response = await fetch('http://localhost:3001/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify({ email,passwordHash, lastName,firstName ,isAdmin:false,teamId: selectedTeam}),
        
      });
     

      console.log(response);

      setIsLoading(false);
      if (!response.ok) throw new Error('Sign up failed');

      const data = await response.json();
      window.location.href = '/login';
      // Redirect the user or update the state based on the successful login
    } catch (error) {
      setIsLoading(false);
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };
    
    return (
      <Flex width="full" align="center" justifyContent="center" minHeight="100vh">
        <Box p={8} maxWidth="500px" borderWidth={0} borderRadius={8} boxShadow="lg">
          <Box textAlign="center" display="flex" flexDirection="column" alignItems="center">
          <Image src={logoApp.src} w="160px" alt="logo" m={4} />
          </Box>
          <Box my={4} textAlign="left">
            <form onSubmit={handleSignup}>
              <FormControl isRequired>
                <FormLabel>Prénom</FormLabel>
                  <Input
                    type="firstName"
                    placeholder="Laurie"
                    size="lg"
                    onChange={event => setFirstName(event.currentTarget.value)}
                  />

              </FormControl>
              <FormControl isRequired mt={6}>
              <FormLabel>Nom</FormLabel>
                <Input
                  type="lastName"
                  placeholder="BLEUTON"
                  size="lg"
                  onChange={event => setLastName(event.currentTarget.value)}
                />
            </FormControl>
            <FormControl isRequired mt={6}>
              <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="laurie.bleuton@coexya.eu"
                  size="lg"
                  onChange={event => setUsername(event.currentTarget.value)}
                />
            </FormControl>
            <FormControl isRequired mt={6}>
              <FormLabel>Mot de passe</FormLabel>
              <InputGroup>
              <Input
                type={showPassword ? 'text' : 'passwordHash'}
                placeholder="*******"
                size="lg"
                onChange={event => setPassword(event.currentTarget.value)}
              />
              <InputRightElement width="3rem">
                <Button h="1.5rem" size="sm" onClick={handlePasswordVisibility}>
                  {showPassword ? <Icon name="view-off" /> : <Icon name="view" />}
                </Button>
              </InputRightElement>
            </InputGroup>
            </FormControl>
            <FormControl isRequired mt={6}>
              <FormLabel>Confirmation du mot de passe </FormLabel>
              <InputGroup>
              <Input
                type={showPassword ? 'text' : 'passwordHash'}
                placeholder="*******"
                size="lg"
                onChange={event => setConfirmPassword(event.currentTarget.value)}
              />
              <InputRightElement width="3rem">
                <Button h="1.5rem" size="sm" onClick={handlePasswordVisibility}>
                  {showPassword ? <Icon name="view-off" /> : <Icon name="view" />}
                </Button>
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
            <Button bg="#166879" color="white"
            variant="outline"
            type="submit"
            width="full"
            mt={4}
          >{isLoading ? (
            <CircularProgress isIndeterminate size="24px" color="teal" />
          ) : (
            'Sign Up'
          )}
          </Button>
          <Button variant="link" mt={4} onClick={handleLoginClick}>
            J'ai déjà un compte
          </Button>
          {error && <Box color="red.500">{error}</Box>}
        </form>
          </Box>
        </Box>
      </Flex>
    );
  }
        