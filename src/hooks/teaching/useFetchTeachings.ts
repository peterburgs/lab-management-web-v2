import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { unwrapResult } from "@reduxjs/toolkit";
import { fetchAllTeachingsByRegistrationId } from "../../reducers/teachingSlice";
import { Registration } from "../../react-app-env";

const useFetchTeachings = (
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
      const registrationId = registrations.find(
        (reg) => reg.batch === batch
      )!._id;
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

    return () => {};
  }, [teachingStatus, dispatch, batch, registrations]);

  return [teachings, teachingStatus];
};

export default useFetchTeachings;
