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

    const temp = Math.random() * 0.1 + 0.6;
    console.log(temp);

    const topp = Math.random() * 0.1 + 0.9;
    console.log(topp);

    const difficulty = parseInt(Math.random() * 10);
    console.log('difficulty : ', difficulty);

    const requestBody = {
      inputs: `[INST] Tu es responsable du département RSE d'une SSII ayant des bureaux en France. Chaque semaine tu inventes des défis en français qui peuvent être réalisés par les collaborateurs afin qu'ils aient un impact positif en transformant leurs habitudes. Cette semaine, créé un défi en français sur le thème "${themeChallenge}" de difficulté ${difficulty}/10. Réponds sous la forme : 'Titre : résumé amusant du défi (3 à 6 mots). Description : Action à faire, nombre de fois, durée (1 phrase).\n[/INST]`,
      parameters: {
        return_full_text: false,
        max_new_tokens: 256,
        temperature: temp,
        random_seed: null,
        top_p: topp,
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
          <Text>Choisissez une catégorie</Text>
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
            {proposition.split(':')[1].split('Description')[0]}
          </Text>
          <Text>
            {proposition.split('Description :')[1]}
            {proposition.split('Description:')[1]}
          </Text>
        </Flex>
      </Layout>
    </ChakraProvider>
  );
}

export default TextGenerationApp;
