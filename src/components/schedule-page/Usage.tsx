import React from "react";
import styled from "styled-components";
import { useAppSelector } from "../../store";
import { ROLES } from "../../types/model";
import OccupiedImage from "../../assets/images/occupied.png";
import moment from "moment";

interface UsageProps {
  startPeriod: number;
  endPeriod: number;
  courseName: string;
  lecturerName: string;
  id: string;
  lecturerId: string;
  checkInAt?: Date;
  checkOutAt?: Date;
  onEditLabUsage: (id: string) => void;
  onRequestModifyLabUsage: (id: string) => void;
}

const Usage = ({
  startPeriod,
  endPeriod,
  courseName,
  lecturerName,
  id,
  lecturerId,
  onEditLabUsage,
  onRequestModifyLabUsage,
  checkInAt,
  checkOutAt,
}: UsageProps) => {
  const convertPeriodToShift = (
    startPeriod: number,
    endPeriod: number
  ) => {
    if (startPeriod >= 1 && endPeriod <= 5) {
      return 1;
    } else if (startPeriod >= 6 && endPeriod <= 12) {
      return 2;
    } else {
      return 3;
    }
  };

  const role = useAppSelector((state) => state.auth.verifiedRole);
  const user = useAppSelector((state) => state.auth.verifiedUser);

  return (
    <StyledUsage shift={convertPeriodToShift(startPeriod, endPeriod)}>
      {role === ROLES.ADMIN ? (
        <>
          <CourseName>{courseName}</CourseName>
          <LecturerName>{lecturerName}</LecturerName>
          <Period>{`Period: ${startPeriod} - ${endPeriod}`}</Period>
          <CheckIn>
            Check in:{" "}
            {checkInAt
              ? moment(new Date(checkInAt)).format(
                  "HH:mm:ss DD/MM/YYYY"
                )
              : "pending"}
          </CheckIn>
          <CheckOut>
            Check out:{" "}
            {checkInAt
              ? checkOutAt
                ? moment(new Date(checkOutAt)).format(
                    "HH:mm:ss DD/MM/YYYY"
                  )
                : "pending"
              : "check in required"}
          </CheckOut>
        </>
      ) : lecturerId === user?._id ? (
        <>
          <CourseName>{courseName}</CourseName>
          <LecturerName>{lecturerName}</LecturerName>
          <Period>{`Period: ${startPeriod} - ${endPeriod}`}</Period>
          <CheckIn>
            Check in:{" "}
            {checkInAt
              ? moment(new Date(checkInAt)).format(
                  "HH:mm:ss DD/MM/YYYY"
                )
              : "pending"}
          </CheckIn>
          <CheckOut>
            Check out:{" "}
            {checkInAt
              ? checkOutAt
                ? moment(new Date(checkOutAt)).format(
                    "HH:mm:ss DD/MM/YYYY"
                  )
                : "pending"
              : "pending"}
          </CheckOut>
        </>
      ) : (
        <Text>OCCUPIED</Text>
      )}

      <ActionButtonContainer>
        {role === ROLES.ADMIN ? (
          <>
            <ActionButton onClick={() => onEditLabUsage(id)}>
              Edit
            </ActionButton>
            <ActionButton>Delete</ActionButton>
          </>
        ) : lecturerId === user?._id ? (
          <ActionButton onClick={() => onRequestModifyLabUsage(id)}>
            Change lab usage
          </ActionButton>
        ) : null}
      </ActionButtonContainer>
    </StyledUsage>
  );
};

interface StyledUsageProps {
  shift: number;
}

const StyledUsage = styled.div<StyledUsageProps>`
  background: ${({ shift }) =>
    shift === 1 ? "#C70039" : shift === 2 ? "#16C79A" : "#0075F6"};
  border-left: ${({ shift }) =>
    shift === 1
      ? "3px solid #810000"
      : shift === 2
      ? "3px solid #02383C"
      : "3px solid #0900C3"};
  height: 180px;
  display: flex;
  flex-direction: column;
  min-width: 150px;
  border-radius: 4px;
  padding: 4px;
  margin-right: 0.5rem;
  position: relative;

  &:hover {
    & > div {
      display: flex;
    }
  }
`;

const CourseName = styled.span`
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 0.5rem;
  color: white;
`;

const LecturerName = styled.span`
  font-size: 13px;
  margin-bottom: 0.5rem;
  font-style: italic;
  color: white;
`;

const Period = styled.span`
  font-size: 12px;
  margin-bottom: 0.5rem;
  color: white;
`;

const ActionButtonContainer = styled.div`
  display: none;
  right: 8px;
  position: absolute;
  bottom: 8px;
`;

const ActionButton = styled.button`
  outline: none;
  background: transparent;
  color: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.8);
  cursor: pointer;
  opacity: 0.5;
  margin: 0 2px;

  &:active {
    background-color: rgba(0, 0, 0, 0.8);
    transform: scale(0.98);
    &:hover {
      background-color: rgba(0, 0, 0, 0.8);
    }
  }

  &:hover {
    background-color: black;
    color: white;
  }
`;

const Text = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: italic;
  font-size: 18px;
  color: ${({ theme }) => theme.red};
`;

const CheckIn = styled.div`
  font-size: 13px;
  margin-bottom: 0.5rem;
  font-style: italic;
  color: white;
`;

const CheckOut = styled.div`
  font-size: 13px;
  margin-bottom: 0.5rem;
  font-style: italic;
  color: white;
`;

export default Usage;
