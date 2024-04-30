import { ChakraProvider } from '@chakra-ui/react';
import Layout from '../../components/Layout/Layout';
import theme from '../../styles/theme';
import Profile from '../../components/Profile/Profile';

const index: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Profile />
      </Layout>
    </ChakraProvider>
  );
};

export default index;
