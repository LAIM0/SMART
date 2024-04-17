import { ChakraProvider } from '@chakra-ui/react';
import LayoutAdmin from '../../../components/Layout/LayoutAdmin';
import theme from '../../../styles/theme';
import AdminUsers from './AdminUsers';


const index: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <LayoutAdmin>
        <AdminUsers />
      </LayoutAdmin>
    </ChakraProvider>
  );
};

export default index;
