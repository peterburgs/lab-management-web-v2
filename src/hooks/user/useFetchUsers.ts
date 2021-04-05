import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { unwrapResult } from "@reduxjs/toolkit";
import { fetchAllUsers } from "../../reducers/userSlice";

const useFetchUsers = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.users);
  const userStatus = useAppSelector((state) => state.users.status);

  useEffect(() => {
    if (userStatus === "idle") {
      (async () => {
        try {
          const actionResult = await dispatch(fetchAllUsers());
          unwrapResult(actionResult);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [userStatus, dispatch]);

  return [users, userStatus];
};

export default useFetchUsers;
