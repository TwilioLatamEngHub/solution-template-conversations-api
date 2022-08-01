import React from "react";
import {
  OptInPage as CustomerOptInPage,
  SyncProvider,
} from "@demoeng/usecase-customer-opt-in";
import { useAuth } from "@demoeng/website-customization";
import { Container, styled } from "@mui/material";

const StyledBody = styled("section")(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    paddingTop: 100,
    minHeight: "inherit",
  },
  [theme.breakpoints.up("md")]: {
    paddingTop: 120,
  },
}));

export default function OptInPage() {
  const { signIn, signOut } = useAuth();

  function handleLogIn() {
    signIn();
  }

  function handleLogOut() {
    signOut();
  }

  return (
    <Container>
      <StyledBody>
        <button onClick={handleLogIn}>login</button>
        <button onClick={handleLogOut}>logout</button>
        <SyncProvider>
          <CustomerOptInPage />
        </SyncProvider>
        <br />
        <br />
        <br />
      </StyledBody>
    </Container>
  );
}
