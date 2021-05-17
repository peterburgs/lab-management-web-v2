import React, { Suspense, useEffect, useState } from "react";
import {
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Layout from "./containers/Layout";
import ReactModal from "react-modal";
import {
  ThemeProvider,
  createTheme,
  Snackbar,
  Alert,
  Slide,
} from "@material-ui/core";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import { LinearProgress } from "@material-ui/core";
import styled from "styled-components";
import Login from "./containers/Login";
import PrivateRoute from "./containers/PrivateRoute";
import { TransitionProps } from "@material-ui/core/transitions";
import AuthCheck from "./containers/AuthCheck";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./containers/ErrorPage";
import { ROLES } from "./types/model";

// import reducers
import { resetState as resetAuthState } from "./reducers/authSlice";
import { resetState as resetRegistrationState } from "./reducers/registrationSlice";
import { resetState as resetSemesterState } from "./reducers/semesterSlice";
import { resetState as resetSearchState } from "./reducers/searchSlice";
import {
  setShowSuccessSnackBar,
  setShowErrorSnackBar,
  setSnackBarContent,
} from "./reducers/notificationSlice";

// import hooks
import { useGoogleLogout } from "react-google-login";
import { useAppDispatch, useAppSelector } from "./store";
import SimpleBar from "simplebar-react";

// snackbar animation helper
function SlideTransition(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

// lazy load pages
const RegistrationPage = React.lazy(
  () => import("./containers/RegistrationPage")
);
const LecturerRegistrationPage = React.lazy(
  () => import("./containers/LecturerRegistrationPage")
);
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
const UserPage = React.lazy(() => import("./containers/UserPage"));
const RequestDetailPage = React.lazy(
  () => import("./containers/RequestDetailPage")
);

// material-ui theme
const theme = createTheme({
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
  // useState
  const [isCollapsed, setIsCollapsed] = useState(
    window.innerWidth > 1220 ? false : true
  );

  // call hooks
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
  const dispatch = useAppDispatch();

  // event handling
  const handleSidebarToggle = () => {
    setIsCollapsed((isCollapsed) => !isCollapsed);
  };

  const setCollapsed = (a: boolean) => {
    setIsCollapsed(a);
  };

  const handleCloseSnackBar = () => {
    dispatch(setShowSuccessSnackBar(false));
    dispatch(setShowErrorSnackBar(false));
  };

  const onLogoutSuccess = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("exp");
    dispatch(resetAuthState());
    dispatch(resetRegistrationState());
    dispatch(resetSemesterState());
    dispatch(resetSearchState());
    dispatch(setShowSuccessSnackBar(true));
    dispatch(setSnackBarContent("Session timeout"));
  };

  const { signOut } = useGoogleLogout({
    clientId: process.env.REACT_APP_CLIENT_ID!,
    onLogoutSuccess,
  });

  // useEffect
  useEffect(() => {
    // handle session timeout
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
              {/* Auth routes */}
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
              {/* Private routes */}
              <PrivateRoute
                roles={[ROLES.ADMIN, ROLES.LECTURER]}
                path="/courses"
                exact={false}
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
                roles={[ROLES.ADMIN]}
                path="/users"
                exact={false}
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
                      <UserPage />
                    </Suspense>
                  </Layout>
                }
              />
              <PrivateRoute
                path="/schedule"
                exact={false}
                roles={[ROLES.ADMIN, ROLES.LECTURER]}
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
                exact={false}
                roles={[ROLES.ADMIN, ROLES.LECTURER]}
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
                exact={true}
                roles={[ROLES.ADMIN, ROLES.LECTURER]}
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
              <PrivateRoute
                roles={[ROLES.ADMIN, ROLES.LECTURER]}
                path="/registration"
                exact={false}
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
                      {verifiedRole === ROLES.ADMIN ? (
                        <RegistrationPage />
                      ) : (
                        <LecturerRegistrationPage />
                      )}
                    </Suspense>
                  </Layout>
                }
              />
              <PrivateRoute
                roles={[ROLES.ADMIN, ROLES.LECTURER]}
                path="/requests/:id"
                exact={false}
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
                      <RequestDetailPage />
                    </Suspense>
                  </Layout>
                }
              />
              <Redirect to="/registration" />
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
