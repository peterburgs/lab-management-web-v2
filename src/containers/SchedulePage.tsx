import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import TimeTable from "../components/schedule-page/TimeTable";
import Button from "../components/common/Button";
import { Skeleton } from "@material-ui/core";
import { api } from "../api";
import { ReactComponent as NothingImage } from "../assets/images/nothing.svg";

// import hooks
import useGetLabUsagesBySemester from "../hooks/schedule/useGetLabUsagesBySemester";
import useGetAllLabs from "../hooks/lab/useGetAllLabs";
import useGetAllCourses from "../hooks/course/useGetAllCourses";
import useGetAllUsers from "../hooks/user/useGetAllUsers";

// import model
import {
  LabUsage,
  Semester,
  Lab,
  Teaching,
  Course,
  User,
} from "../types/model";

// import type
import { GETResponse as SemesterGETResponse } from "../reducers/semesterSlice";
import { GETResponse as TeachingGETResponse } from "../reducers/teachingSlice";

const period2Shift = (start: number, end: number) => {
  if (start >= 1 && end <= 5) return 1;
  if (start >= 7 && end <= 11) return 2;
  if (start >= 12 && end <= 15) return 3;
  return 0;
};

const SchedulePage = () => {
  const [shift, setShift] = useState(1);
  const [week, setWeek] = useState(0);
  const [semesterId, setSemesterId] = useState<string>("semester-1");
  const [currentSemester, setCurrentSemester] = useState<Semester>(
    null!
  );
  const [teachings, setTeachings] = useState<Teaching[]>([]);
  const [currentLabUsages, setCurrentLabUsages] = useState<
    LabUsage[]
  >([]);

  // call hooks
  const [labUsages, scheduleStatus] =
    useGetLabUsagesBySemester(currentSemester);
  const [courses] = useGetAllCourses();
  const [users] = useGetAllUsers();
  const [labs] = useGetAllLabs();

  // useEffect
  useEffect(() => {
    (async () => {
      try {
        const res = (
          await api.get("/semesters", {
            params: { _id: semesterId },
          })
        ).data as SemesterGETResponse;

        if (res.semesters.length > 0) {
          setCurrentSemester(res.semesters[0]);
        }
      } catch (err) {
        console.log(err.message);
      }
    })();
  }, [semesterId]);

  useEffect(() => {
    if (labUsages) {
      console.log(labUsages);
      setCurrentLabUsages(
        (labUsages as LabUsage[]).filter(
          (labUsage) =>
            labUsage.weekNo === week &&
            (period2Shift(
              labUsage.startPeriod,
              labUsage.endPeriod
            ) === shift ||
              shift === 0)
        )
      );
    }
  }, [week, labUsages, shift]);

  useEffect(() => {
    (async () => {
      try {
        const res = (await api.get("/teachings"))
          .data as TeachingGETResponse;
        if (res.teachings.length > 0) {
          setTeachings(res.teachings);
        }
      } catch (err) {
        console.log(err.message);
      }
    })();
  }, []);

  // conditional render
  const renderContent = () => {
    if (scheduleStatus === "pending" || scheduleStatus === "idle") {
      return (
        <SkeletonContainer>
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
        </SkeletonContainer>
      );
    } else if (scheduleStatus === "succeeded") {
      return (
        <>
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
                  <MenuItem value={0}>All shift</MenuItem>
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
                  {currentSemester &&
                    [...Array(currentSemester.numberOfWeeks)].map(
                      (_, i) => (
                        <MenuItem value={i} key={i}>
                          {i}
                        </MenuItem>
                      )
                    )}
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel id="semester-label">Semester</InputLabel>
                <Select
                  labelId="semester-label"
                  id="semester-select"
                  value={semesterId}
                  onChange={(e) => setSemesterId(e.target.value)}
                  label="Semester"
                >
                  <MenuItem value={"semester-1"}>
                    Semester 2020-2021
                  </MenuItem>
                </Select>
              </FormControl>
            </Filter>
            <Action>
              <Button>Export theory rooms</Button>
              <Button>Add lab usage</Button>
            </Action>
          </Toolbar>
          <TableContainer>
            <TimeTable
              labUsages={currentLabUsages}
              labs={labs as Lab[]}
              courses={courses as Course[]}
              lecturers={users as User[]}
              teachings={teachings}
            />
          </TableContainer>
        </>
      );
    } else {
      return (
        <NotFoundContainer>
          <NothingImage />
          <span>There is no schedule yet</span>
        </NotFoundContainer>
      );
    }
  };

  return <StyledSchedulePage>{renderContent()}</StyledSchedulePage>;
};

const StyledSchedulePage = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Toolbar = styled.div`
  padding-top: 1rem;
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

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    row-gap: 1rem;
    width: 100%;
  }
`;

const SkeletonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-row-gap: 1rem;
`;

const TableContainer = styled.div`
  padding-top: 1rem;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const NotFoundContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  height: 100%;
  flex-direction: column;
  svg {
    max-width: 550px;
    height: auto;
  }

  span {
    font-weight: 500;
    font-size: 25px;
    margin-top: 1rem;
  }

  button {
    margin-top: 1rem;
  }

  @media (max-width: 600px) {
    svg {
      max-width: 300px;
      height: auto;
    }
  }
`;

export default SchedulePage;
