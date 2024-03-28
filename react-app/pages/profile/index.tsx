/*eslint-disable*/
import Layout from "../../components/Layout/Layout";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../../styles/theme";
import Profile from "./Profile";

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
