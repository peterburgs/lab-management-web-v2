import { useEffect, useState } from "react";
import { Teaching } from "../../types/model";
import { nodeAPI, auth } from "../../api";
import { GETResponse as TeachingGETResponse } from "../../reducers/teachingSlice";

const useGetAllTeaching = () => {
  const [teachings, setTeachings] = useState<Teaching[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = (
          await nodeAPI.get("/teachings", {
            headers: auth(),
          })
        ).data as TeachingGETResponse;

        if (res.teachings.length > 0) {
          setTeachings(res.teachings);
        }
      } catch (err) {
        console.log(err.message);
      }
    })();
  }, []);

  return [teachings];
};

export default useGetAllTeaching;
