import { ChakraProvider } from '@chakra-ui/react';
import Layout from '../../../components/Layout/Layout';
import theme from '../../../styles/theme';
import Settings from './Settings';
import LayoutAdmin from '../../../components/Layout/LayoutAdmin';

const index: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <LayoutAdmin>
        <Settings />
      </LayoutAdmin>
    </ChakraProvider>
  );
};

export default index;
