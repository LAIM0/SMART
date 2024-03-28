/*eslint-disable*/
import LayoutAdmin from "../../../components/Layout/LayoutAdmin";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../../../styles/theme";
import AdminTeams from "./AdminTeams";

const index: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <LayoutAdmin>
        <AdminTeams />
      </LayoutAdmin>
    </ChakraProvider>
  );
};

export default index;
