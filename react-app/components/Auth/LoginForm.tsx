import React, { useState } from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  CircularProgress,
  InputRightElement,
  Icon,
  InputGroup,
  Image,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import logoApp from '../Sidebar/Ecoexya.png';
import ForgotPasswordForm from './ForgotPasswordForm';

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
        throw new Error("Veuillez réinitialiser votre mot de passe");
      }else if (data.message === 'Email not verified') {
        throw new Error('Adresse email non vérifiée');
      } else if (data.message === 'Unauthorized Admin access') {
        throw new Error("Pas d'accès administrateur");
      
      }else if (!response.ok) {
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
    <Flex width="full" align="center" justifyContent="center" minHeight="100vh">
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
          <Image src={logoApp.src} w="160px" alt="logo" m={4} />
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
                  <InputRightElement width="3rem">
                    <Button
                      h="1.5rem"
                      size="sm"
                      onClick={handlePasswordVisibility}
                    >
                      {showPassword ? (
                        <Icon name="view-off" />
                      ) : (
                        <Icon name="view" />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button
                bg="#166879"
                color="white"
                // variantColor="teal"
                variant="outline"
                type="submit"
                width="full"
                mt={4}
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
            <Box color="red.500">{loginResponse.message}</Box>
          )}
        </Box>
      </Box>
    </Flex>
  );
}
