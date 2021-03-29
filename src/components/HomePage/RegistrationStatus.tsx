import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { add, formatDistance, sub } from "date-fns";
import { Registration } from "../../react-app-env";

interface RegistrationStatusProps {
  registration: Registration;
}

const RegistrationStatus = ({
  registration,
}: RegistrationStatusProps) => {
  const [openingRegTimeRemain, setOpeningRegTimeRemain] = useState(
    add(new Date(), { days: 3 })
  );
  useEffect(() => {
    const handleCountDown = setInterval(() => {
      setOpeningRegTimeRemain((current) =>
        sub(current, { seconds: 1 })
      );
    }, 1000);

    return () => {
      clearInterval(handleCountDown);
    };
  }, []);

  return (
    <StyledRegistrationStatus isOpen={true}>
      Open - Auto close{" "}
      {formatDistance(openingRegTimeRemain, new Date(), {
        includeSeconds: true,
        addSuffix: true,
      })}
    </StyledRegistrationStatus>
  );
};

interface StyledRegistrationStatusProps {
  isOpen: boolean;
}

const StyledRegistrationStatus = styled.div<StyledRegistrationStatusProps>`
  border-radius: 4px;
  padding: 4px;
  text-transform: uppercase;
  background-color: ${({ isOpen }) =>
    isOpen ? "#44BD63" : "#F02849"};
  color: white;
  margin-top: 1rem;
  text-align: center;
`;

export default RegistrationStatus;
