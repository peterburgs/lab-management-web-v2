import React, { Suspense, useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Layout from "./containers/Layout";
import ReactModal from "react-modal";
import {
  ThemeProvider,
  createMuiTheme,
  Snackbar,
  Alert,
  Slide,
} from "@material-ui/core";
// or @material-ui/lab/Adapter{Dayjs,Luxon,Moment} or any valid date-io adapter
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import { LinearProgress } from "@material-ui/core";
import styled from "styled-components";
import Login from "./containers/Login";
import PrivateRoute from "./containers/PrivateRoute";
import { useAppDispatch, useAppSelector } from "./store";
import {
  setShowSuccessSnackBar,
  setShowErrorSnackBar,
  setSnackBarContent,
} from "./reducers/notificationSlice";
import { TransitionProps } from "@material-ui/core/transitions";
import AuthCheck from "./containers/AuthCheck";
import { useGoogleLogout } from "react-google-login";
import { refreshState } from "./reducers/authSlice";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./containers/ErrorPage";
import LecturerRegistration from "./containers/LecturerRegistration";

function SlideTransition(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

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
  const [isCollapsed, setIsCollapsed] = useState(
    window.innerWidth > 1220 ? false : true
  );

  const showSuccessSnackBar = useAppSelector(
    (state) => state.notifications.showSuccessSnackBar
  );
  const showErrorSnackBar = useAppSelector(
    (state) => state.notifications.showErrorSnackBar
  );
  const snackBarContent = useAppSelector(
    (state) => state.notifications.snackBarContent
  );
  const isSessionTimeout = useAppSelector(
    (state) => state.auth.isSessionTimeout
  );
  const isAuthenticated = useAppSelector(
    (state) => state.auth.verifiedToken !== null
  );
  const verifiedRole = useAppSelector(
    (state) => state.auth.verifiedRole
  );

  const handleSidebarToggle = () => {
    setIsCollapsed((isCollapsed) => !isCollapsed);
  };

  const setCollapsed = (a: boolean) => {
    setIsCollapsed(a);
  };

  const dispatch = useAppDispatch();

  const handleCloseSnackBar = () => {
    dispatch(setShowSuccessSnackBar(false));
    dispatch(setShowErrorSnackBar(false));
  };

  const onLogoutSuccess = () => {
    dispatch(refreshState());
    dispatch(setShowSuccessSnackBar(true));
    dispatch(setSnackBarContent("Session timeout"));
  };

  const { signOut } = useGoogleLogout({
    clientId: process.env.REACT_APP_CLIENT_ID!,
    onLogoutSuccess,
  });

  useEffect(() => {
    if (isSessionTimeout) {
      signOut();
    }
  }, [isSessionTimeout, signOut]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ErrorBoundary FallbackComponent={ErrorPage}>
          <StyledApp>
            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              open={showSuccessSnackBar}
              autoHideDuration={4000}
              onClose={handleCloseSnackBar}
              TransitionComponent={SlideTransition}
            >
              <Alert onClose={handleCloseSnackBar} severity="success">
                {snackBarContent}
              </Alert>
            </Snackbar>
            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              open={showErrorSnackBar}
              autoHideDuration={4000}
              onClose={handleCloseSnackBar}
              TransitionComponent={SlideTransition}
            >
              <Alert onClose={handleCloseSnackBar} severity="warning">
                {snackBarContent}
              </Alert>
            </Snackbar>
            <GlobalStyle />
            <Switch>
              {console.log(isAuthenticated)}
              {!isAuthenticated && (
                <>
                  <Route path="/" render={() => <AuthCheck />} />
                  <Route
                    path="/login"
                    exact
                    render={() => <Login />}
                  />
                </>
              )}
              <PrivateRoute
                roles={["ADMIN", "LECTURER"]}
                path="/"
                exact
                component={
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
                            right: "0px",
                            top:
                              window.innerWidth < 1220
                                ? "-80px"
                                : "0px",
                          }}
                        />
                      }
                    >
                      {verifiedRole && verifiedRole === "ADMIN" ? (
                        <HomePage />
                      ) : (
                        <LecturerRegistration />
                      )}
                    </Suspense>
                  </Layout>
                }
              />
              <PrivateRoute
                roles={["ADMIN"]}
                path="/courses"
                exact
                component={
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
                            top:
                              window.innerWidth < 1220
                                ? "-80px"
                                : "0px",
                          }}
                        />
                      }
                    >
                      <CoursePage />
                    </Suspense>
                  </Layout>
                }
              />
              <PrivateRoute
                path="/schedule"
                exact
                roles={["ADMIN", "LECTURER"]}
                component={
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
                            top:
                              window.innerWidth < 1220
                                ? "-80px"
                                : "0px",
                          }}
                        />
                      }
                    >
                      <SchedulePage />
                    </Suspense>
                  </Layout>
                }
              />
              <PrivateRoute
                path="/labs"
                exact
                roles={["ADMIN"]}
                component={
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
                            top:
                              window.innerWidth < 1220
                                ? "-80px"
                                : "0px",
                          }}
                        />
                      }
                    >
                      <LabPage />
                    </Suspense>
                  </Layout>
                }
              />
              <PrivateRoute
                path="/requests"
                exact
                roles={["ADMIN"]}
                component={
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
                            top:
                              window.innerWidth < 1220
                                ? "-80px"
                                : "0px",
                          }}
                        />
                      }
                    >
                      <RequestPage />
                    </Suspense>
                  </Layout>
                }
              />
              <Redirect to="/" />
            </Switch>
          </StyledApp>
        </ErrorBoundary>
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
