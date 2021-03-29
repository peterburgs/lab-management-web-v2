import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, RootState } from "../store";
import { unwrapResult } from "@reduxjs/toolkit";
import { fetchAllRegistrationsBySemesterId } from "../reducers/registrationSlice";

const useFetchRegistrations = (semesterId: string | undefined) => {
  const dispatch = useAppDispatch();
  const registrations = useSelector(
    (state: RootState) => state.registrations.registrations
  );
  const registrationStatus = useSelector(
    (state: RootState) => state.registrations.status
  );

  useEffect(() => {
    if (registrationStatus === "idle" && semesterId) {
      (async () => {
        try {
          const actionResult = await dispatch(
            fetchAllRegistrationsBySemesterId(semesterId)
          );
          unwrapResult(actionResult);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [registrationStatus, dispatch, semesterId]);

  return [registrations, registrationStatus];
};

export default useFetchRegistrations;
