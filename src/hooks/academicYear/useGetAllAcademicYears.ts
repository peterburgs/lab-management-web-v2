import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { getAcademicYears } from "../../reducers/academicYearSlice";
import { unwrapResult } from "@reduxjs/toolkit";

const useGetAllAcademicYears = () => {
  const dispatch = useAppDispatch();
  const academicYears = useAppSelector(
    (state) => state.academicYears.academicYears
  );
  const academicYearStatus = useAppSelector(
    (state) => state.academicYears.status
  );

  useEffect(() => {
    if (academicYearStatus === "idle") {
      (async () => {
        try {
          const actionResult = await dispatch(getAcademicYears({}));
          unwrapResult(actionResult);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [academicYearStatus, dispatch]);

  return [academicYears, academicYearStatus];
};

export default useGetAllAcademicYears;
