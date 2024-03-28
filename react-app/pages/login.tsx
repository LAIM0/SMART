// pages/login.tsx
/* eslint-disable */
import { useState } from "react";
import React from "react";
import {
  ThemeProvider,
  theme,
  ColorModeProvider,
  CSSReset
} from "@chakra-ui/react";
import LoginForm from "../components/Auth/LoginForm";

export default function LogIn() {
  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <CSSReset />
        <LoginForm />
      </ColorModeProvider>
    </ThemeProvider>
  );
}
