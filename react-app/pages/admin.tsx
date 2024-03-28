/* eslint-disable */
import React, { useState, useEffect } from "react";
import { ChakraProvider, Button } from "@chakra-ui/react";
import { GlobalStateProvider } from "./../contexts/Context";
import theme from "./../styles/theme";
import Challenges from "../components/Challenges/Challenges";
import Layout from "../components/Layout/Layout";
import AppAdmin from "../components/AppAdmin";

const Admin = () => {
  return (
    <ChakraProvider theme={theme}>
      {" "}
      {/* Utilisez ChakraProvider pour englober votre app */}
      <div className="App">
        <GlobalStateProvider>
          <AppAdmin />
        </GlobalStateProvider>
      </div>
    </ChakraProvider>
  );
};

export default Admin;
