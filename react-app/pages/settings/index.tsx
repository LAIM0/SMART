import { ChakraProvider } from '@chakra-ui/react';
import Layout from '../../components/Layout/Layout';
import theme from '../../styles/theme';
import Settings from './Settings';

const index: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Settings />
      </Layout>
    </ChakraProvider>
  );
};

export default index;
