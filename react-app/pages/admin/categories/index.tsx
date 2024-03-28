/*eslint-disable*/
import LayoutAdmin from "../../../components/Layout/LayoutAdmin";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../../../styles/theme";
import AdminCategories from "./AdminCategories";

const index: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <LayoutAdmin>
        <AdminCategories />
      </LayoutAdmin>
    </ChakraProvider>
  );
};

export default index;
