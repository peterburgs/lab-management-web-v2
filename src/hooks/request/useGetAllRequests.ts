import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { unwrapResult } from "@reduxjs/toolkit";
import { getRequests } from "../../reducers/requestSlice";

const useGetAllRequests = () => {
  const dispatch = useAppDispatch();
  const requests = useAppSelector((state) => state.requests.requests);
  const requestStatus = useAppSelector(
    (state) => state.requests.status
  );

  useEffect(() => {
    if (requestStatus === "idle") {
      (async () => {
        try {
          const actionResult = await dispatch(getRequests({}));
          unwrapResult(actionResult);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [requestStatus, dispatch]);

  return [requests, requestStatus];
};

export default useGetAllRequests;
