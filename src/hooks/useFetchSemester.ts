import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, RootState } from "../store";
import { unwrapResult } from "@reduxjs/toolkit";
import { fetchSemester } from "../reducers/semesterSlice";

const useFetchSemester = () => {
  const dispatch = useAppDispatch();
  const semester = useSelector(
    (state: RootState) => state.semester.semester
  );
  const semesterStatus = useSelector(
    (state: RootState) => state.semester.status
  );

  useEffect(() => {
    if (semesterStatus === "idle") {
      (async () => {
        try {
          const actionResult = await dispatch(fetchSemester());
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
