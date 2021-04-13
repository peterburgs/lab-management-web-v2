import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { unwrapResult } from "@reduxjs/toolkit";
import { getUsers, resetState } from "../../reducers/userSlice";

const useGetAllUsers = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.users);
  const userStatus = useAppSelector((state) => state.users.status);

  useEffect(() => {
    if (userStatus === "idle") {
      (async () => {
        try {
          const actionResult = await dispatch(getUsers({}));
          unwrapResult(actionResult);
        } catch (err) {
          console.log(err);
        }
      })();
    }
    return () => {
      if (userStatus === "failed" || userStatus === "succeeded") {
        dispatch(resetState());
      }
    };
  }, [userStatus, dispatch]);

  return [users, userStatus];
};

export default useGetAllUsers;
