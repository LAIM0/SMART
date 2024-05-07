import { ChakraProvider } from '@chakra-ui/react';
import Layout from '../../components/Layout/Layout';
import theme from '../../styles/theme';
import Ranking from '../../components/Table/Ranking';

const index: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Ranking />
      </Layout>
    </ChakraProvider>
  );
};

export default index;
