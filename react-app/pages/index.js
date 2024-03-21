/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChakraProvider, Button } from '@chakra-ui/react'; // Importez ChakraProvider et Button


const Home = () => {
  const [welcomeMessage, setWelcomeMessage] = useState('...loading');

  useEffect(() => {
    const fetchWelcomeMessage = async () => {
      try {
        const res = await axios.get('http://localhost:3001/users/welcome');
        setWelcomeMessage(res.data);
      } catch (error) {
        console.log(error);
        setWelcomeMessage('Failed to load message from server');
      }
    };

    fetchWelcomeMessage();
  }, []);

  return (
    <ChakraProvider> {/* Utilisez ChakraProvider pour englober votre app */}
      <div className='App'>
        <h1>"Hello server!" says the client (NEXT)</h1>
        <h1>"{welcomeMessage}" says the server (NEXT)</h1>
        <Button colorScheme="blue">Test Button Chakra UI</Button> {/* Ajoutez un Button pour tester */}
      </div>
    </ChakraProvider>
  );
};

export default Home;
