import React from "react";
import styled from "styled-components";

interface UsageInfoProps {
  startPeriod: number;
  endPeriod: number;
  courseName: string;
  weekNo: number;
  labName: string;
  dayOfWeek: number;
}

const UsageInfo = ({
  startPeriod,
  endPeriod,
  courseName,
  weekNo,
  labName,
  dayOfWeek,
}: UsageInfoProps) => {
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

  const dowNum2String = (dow: number) => {
    switch (dow) {
      case 0:
        return "Monday";
      case 1:
        return "Tuesday";
      case 2:
        return "Wednesday";
      case 3:
        return "Thursday";
      case 4:
        return "Friday";
      case 5:
        return "Saturday";
      case 6:
        return "Sunday";
    }
  };

  return (
    <StyledUsage shift={convertPeriodToShift(startPeriod, endPeriod)}>
      <Text>Lab: {labName} |</Text>
      <Text>Course: {courseName} |</Text>
      <Text>Week: {weekNo} |</Text>
      <Text>Day: {dowNum2String(dayOfWeek)} |</Text>
      <Text>{`Period: ${startPeriod} - ${endPeriod}`}</Text>
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
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 6px;
`;

const Text = styled.span`
  font-weight: 500;
  font-size: 14px;
  margin-right: 0.4rem;
`;

export default UsageInfo;
