import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  getRegistrableCourses,
  resetState,
} from "../../reducers/registrableCourseSlice";

const useGetRegistrableCoursesByRegistration = (
  registration: string | undefined
) => {
  const dispatch = useAppDispatch();
  const registrableCourses = useAppSelector(
    (state) => state.registrableCourses.registrableCourses
  );
  const registrableCourseStatus = useAppSelector(
    (state) => state.registrableCourses.status
  );

  useEffect(() => {
    if (registrableCourseStatus === "idle" && registration) {
      (async () => {
        try {
          const actionResult = await dispatch(
            getRegistrableCourses({ registration })
          );
          unwrapResult(actionResult);
        } catch (err) {
          console.log(err);
        }
      })();
    }
    return () => {
      if (
        registrableCourseStatus === "succeeded" ||
        registrableCourseStatus === "failed"
      ) {
        dispatch(resetState());
      }
    };
  }, [registrableCourseStatus, dispatch, registration]);

  return [registrableCourses, registrableCourseStatus];
};

export default useGetRegistrableCoursesByRegistration;
