import React, { useState } from "react";
import styled from "styled-components";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import TimeTable from "../components/SchedulePage/TimeTable";
import Button from "../components/common/Button";

enum ViewMode {
  LAB_USAGE,
  THEORY_ROOM_USAGE,
}

const SchedulePage = () => {
  const [shift, setShift] = useState(1);
  const [week, setWeek] = useState(1);
  const [mode, setMode] = useState<ViewMode>(ViewMode.LAB_USAGE);

  return (
    <StyledSchedulePage>
      <Toolbar>
        <Filter>
          <FormControl>
            <InputLabel id="shift-label">Shift</InputLabel>
            <Select
              labelId="shift-label"
              id="shift-select"
              value={shift}
              onChange={(e) => setShift(e.target.value as number)}
              label="Shift"
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel id="shift-label">Week</InputLabel>
            <Select
              labelId="week-label"
              id="week-select"
              value={week}
              onChange={(e) => setWeek(e.target.value as number)}
              label="Week"
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel id="mode-label">Mode</InputLabel>
            <Select
              labelId="mode-label"
              id="mode-select"
              value={mode}
              onChange={(e) => setMode(e.target.value as ViewMode)}
              label="Mode"
            >
              <MenuItem value={ViewMode.LAB_USAGE}>
                Lab usage
              </MenuItem>
              <MenuItem value={ViewMode.THEORY_ROOM_USAGE}>
                Theory room usage
              </MenuItem>
            </Select>
          </FormControl>
        </Filter>
        <Action>
          <Button>Export theory rooms</Button>
          <Button>Add extra class</Button>
        </Action>
      </Toolbar>
      <TableContainer>
        <TimeTable />
      </TableContainer>
    </StyledSchedulePage>
  );
};

const StyledSchedulePage = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Toolbar = styled.div`
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;

  @media (max-width: 900px) {
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: center;
    & > div {
      margin: 6px;
    }
  }
`;

const Filter = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 1rem;
`;

const Action = styled.div`
  display: grid;
  column-gap: 1rem;
  grid-template-columns: 1fr 1fr;
  font-size: 0.875rem;
`;

const TableContainer = styled.div`
  padding-top: 1rem;
  height: 100%;
  overflow: hidden;
`;

export default SchedulePage;
