import React from "react";
import SchedulePage from "./containers/SchedulePage";
import CoursesPage from "./containers/CoursesPage";
import HomePage from "./containers/HomePage";
import { Switch, Route } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Layout from "./containers/Layout";
import ReactModal from "react-modal";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#0070f3",
    },
  },
  typography: {
    fontFamily: "Roboto",
    fontSize: 12,
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <GlobalStyle />
        <Switch>
          <Route
            path="/"
            exact
            render={() => (
              <Layout>
                <HomePage />
              </Layout>
            )}
          />
          <Route
            path="/courses"
            exact
            render={() => (
              <Layout>
                <CoursesPage />
              </Layout>
            )}
          />
          <Route
            path="/schedule"
            exact
            render={() => (
              <Layout>
                <SchedulePage />
              </Layout>
            )}
          />
        </Switch>
      </div>
    </ThemeProvider>
  );
};

ReactModal.setAppElement("#root");

// Global style
const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
  }
  *, *::after, *::before {
    box-sizing: border-box;
  }
  body {
    font-family: Roboto;
  }
`;

export default App;
