import { useEffect, useState } from "react";
import { Comment } from "../../types/model";
import { api, auth } from "../../api";
import { GETResponse as CommentGETResponse } from "../../reducers/commentSlice";

const useGetAllComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = (
          await api.get("/comments", {
            headers: auth(),
          })
        ).data as CommentGETResponse;

        if (res.comments.length > 0) {
          setComments(res.comments);
        }
      } catch (err) {
        console.log(err.message);
      }
    })();
  }, []);

  return [comments];
};

export default useGetAllComments;
