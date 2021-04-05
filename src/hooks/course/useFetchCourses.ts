import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { unwrapResult } from "@reduxjs/toolkit";
import { fetchAllCourses } from "../../reducers/courseSlice";

const useFetchCourses = () => {
  const dispatch = useAppDispatch();
  const courses = useAppSelector((state) => state.courses.courses);
  const courseStatus = useAppSelector(
    (state) => state.courses.status
  );

  useEffect(() => {
    if (courseStatus === "idle") {
      (async () => {
        try {
          const actionResult = await dispatch(fetchAllCourses());
          unwrapResult(actionResult);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [courseStatus, dispatch]);

  return [courses, courseStatus];
};

export default useFetchCourses;
