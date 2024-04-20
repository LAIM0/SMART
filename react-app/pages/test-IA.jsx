import React, { useState } from 'react';
import { Button, ChakraProvider, Input } from '@chakra-ui/react';
import Layout from '../components/Layout/Layout';
import theme from '../styles/theme';
import { Flex, Text, Box } from '@chakra-ui/react';

// Appelez la fonction pour effectuer la requête

function TextGenerationApp() {
  const [themeChallenge, setThemeChallenge] = useState('Alimentation');
  const [proposition, setProposition] = useState('');

  async function makeHuggingFaceAPIRequest() {
    const token = 'Bearer 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';
    const apiUrl =
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1';

    const requestBody = {
      inputs: `[INST] Create a challenge with a positive impact on the planet in the field of ${themeChallenge}. Answer as 'Title:title of the challenge. Description:description of the challenge'\n[/INST]`,
      parameters: {
        return_full_text: false,
      },
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    };

    try {
      const response = await fetch(apiUrl, requestOptions);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const responseData = await response.json();
      console.log(responseData);
      setProposition(responseData[0].generated_text);
      // Faites quelque chose avec les données de la réponse ici
    } catch (error) {
      console.error('Erreur lors de la requête API:', error);
    }
  }

  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Flex flexDirection="column" px="32px" py="24px" gap="16px">
          <Text as="h1">EcoexIA</Text>
          <Input
            bg="white"
            onChange={(e) => setThemeChallenge(e.target.value)}
          ></Input>
          <Button
            width="fit-content"
            bg="secondary.300"
            color="white"
            onClick={makeHuggingFaceAPIRequest}
          >
            Générer une idée
          </Button>
          <Text as="h2">
            {proposition.split('Description:')[0].split('Title:')[1]}
          </Text>
          <Text>{proposition.split('Description:')[1]}</Text>
        </Flex>
      </Layout>
    </ChakraProvider>
  );
}

export default TextGenerationApp;
