import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  getTeachings,
  resetState,
} from "../../reducers/teachingSlice";
import { Registration } from "../../react-app-env";
import { useLocation } from "react-router";

const useGetTeachingsByRegistrationBatch = (
  registrations: Registration[],
  batch: number
) => {
  const dispatch = useAppDispatch();
  const teachings = useAppSelector(
    (state) => state.teachings.teachings
  );
  const teachingStatus = useAppSelector(
    (state) => state.teachings.status
  );

  const batchRef = useRef(batch);

  useEffect(() => {
    if (
      (teachingStatus === "idle" && registrations.length > 0) ||
      (batchRef.current !== batch && registrations.length > 0)
    ) {
      batchRef.current = batch;
      const registration = registrations.find(
        (reg) => reg.batch === batch
      )!._id;
      (async () => {
        try {
          const actionResult = await dispatch(
            getTeachings({ registration })
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
        dispatch(resetState());
      }
    };
  }, [teachingStatus, dispatch, batch, registrations]);

  return [teachings, teachingStatus];
};

export default useGetTeachingsByRegistrationBatch;
