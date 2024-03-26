/* eslint-disable */
import React from 'react';
import { useState } from 'react';
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
  Icon,InputGroup
} from '@chakra-ui/react';


interface LoginResponse {
  message: string;
  status: 'success' | 'error';
}

export default function LoginForm() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
  const [loginResponse, setLoginResponse] = useState<LoginResponse | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent form from submitting and refreshing the page
    setIsLoading(true);

    // Implement your API call here. Replace the URL with your login endpoint
    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        
      });

      setIsLoading(false);
      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      setLoginResponse({ message: 'Login successful!', status: 'success' });
      // Redirect the user or update the state based on the successful login
    } catch (error) {
      setLoginResponse({ message: error instanceof Error ? error.message : 'An error occurred', status: 'error' });
    }
  };
  return (
    <Flex width="full" align="center" justifyContent="center" minHeight="100vh">
      <Box p={8} maxWidth="500px" borderWidth={0} borderRadius={8} boxShadow="lg">
        <Box textAlign="center">
          <Heading>Login</Heading>
        </Box>
        <Box my={4} textAlign="left">
        <form onSubmit={handleLogin}>
  <FormControl isRequired>
    <FormLabel>Email</FormLabel>
    <Input
      type="email"
      placeholder="test@test.com"
      size="lg"
      onChange={event => setUsername(event.currentTarget.value)}
    />
  </FormControl>
  <FormControl isRequired mt={6}>
    <FormLabel>Password</FormLabel>
    <InputGroup>
    <Input
      type={showPassword ? 'text' : 'password'}
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
  <Button
    variantColor="teal"
    variant="outline"
    type="submit"
    width="full"
    mt={4}
  >{isLoading ? (
    <CircularProgress isIndeterminate size="24px" color="teal" />
  ) : (
    'Sign In'
  )}
  </Button>
</form>
        </Box>
      </Box>
    </Flex>
  );
}
