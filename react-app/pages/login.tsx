// pages/login.tsx
import { useState } from 'react';
import { Box, Button, Container, FormControl, FormLabel, Heading, Input, VStack, Alert, AlertIcon } from '@chakra-ui/react';

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
    <Container centerContent>
      <Box width="full" maxWidth="md" mt="5">
        <Heading mb="5">Login</Heading>
        <form onSubmit={handleLogin}>
          <VStack spacing="4">
            {loginResponse && (
              <Alert status={loginResponse.status}>
                <AlertIcon />
                {loginResponse.message}
              </Alert>
            )}
            <FormControl isRequired>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <Button type="submit" colorScheme="blue" width="full">Login</Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
}
