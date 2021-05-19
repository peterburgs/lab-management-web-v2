import React from "react";
import styled from "styled-components";
import { Registration, ROLES } from "../../types/model";
import Countdown from "react-countdown";
import { useAppSelector } from "../../store";

interface RegistrationStatusProps {
  registration: Registration;
  onCloseBtnClick?: () => void;
}

const RegistrationStatus = ({
  registration,
  onCloseBtnClick,
}: RegistrationStatusProps) => {
  const role = useAppSelector((state) => state.auth.verifiedRole);

  return (
    <StyledRegistrationStatus isOpening={registration.isOpening}>
      {registration.isOpening ? (
        <>
          <Text>OPENING</Text>
          <Countdown
            date={registration.endDate}
            renderer={({ days, hours, minutes, seconds }) => (
              <TimeRemainContainer>
                <span>
                  Time left: {days} days {hours} hours {minutes} min {seconds} sec
                </span>
              </TimeRemainContainer>
            )}
          />
          {role === ROLES.ADMIN && (
            <Overlay>
              <CloseRegistrationButton onClick={onCloseBtnClick}>
                Close now
              </CloseRegistrationButton>
            </Overlay>
          )}
        </>
      ) : (
        <Text>CLOSED</Text>
      )}
    </StyledRegistrationStatus>
  );
};

interface StyledRegistrationStatusProps {
  isOpening: boolean;
}

const Text = styled.div`
  color: white;
`;

const TimeRemainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 0.4rem;
  color: white;
`;

const Overlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.lightRed};
  opacity: 0.9;
  overflow: hidden;
  width: 100%;
  height: 0;
  transition: 0.5s ease;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CloseRegistrationButton = styled.button`
  background-color: ${({ theme }) => theme.red};
  margin: 0;
  padding: 0.5rem 2rem;
  max-height: 1.5rem;
  border-radius: 7px;
  color: ${({ theme }) => theme.red};
  align-items: center;
  justify-content: center;
  border: ${({ theme }) => `1px solid ${theme.red}`};
  text-decoration: none;
  cursor: pointer;
  display: inline-flex;
  position: relative;
  outline: none;
  font-size: 14px;
  transition: background 0.2s ease 0s, color 0.2s ease 0s;
  color: white;

  &:active {
    transform: scale(0.98);
  }
`;

const StyledRegistrationStatus = styled.div<StyledRegistrationStatusProps>`
  border-radius: 4px;
  padding: 4px;
  background-color: ${({ isOpening, theme }) =>
    isOpening ? theme.green : theme.red};
  margin-top: 1rem;
  text-align: center;
  position: relative;

  &:hover {
    ${Overlay} {
      height: 100%;
    }
  }
`;

export default RegistrationStatus;
