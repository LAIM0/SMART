import { ChakraProvider } from '@chakra-ui/react';
import Layout from '../../../components/Layout/Layout';
import theme from '../../../styles/theme';
import Leader from '../../../components/Leader/Leader';

const index: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Leader />
      </Layout>
    </ChakraProvider>
  );
};

export default index;
