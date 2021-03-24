import React, { Suspense, useState } from "react";
import { Switch, Route } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Layout from "./containers/Layout";
import ReactModal from "react-modal";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";
// or @material-ui/lab/Adapter{Dayjs,Luxon,Moment} or any valid date-io adapter
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import { LinearProgress } from "@material-ui/core";
import styled from "styled-components";

const HomePage = React.lazy(() => import("./containers/HomePage"));
const CoursePage = React.lazy(
  () => import("./containers/CoursePage")
);
const SchedulePage = React.lazy(
  () => import("./containers/SchedulePage")
);
const LabPage = React.lazy(() => import("./containers/LabPage"));
const RequestPage = React.lazy(
  () => import("./containers/RequestPage")
);

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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsCollapsed((isCollapsed) => !isCollapsed);
  };

  const setCollapsed = (a: boolean) => {
    setIsCollapsed(a);
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StyledApp>
          <GlobalStyle />
          <Switch>
            <Route
              path="/"
              exact
              render={() => (
                <Layout
                  handleSidebarToggle={handleSidebarToggle}
                  isCollapsed={isCollapsed}
                  setCollapsed={setCollapsed}
                >
                  <Suspense
                    fallback={
                      <LinearProgress
                        style={{
                          width: isCollapsed
                            ? "calc(100vw - 67px)"
                            : "calc(100vw - 240px)",
                          position: "absolute",
                          right: 0,
                          top: 0,
                        }}
                      />
                    }
                  >
                    <HomePage />
                  </Suspense>
                </Layout>
              )}
            />
            <Route
              path="/courses"
              exact
              render={() => (
                <Layout
                  handleSidebarToggle={handleSidebarToggle}
                  isCollapsed={isCollapsed}
                  setCollapsed={setCollapsed}
                >
                  <Suspense
                    fallback={
                      <LinearProgress
                        style={{
                          width: isCollapsed
                            ? "calc(100vw - 67px)"
                            : "calc(100vw - 240px)",
                          position: "absolute",
                          right: 0,
                          top: 0,
                        }}
                      />
                    }
                  >
                    <CoursePage />
                  </Suspense>
                </Layout>
              )}
            />
            <Route
              path="/schedule"
              exact
              render={() => (
                <Layout
                  handleSidebarToggle={handleSidebarToggle}
                  isCollapsed={isCollapsed}
                  setCollapsed={setCollapsed}
                >
                  <Suspense
                    fallback={
                      <LinearProgress
                        style={{
                          width: isCollapsed
                            ? "calc(100vw - 67px)"
                            : "calc(100vw - 240px)",
                          position: "absolute",
                          right: 0,
                          top: 0,
                        }}
                      />
                    }
                  >
                    <SchedulePage />
                  </Suspense>
                </Layout>
              )}
            />
            <Route
              path="/labs"
              exact
              render={() => (
                <Layout
                  handleSidebarToggle={handleSidebarToggle}
                  isCollapsed={isCollapsed}
                  setCollapsed={setCollapsed}
                >
                  <Suspense
                    fallback={
                      <LinearProgress
                        style={{
                          width: isCollapsed
                            ? "calc(100vw - 67px)"
                            : "calc(100vw - 240px)",
                          position: "absolute",
                          right: 0,
                          top: 0,
                        }}
                      />
                    }
                  >
                    <LabPage />
                  </Suspense>
                </Layout>
              )}
            />
            <Route
              path="/requests"
              exact
              render={() => (
                <Layout
                  handleSidebarToggle={handleSidebarToggle}
                  isCollapsed={isCollapsed}
                  setCollapsed={setCollapsed}
                >
                  <Suspense
                    fallback={
                      <LinearProgress
                        style={{
                          width: isCollapsed
                            ? "calc(100vw - 67px)"
                            : "calc(100vw - 240px)",
                          position: "absolute",
                          right: 0,
                          top: 0,
                        }}
                      />
                    }
                  >
                    <RequestPage />
                  </Suspense>
                </Layout>
              )}
            />
          </Switch>
        </StyledApp>
      </LocalizationProvider>
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

const StyledApp = styled.div`
  position: relative;
`;

export default App;
