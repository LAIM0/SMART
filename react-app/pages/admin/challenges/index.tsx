import { ChakraProvider } from '@chakra-ui/react';
import LayoutAdmin from '../../../components/Layout/LayoutAdmin';
import theme from '../../../styles/theme';
import AdminChallenges from './AdminChallenges';

import moment from 'moment-timezone';
import 'moment/locale/fr';

const index: React.FC = () => {
  moment.tz.setDefault('Europe/Paris');
  moment.updateLocale('fr', {
    week: {
      dow: 1,
    },
  });

  return (
    <ChakraProvider theme={theme}>
      <LayoutAdmin>
        <AdminChallenges />
      </LayoutAdmin>
    </ChakraProvider>
  );
};

export default index;
