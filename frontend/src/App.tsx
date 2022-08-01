import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { createTheme } from "@mui/material/styles";
import { useLanguageProvider } from "@demoeng/website-customization";
import { translations as smsTranslations } from "@demoeng/usecase-sms-simple";
import { translations as optInTranslations } from "@demoeng/usecase-customer-opt-in";
import "./App.css";
import { defaultLanguages } from "./config/i18n";
import { ThemeProvider } from "@mui/styles";
import { Container } from "@mui/material";

const translations = [...smsTranslations, ...optInTranslations];
const defaultTheme = createTheme();

const App: React.FC = () => {
  useLanguageProvider({ translations, defaultLanguages });

  return (
    <Router>
      <ThemeProvider theme={defaultTheme}>
        <Container>
          <h1>Solutions Template</h1>
          <p>Your solution starts here</p>
        </Container>
      </ThemeProvider>
    </Router>
  );
};

export default App;
