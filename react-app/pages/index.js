/* eslint-disable */
import { ChakraProvider, Button } from '@chakra-ui/react'; // Importez ChakraProvider et Button
import Challenges from '../components/Challenges';
import React from 'react';
import AdminCreateChallenge from '../components/AdminCreateChallenge';

const Home = () => {
  return (
    <ChakraProvider > {/* Utilisez ChakraProvider pour englober votre app */}
        <Challenges />
        <AdminCreateChallenge />
    </ChakraProvider>
  );
};

export default Home;
