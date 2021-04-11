import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { unwrapResult } from "@reduxjs/toolkit";
import { getCourses, resetState } from "../../reducers/courseSlice";

const useGetAllCourses = () => {
  const dispatch = useAppDispatch();
  const courses = useAppSelector((state) => state.courses.courses);
  const courseStatus = useAppSelector(
    (state) => state.courses.status
  );

  useEffect(() => {
    if (courseStatus === "idle") {
      (async () => {
        try {
          const actionResult = await dispatch(getCourses({}));
          unwrapResult(actionResult);
        } catch (err) {
          console.log(err);
        }
      })();
    }
    return () => {
      if (courseStatus === "failed" || courseStatus === "succeeded") {
        dispatch(resetState());
      }
    };
  }, [courseStatus, dispatch]);

  return [courses, courseStatus];
};

export default useGetAllCourses;
