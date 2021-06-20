import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { unwrapResult } from "@reduxjs/toolkit";
import { getLabUsages, resetState } from "../../reducers/scheduleSlice";
import { Semester } from "../../types/model";

const useGetLabUsagesBySemester = (semester: Semester | undefined) => {
  const dispatch = useAppDispatch();
  const labUsages = useAppSelector((state) => state.schedule.labUsages);
  const labUsageStatus = useAppSelector(
    (state) => state.schedule.labUsageStatus
  );

  useEffect(() => {
    console.log(semester);
    if (labUsageStatus === "idle" && semester) {
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
      if (labUsageStatus === "failed" || labUsageStatus === "succeeded") {
        dispatch(resetState());
      }
    };
  }, [labUsageStatus, dispatch, semester]);

  return [labUsages, labUsageStatus];
};

export default useGetLabUsagesBySemester;
