import React from "react";
import { styled } from "@mui/material";

import {
  LoginCallback,
  useAuthHandler,
  useInternationalization,
  AuthProvider,
} from "@demoeng/website-customization";

import OptInPage from "./Components/OptInPage";

const Routing = () => {
  useAuthHandler();

  useInternationalization();

  return (
    <AuthProvider redirectPath={"/"}>
      <OptInPage />
      <LoginCallback />
    </AuthProvider>
  );
};

export default Routing;
