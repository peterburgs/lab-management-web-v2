import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { unwrapResult } from "@reduxjs/toolkit";
import { getComments, resetState } from "../../reducers/commentSlice";
import { Request } from "../../types/model";

const useGetCommentsByRequest = (request: Request | undefined) => {
  const dispatch = useAppDispatch();
  const comments = useAppSelector((state) => state.comments.comments);
  const commentStatus = useAppSelector(
    (state) => state.comments.status
  );

  useEffect(() => {
    if (commentStatus === "idle" && request) {
      (async () => {
        try {
          const actionResult = await dispatch(
            getComments({
              request: request._id,
            })
          );
          unwrapResult(actionResult);
        } catch (err) {
          console.log(err);
        }
      })();
    }

    return () => {
      if (
        commentStatus === "failed" ||
        commentStatus === "succeeded"
      ) {
        dispatch(resetState());
      }
    };
  }, [commentStatus, dispatch, request]);

  return [comments, commentStatus];
};

export default useGetCommentsByRequest;
