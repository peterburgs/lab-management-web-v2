import React from "react";
import styled from "styled-components";
import { Registration } from "../../react-app-env";
import Countdown from "react-countdown";
import Button from "../common/Button";

interface RegistrationStatusProps {
  registration: Registration;
}

const RegistrationStatus = ({
  registration,
}: RegistrationStatusProps) => {
  return (
    <StyledRegistrationStatus isOpening={registration.isOpening}>
      {registration.isOpening ? (
        <>
          <span>Open - Auto close in </span>
          <Countdown
            date={registration.endDate}
            renderer={({ days, hours, minutes, seconds }) => (
              <TimeRemainContainer>
                <span>
                  {days} days {hours} hrs {minutes} min {seconds} sec
                </span>
              </TimeRemainContainer>
            )}
          />
        </>
      ) : (
        <span>Closed</span>
      )}
    </StyledRegistrationStatus>
  );
};

interface StyledRegistrationStatusProps {
  isOpening: boolean;
}

const StyledRegistrationStatus = styled.div<StyledRegistrationStatusProps>`
  border-radius: 4px;
  padding: 4px;
  text-transform: uppercase;
  background-color: ${({ isOpening }) =>
    isOpening ? "#44BD63" : "#F02849"};
  color: white;
  margin-top: 1rem;
  text-align: center;
`;

const TimeRemainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 0.4rem;
`;

export default RegistrationStatus;
