import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, RootState } from "../store";
import { unwrapResult } from "@reduxjs/toolkit";
import { fetchAllTeachingsByRegistrationId } from "../reducers/teachingSlice";

const useFetchTeachings = (registrationId: string | undefined) => {
  const dispatch = useAppDispatch();
  const teachings = useSelector(
    (state: RootState) => state.teachings.teachings
  );
  const teachingStatus = useSelector(
    (state: RootState) => state.teachings.status
  );

  useEffect(() => {
    if (teachingStatus === "idle" && registrationId) {
      (async () => {
        try {
          const actionResult = await dispatch(
            fetchAllTeachingsByRegistrationId(registrationId)
          );
          unwrapResult(actionResult);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [teachingStatus, dispatch, registrationId]);

  return [teachings, teachingStatus];
};

export default useFetchTeachings;
