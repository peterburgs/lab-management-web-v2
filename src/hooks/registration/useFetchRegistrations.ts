import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { unwrapResult } from "@reduxjs/toolkit";
import { fetchAllRegistrationsBySemesterId } from "../../reducers/registrationSlice";

const useFetchRegistrations = (semesterId: string | undefined) => {
  const dispatch = useAppDispatch();
  const registrations = useAppSelector(
    (state) => state.registrations.registrations
  );
  const registrationStatus = useAppSelector(
    (state) => state.registrations.status
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
