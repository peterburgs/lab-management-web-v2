import React, { useRef, useEffect } from "react";
import styled, { css } from "styled-components";
import Usage from "./Usage";
import "simplebar/dist/simplebar.min.css";
import {
  Course,
  Lab,
  LabUsage,
  Teaching,
  User,
} from "../../types/model";

interface TimeTableProps {
  labUsages: LabUsage[];
  labs: Lab[];
  courses: Course[];
  lecturers: User[];
  teachings: Teaching[];
}

const TimeTable = ({
  labUsages,
  labs,
  courses,
  lecturers,
  teachings,
}: TimeTableProps) => {
  const renderUsages = () => {
    const cells: JSX.Element[] = [];
    for (let lab of labs) {
      const usages = labUsages.filter(
        (usage) => usage.lab === lab._id
      );
      if (usages.length > 0) {
        // Get usages that have the same dayOfWeek
        const usagesByDayOfWeek: Map<number, LabUsage[]> = new Map();
        for (let i = 0; i < 7; i++) {
          for (let usage of usages) {
            if (usage.dayOfWeek === i) {
              let dayOfWeekUsages = usagesByDayOfWeek.get(i)!;
              if (!dayOfWeekUsages) {
                dayOfWeekUsages = [];
                dayOfWeekUsages.push(usage);
              } else {
                dayOfWeekUsages.push(usage);
              }
              usagesByDayOfWeek.set(i, dayOfWeekUsages);
            }
          }
        }
        console.log(usagesByDayOfWeek);
        usagesByDayOfWeek.forEach((usages, dayOfWeek) => {
          cells.push(
            <Cell
              key={lab._id + dayOfWeek}
              position={{
                row: labs.indexOf(lab) + 2,
                column: dayOfWeek + 1,
              }}
            >
              {usages.map((usage) => (
                <Usage
                  key={usage._id}
                  startPeriod={usage.startPeriod}
                  endPeriod={usage.endPeriod}
                  courseName={
                    courses.find(
                      (course) =>
                        course._id ===
                        teachings.find(
                          (teaching) =>
                            teaching._id === usage.teaching
                        )!.course
                    )!.courseName
                  }
                  lecturerName={
                    lecturers.find(
                      (lecturer) =>
                        lecturer._id ===
                        teachings.find(
                          (teaching) =>
                            teaching._id === usage.teaching
                        )!.user
                    )!.fullName
                  }
                />
              ))}
            </Cell>
          );
        });
      }
    }
    console.log(cells);
    return cells;
  };

  return (
    <StyledTimeTable>
      <LabContainer>
        <Padding />
        {labs.map((lab) => (
          <LabName key={lab._id}>{lab.labName}</LabName>
        ))}
      </LabContainer>
      <UsageContainer>
        <DayOfWeek>Monday</DayOfWeek>
        <DayOfWeek>Tuesday</DayOfWeek>
        <DayOfWeek>Wednesday</DayOfWeek>
        <DayOfWeek>Thursday</DayOfWeek>
        <DayOfWeek>Friday</DayOfWeek>
        <DayOfWeek>Saturday</DayOfWeek>
        <DayOfWeek>Sunday</DayOfWeek>
        {renderUsages()}
      </UsageContainer>
    </StyledTimeTable>
  );
};

const StyledTimeTable = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  overflow: auto;
`;

const LabContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: sticky;
  left: 0;
  z-index: 2;
`;

const LabName = styled.div`
  background-color: ${({ theme }) => theme.blue};
  border-radius: 4px;
  padding: 0px 5px;
  color: white;
  font-size: 13px;
  min-height: 130px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  min-width: 60px;
  box-shadow: ${({ theme }) => theme.blueShadow};
`;

const UsageContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(7, minmax(auto, 1fr));
  grid-template-rows: 50px;
  grid-auto-rows: 145px;
  margin-left: 1rem;
`;

const DayOfWeek = styled.div`
  font-weight: 500;
  padding: 5px 5px;
  position: sticky;
  top: 0;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: ${({ theme }) => theme.blueShadow};
  margin-bottom: 10px;
  z-index: 2;
`;

const Padding = styled.div`
  position: sticky;
  left: 0;
  top: 0;
  padding: 25px 0px;
  background: white;
`;

interface CellProps {
  position: { row: number; column: number };
}

const Cell = styled.div<CellProps>`
  display: flex;
  grid-row: ${({ position }) => position.row};
  grid-column: ${({ position }) => position.column};
`;

export default TimeTable;
