import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { getSemesters } from "../../reducers/semesterSlice";
import { unwrapResult } from "@reduxjs/toolkit";

const useGetAllSemesters = () => {
  const dispatch = useAppDispatch();
  const semesters = useAppSelector(
    (state) => state.semesters.semesters
  );
  const academicYearStatus = useAppSelector(
    (state) => state.academicYears.status
  );
  const semesterStatus = useAppSelector(
    (state) => state.semesters.status
  );

  useEffect(() => {
    if (
      semesterStatus === "idle" &&
      academicYearStatus === "succeeded"
    ) {
      (async () => {
        try {
          const actionResult = await dispatch(getSemesters({}));
          unwrapResult(actionResult);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [semesterStatus, dispatch, academicYearStatus]);

  return [semesters, semesterStatus];
};

export default useGetAllSemesters;
