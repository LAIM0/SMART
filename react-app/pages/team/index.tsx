import { ChakraProvider } from '@chakra-ui/react';
import Layout from '../../components/Layout/Layout';
import theme from '../../styles/theme';
import Team from '../../components/Team/Team';

const index: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Team />
      </Layout>
    </ChakraProvider>
  );
};

export default index;
