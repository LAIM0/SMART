import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Layout from '../../components/Layout/Layout';
import theme from '../../styles/theme';
import Challenges from './Challenges';

const index: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Challenges />
      </Layout>
    </ChakraProvider>
  );
};

export default index;
