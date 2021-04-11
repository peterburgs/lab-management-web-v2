import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { unwrapResult } from "@reduxjs/toolkit";
import { getRegistrations } from "../../reducers/registrationSlice";

const useGetRegistrationBySemester = (
  semester: string | undefined
) => {
  const dispatch = useAppDispatch();
  const registrations = useAppSelector(
    (state) => state.registrations.registrations
  );
  const registrationStatus = useAppSelector(
    (state) => state.registrations.status
  );

  useEffect(() => {
    if (registrationStatus === "idle" && semester) {
      (async () => {
        try {
          const actionResult = await dispatch(
            getRegistrations({ semester })
          );
          unwrapResult(actionResult);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [registrationStatus, dispatch, semester]);

  return [registrations, registrationStatus];
};

export default useGetRegistrationBySemester;
