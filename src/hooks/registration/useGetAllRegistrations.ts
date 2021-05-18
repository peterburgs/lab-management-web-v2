import { useEffect, useState } from "react";
import { Registration } from "../../types/model";
import { api, auth } from "../../api";
import { GETResponse as RegistrationGETResponse } from "../../reducers/registrationSlice";

const useGetAllRegistrations = () => {
  const [registrations, setRegistrations] = useState<Registration[]>(
    []
  );

  useEffect(() => {
    (async () => {
      try {
        const res = (
          await api.get("/registrations", {
            headers: auth(),
          })
        ).data as RegistrationGETResponse;

        if (res.registrations.length > 0) {
          setRegistrations(res.registrations);
        }
      } catch (err) {
        console.log(err.message);
      }
    })();
  }, []);

  return [registrations];
};

export default useGetAllRegistrations;
