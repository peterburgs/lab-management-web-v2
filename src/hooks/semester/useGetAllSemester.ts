import { useEffect, useState } from "react";
import { Semester } from "../../types/model";
import { api, auth } from "../../api";
import { GETResponse as SemesterGETResponse } from "../../reducers/semesterSlice";

const useGetAllSemester = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = (
          await api.get("/semesters", {
            headers: auth(),
          })
        ).data as SemesterGETResponse;

        if (res.semesters.length > 0) {
          setSemesters(res.semesters);
        }
      } catch (err) {
        console.log(err.message);
      }
    })();
  }, []);

  return [semesters];
};

export default useGetAllSemester;
