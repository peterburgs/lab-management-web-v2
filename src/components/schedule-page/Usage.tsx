import React from "react";
import styled from "styled-components";

interface UsageProps {
  startPeriod: number;
  endPeriod: number;
  courseName: string;
  lecturerName: string;
  id: string;
  onEditLabUsage: (id: string) => void;
}

const Usage = ({
  startPeriod,
  endPeriod,
  courseName,
  lecturerName,
  id,
  onEditLabUsage,
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

  return (
    <StyledUsage shift={convertPeriodToShift(startPeriod, endPeriod)}>
      <CourseName>{courseName}</CourseName>
      <LecturerName>{lecturerName}</LecturerName>
      <Period>{`Period: ${startPeriod} - ${endPeriod}`}</Period>
      <ActionButtonContainer>
        <ActionButton onClick={() => onEditLabUsage(id)}>
          Edit
        </ActionButton>
        <ActionButton>Delete</ActionButton>
      </ActionButtonContainer>
    </StyledUsage>
  );
};

interface StyledUsageProps {
  shift: number;
}

const StyledUsage = styled.div<StyledUsageProps>`
  background: ${({ shift }) =>
    shift === 1 ? "#ffe5ec" : shift === 2 ? "#D7F2FF" : "#EEEAF7"};
  border-left: ${({ shift }) =>
    shift === 1
      ? "3px solid rgb(254,63,113)"
      : shift === 2
      ? "3px solid rgb(74,137,162)"
      : "3px solid rgb(101,55,192)"};
  height: 130px;
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
`;

const LecturerName = styled.span`
  font-size: 13px;
  margin-bottom: 0.5rem;
  font-style: italic;
`;

const Period = styled.span`
  font-size: 12px;
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

export default Usage;
