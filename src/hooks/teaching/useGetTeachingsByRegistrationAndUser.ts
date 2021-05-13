import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  getTeachings,
  resetState,
} from "../../reducers/teachingSlice";
import { Registration, User } from "../../types/model";

const useGetTeachingsByRegistrationAndUser = (
  registration: Registration | undefined,
  user: User | null
) => {
  const dispatch = useAppDispatch();
  const teachings = useAppSelector(
    (state) => state.teachings.teachings
  );
  const teachingStatus = useAppSelector(
    (state) => state.teachings.status
  );

  useEffect(() => {
    if (teachingStatus === "idle" && registration && user) {
      console.log(registration);
      console.log(user);
      (async () => {
        try {
          const actionResult = await dispatch(
            getTeachings({
              registration: registration._id,
              user: user._id,
            })
          );
          unwrapResult(actionResult);
        } catch (err) {
          console.log(err);
        }
      })();
    }

    return () => {
      if (
        teachingStatus === "failed" ||
        teachingStatus === "succeeded"
      ) {
        console.log("hello");
        dispatch(resetState());
      }
    };
  }, [teachingStatus, dispatch, registration, user]);

  return [teachings, teachingStatus];
};

export default useGetTeachingsByRegistrationAndUser;
