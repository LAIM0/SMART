import React, { useContext, useState } from 'react';
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
  Image,
  IconButton,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ViewIcon } from '@chakra-ui/icons';
import ForgotPasswordForm from './ForgotPasswordForm';
import { LogoContext } from '../Layout/LayouAuth';

interface LoginResponse {
  message: string;
  status: 'success' | 'error';
}

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginResponse, setLoginResponse] = useState<LoginResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordVisibility = () => setShowPassword(!showPassword);
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showSignUp, setShowSignUp] = useState<boolean>(true);

  const handleSignupClick = () => {
    router.push('/auth/signup');
  };

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
        credentials: 'include',
      });

      setIsLoading(false);
      const data = await response.json();
      console.log(data.message);
      if (data.message === 'Password not initialized') {
        throw new Error('Veuillez réinitialiser votre mot de passe');
      } else if (data.message === 'Email not verified') {
        throw new Error('Adresse email non vérifiée');
      } else if (data.message === 'Unauthorized Admin access') {
        throw new Error("Pas d'accès administrateur");
      } else if (!response.ok) {
        throw new Error('La combinaison login/mot de passe est incorrect');
      } else {
        setLoginResponse({ message: 'Login successful!', status: 'success' });
        const preLoginRoute =
          localStorage.getItem('preLoginRoute') || '/challenges';
        localStorage.removeItem('preLoginRoute');
        router.push(preLoginRoute);
      }
    } catch (error) {
      setLoginResponse({
        message: error instanceof Error ? error.message : 'An error occurred',
        status: 'error',
      });
    }
  };
  return (
    <Flex
      align="center"
      justify="center"
      minHeight="100vh"
      flexDirection="column"
      p={4}
    >
      <Box
        p={8}
        maxWidth="500px"
        borderWidth={0}
        borderRadius={8}
        boxShadow="lg"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box textAlign="center">
          <Image
            src={`http://localhost:3001/users/profile-picture/${useContext(LogoContext)}`}
            w="160px"
            alt="logo"
            m={4}
          />
        </Box>
        <Box my={4} textAlign="left">
          {!showForgotPassword && (
            <form onSubmit={handleLogin}>
              <FormControl isRequired>
                <FormLabel>Adresse email</FormLabel>
                <Input
                  type="email"
                  placeholder="test@test.com"
                  size="lg"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired mt={6}>
                <FormLabel>Mot de passe</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="*******"
                    size="lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement width="3rem">
                    <IconButton
                      h="1.5rem"
                      size="sm"
                      onClick={handlePasswordVisibility}
                      icon={<ViewIcon />}
                      aria-label="show pasword"
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button
                bg="primary.300"
                color="white"
                variant="outline"
                type="submit"
                width="full"
                mt={4}
                isLoading={isLoading}
                loadingText="Chargement..."
              >
                {isLoading ? (
                  <CircularProgress isIndeterminate size="24px" color="teal" />
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>
          )}
          {!showForgotPassword && (
            <Button
              variant="link"
              mt={4}
              onClick={() => setShowForgotPassword(true)}
            >
              Mot de passe oublié ?
            </Button>
          )}
          {showForgotPassword && <ForgotPasswordForm />}
          <br />
          {!showForgotPassword && showSignUp && (
            <Button variant="link" mt={4} onClick={handleSignupClick}>
              S&apos;inscrire
            </Button>
          )}
          {loginResponse && loginResponse.status === 'error' && (
            <Box color="redCoexya">{loginResponse.message}</Box>
          )}
        </Box>
      </Box>
    </Flex>
  );
}
