import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { unwrapResult } from "@reduxjs/toolkit";
import { getLabs } from "../../reducers/labSlice";

const useGetAllLabs = () => {
  const dispatch = useAppDispatch();
  const labs = useAppSelector((state) => state.labs.labs);
  const labStatus = useAppSelector((state) => state.labs.status);

  useEffect(() => {
    if (labStatus === "idle") {
      (async () => {
        try {
          const actionResult = await dispatch(getLabs({}));
          unwrapResult(actionResult);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [labStatus, dispatch]);

  return [labs, labStatus];
};

export default useGetAllLabs;
