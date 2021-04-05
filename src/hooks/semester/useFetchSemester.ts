import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchOpenSemester } from "../../reducers/semesterSlice";
import { unwrapResult } from "@reduxjs/toolkit";

const useFetchSemester = () => {
  const dispatch = useAppDispatch();
  const semester = useAppSelector((state) => state.semester.semester);
  const semesterStatus = useAppSelector(
    (state) => state.semester.status
  );

  useEffect(() => {
    if (semesterStatus === "idle") {
      (async () => {
        try {
          const actionResult = await dispatch(fetchOpenSemester());
          unwrapResult(actionResult);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [semesterStatus, dispatch]);

  return [semester, semesterStatus];
};

export default useFetchSemester;
