import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { useAppDispatch } from "../store";
import { resetState, verify } from "../reducers/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  setShowErrorSnackBar,
  setSnackBarContent,
} from "../reducers/notificationSlice";
import { ROLES } from "../types/model";

const AuthCheck = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token")!;
    const role =
      localStorage.getItem("role")! === "0"
        ? ROLES.ADMIN
        : ROLES.LECTURER;
    const expirationDate = localStorage.getItem("exp")!;

    if (!token) {
      history.replace("/login");
    } else {
      (async () => {
        try {
          const verifyResult = await dispatch(
            verify({ token, role, expirationDate })
          );
          unwrapResult(verifyResult);
        } catch (err) {
          history.replace("/login");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("exp");
          dispatch(setShowErrorSnackBar(true));
          dispatch(setSnackBarContent("Something went wrong!"));
        }
      })();
    }
  }, [history, dispatch]);

  return null;
};

export default AuthCheck;
