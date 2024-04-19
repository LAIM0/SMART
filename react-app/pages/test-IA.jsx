import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Layout from '../components/Layout/Layout';
import theme from '../styles/theme';
import { Flex, Text, Box } from '@chakra-ui/react';

function TextGenerationApp() {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Flex flexDirection="column" px="32px" py="24px">
          <Text as="h1">EcoexIA</Text>
          <iframe
            src="https://yboady-ia-coexya.hf.space"
            frameborder="0"
            width="850"
            height="450"
          ></iframe>
        </Flex>
      </Layout>
    </ChakraProvider>
  );
}

export default TextGenerationApp;
