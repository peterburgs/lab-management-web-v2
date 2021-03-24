import React from "react";
import styled, { css } from "styled-components";
import Usage from "./Usage";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

const TimeTable = () => {
  return (
    <SimpleBar style={{ maxHeight: "calc(100%)" }}>
      <StyledTimeTable>
        <LabContainer>
          <Padding />
          <Lab>A1-101</Lab>
          <Lab>A1-101</Lab>
          <Lab>A1-101</Lab>
          <Lab>A1-101</Lab>
          <Lab>A1-101</Lab>
          <Lab>A1-101</Lab>
        </LabContainer>
        <UsageContainer>
          <DayOfWeek>Monday</DayOfWeek>
          <DayOfWeek>Tuesday</DayOfWeek>
          <DayOfWeek>Wednesday</DayOfWeek>
          <DayOfWeek>Thursday</DayOfWeek>
          <DayOfWeek>Friday</DayOfWeek>
          <DayOfWeek>Saturday</DayOfWeek>
          <Cell position={false}>
            <Usage
              startPeriod={1}
              endPeriod={3}
              courseName="Database Management System"
              lecturerName="Nguyen Thanh Son"
            />
          </Cell>
          <Cell position={false}>
            <Usage
              startPeriod={1}
              endPeriod={3}
              courseName="Database Management System"
              lecturerName="Nguyen Thanh Son"
            />
          </Cell>
          <Cell position={false}>
            <Usage
              startPeriod={1}
              endPeriod={3}
              courseName="Database Management System"
              lecturerName="Nguyen Thanh Son"
            />
          </Cell>
        </UsageContainer>
      </StyledTimeTable>
    </SimpleBar>
  );
};

const StyledTimeTable = styled.div`
  display: flex;
  width: 100%;
`;

const LabContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: sticky;
  left: 0;
`;

const Lab = styled.div`
  background-color: #0070f3;
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
  box-shadow: 0 4px 14px 0 rgb(0 118 255 / 39%);
`;

const UsageContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(6, minmax(auto, 1fr));
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
  box-shadow: 0 6px 8px -2px rgb(0 118 255 / 39%);
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
  position: boolean;
}

const Cell = styled.div<CellProps>`
  display: flex;
  ${({ position }) =>
    position &&
    css`
      grid-row: 3;
      grid-column: 3;
    `}
`;

export default TimeTable;
