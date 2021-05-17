import { useEffect, useState } from "react";
import { LabUsage } from "../../types/model";
import { api, auth } from "../../api";
import { LabUsageGETResponse } from "../../reducers/scheduleSlice";

const useGetAllLabUsages = () => {
  const [labUsages, setLabUsages] = useState<LabUsage[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = (
          await api.get("/schedules", {
            headers: auth(),
          })
        ).data as LabUsageGETResponse;

        if (res.labUsages.length > 0) {
          setLabUsages(res.labUsages);
        }
      } catch (err) {
        console.log(err.message);
      }
    })();
  }, []);

  return [labUsages];
};

export default useGetAllLabUsages;
