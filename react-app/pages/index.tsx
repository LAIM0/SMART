/* eslint-disable */
import React, { useState, useEffect } from "react";
import { ChakraProvider, Button } from "@chakra-ui/react";
import { GlobalStateProvider } from "./../contexts/Context";
import theme from "./../styles/theme";
import Challenges from "../components/Challenges";
import AdminCreateChallenge from "../components/AdminCreateChallenge";

const Home = () => {
  return (
    <ChakraProvider theme={theme}>
      {" "}
      {/* Utilisez ChakraProvider pour englober votre app */}
      <div className="App">
        <GlobalStateProvider>
          <Challenges />
          <AdminCreateChallenge />
        </GlobalStateProvider>
      </div>
    </ChakraProvider>
  );
};

export default Home;
