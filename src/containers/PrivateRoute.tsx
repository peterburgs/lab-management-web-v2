import React, { ReactNode } from "react";
import { Redirect, Route } from "react-router";
import { ROLES } from "../types/react-app-env";
import { useAppSelector } from "../store";

interface PrivateRouteProps {
  component: ReactNode;
  roles: ROLES[];
  path: string;
  exact: boolean | undefined;
}

const PrivateRoute = ({
  component,
  roles,
  path,
  exact,
}: PrivateRouteProps) => {
  const verifiedRole = useAppSelector(
    (state) => state.auth.verifiedRole
  );
  const isAuthenticated = useAppSelector(
    (state) => state.auth.verifiedToken !== null
  );
  return (
    <Route
      path={path}
      exact={exact}
      render={(props) => {
        if (!isAuthenticated || roles.indexOf(verifiedRole!) === -1) {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location },
              }}
            />
          );
        }
        return component;
      }}
    />
  );
};

export default PrivateRoute;
