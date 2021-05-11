import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  getLabUsages,
  resetState,
} from "../../reducers/scheduleSlice";
import { Semester } from "../../types/model";

const useGetLabUsagesBySemester = (
  semester: Semester | undefined
) => {
  const dispatch = useAppDispatch();
  const labUsages = useAppSelector(
    (state) => state.schedule.labUsages
  );
  const scheduleStatus = useAppSelector(
    (state) => state.schedule.status
  );

  useEffect(() => {
    if (scheduleStatus === "idle" && semester) {
      (async () => {
        try {
          const actionResult = await dispatch(
            getLabUsages({
              semester: semester._id,
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
        scheduleStatus === "failed" ||
        scheduleStatus === "succeeded"
      ) {
        dispatch(resetState());
      }
    };
  }, [scheduleStatus, dispatch, semester]);

  return [labUsages, scheduleStatus];
};

export default useGetLabUsagesBySemester;
