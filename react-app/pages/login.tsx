// pages/login.tsx
/* eslint-disable */
import { useState } from 'react';
import { Flex, Box, Button,Text,Link,Image, Container,Stack, FormControl, FormLabel, Heading, Input, VStack, Alert, AlertIcon } from '@chakra-ui/react';

interface LoginResponse {
  message: string;
  status: 'success' | 'error';
}

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginResponse, setLoginResponse] = useState<LoginResponse | null>(null);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent form from submitting and refreshing the page

    // Implement your API call here. Replace the URL with your login endpoint
    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      setLoginResponse({ message: 'Login successful!', status: 'success' });
      // Redirect the user or update the state based on the successful login
    } catch (error) {
      setLoginResponse({ message: error instanceof Error ? error.message : 'An error occurred', status: 'error' });
    }
  };

    return (
      <Flex
        align="center"
        justify="center"
        height="100vh"
        p={6}
        backgroundColor="gray.50"
      >
        <Box
          p={8}
          maxWidth="400px"
          borderWidth="0.05px"
          borderRadius="lg"
          borderColor="gray.200"
          boxShadow="xl"
          backgroundColor="white"
          rounded="2xl" // Plus arrondi
        >
          {/* <Box textAlign="center" mb={6}>
            <Image src= "../components/Sidebar/Ecoexya.png" alt="Logo" maxWidth="200px" mx="auto" />
          </Box> */}
  
          <form onSubmit={handleLogin}>
            <Stack spacing={4}>
              <FormControl id="username">
                <FormLabel>Adresse email</FormLabel>
                <Input
                  type="email"
                  size="lg"
                  variant='outline'
                  placeholder='yanice.boady@insa-lyon.fr'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  bg="white"
                  borderColor="E2E8F0" // Couleur du contour
                  _hover={{ borderColor: '#166879' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                  rounded="xl" // Plus arrondi
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Mot de passe</FormLabel>
                <Input
                  placeholder='*******'
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  bg="white"
                  borderColor="gray.300" // Couleur du contour
                  _hover={{ borderColor: 'gray.400' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                  rounded="xl" // Plus arrondi
                />
              </FormControl>
              <Button colorScheme='teal'
                type="submit"
                
                size="lg"
                fontSize="md"
                width="full"
                rounded="xl" // Bouton plus arrondi
              >
                Se connecter
              </Button>
            </Stack>
          </form>
          <Text textAlign="center" fontSize="sm" mt={4}>
            <Link color="blue.600" href="/forgot-password" textDecoration="underline">
              Mot de passe oublié ?
            </Link>
          </Text>
        </Box>
      </Flex>
    );
  
}
