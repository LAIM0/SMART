/*eslint-disable*/
import LayoutAdmin from "../../../components/Layout/LayoutAdmin";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../../../styles/theme";
import AdminChallenges from "./AdminChallenges";

const index: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <LayoutAdmin>
        <AdminChallenges />
      </LayoutAdmin>
    </ChakraProvider>
  );
};

export default index;
