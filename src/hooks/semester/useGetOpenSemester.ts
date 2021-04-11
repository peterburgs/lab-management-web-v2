import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { getSemesters } from "../../reducers/semesterSlice";
import { unwrapResult } from "@reduxjs/toolkit";

const useGetOpenSemester = () => {
  const dispatch = useAppDispatch();
  const semester = useAppSelector(
    (state) => state.semesters.semesters[0]
  );
  const semesterStatus = useAppSelector(
    (state) => state.semesters.status
  );

  useEffect(() => {
    if (semesterStatus === "idle") {
      (async () => {
        try {
          const actionResult = await dispatch(
            getSemesters({ isOpening: true })
          );
          unwrapResult(actionResult);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [semesterStatus, dispatch]);

  return [semester, semesterStatus];
};

export default useGetOpenSemester;
