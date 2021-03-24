import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Table from "../components/common/Table";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import Button from "../components/common/Button";
import EditIcon from "@material-ui/icons/Edit";
import EditSemesterModal from "../components/HomePage/EditSemesterModal";
import { Teaching } from "../react-app-env";
import { useSelector } from "react-redux";
import { fetchTeachings } from "../reducers/TeachingSlice";
import { Skeleton } from "@material-ui/core";
import { RootState } from "../store";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "../store";
import { ReactComponent as Speaker } from "../assets/images/speaker.svg";

type TeachingTable = {
  courseId: string;
  courseName: string;
  group: number;
  period: string;
  credit: number;
  numOfStudents: number;
};

const HomePage = () => {
  // state
  const dispatch = useAppDispatch();
  const [batch, setBatch] = useState(1);
  const [showEditSemesterModal, setShowEditSemesterModal] = useState(
    false
  );
  const teachings = useSelector(
    (state: RootState) => state.teachings.teachings
  );
  const teachingStatus = useSelector(
    (state: RootState) => state.teachings.status
  );

  const prepareTeachings = (
    teachings: Teaching[]
  ): TeachingTable[] => {
    if (teachings.length > 0) {
      return teachings.map((teaching) => {
        return {
          courseId: teaching.course._id,
          courseName: teaching.course.courseName,
          group: teaching.group,
          period: `${teaching.startPeriod} - ${teaching.endPeriod}`,
          credit: teaching.course.numberOfCredits,
          numOfStudents: teaching.numberOfStudents,
        };
      });
    }
    return [];
  };

  const columns = [
    {
      Header: "Course ID",
      accessor: "courseId" as const,
    },
    {
      Header: "Course Name",
      accessor: "courseName" as const,
    },
    {
      Header: "Group",
      accessor: "group" as const,
    },
    {
      Header: "Period",
      accessor: "period" as const,
    },
    {
      Header: "Credits",
      accessor: "credit" as const,
    },
    {
      Header: "Number of students",
      accessor: "numOfStudents" as const,
    },
  ];

  useEffect(() => {
    if (teachingStatus === "idle") {
      (async () => {
        try {
          const actionResult = await dispatch(fetchTeachings());
          unwrapResult(actionResult);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [teachingStatus, dispatch]);

  return (
    <>
      <EditSemesterModal
        showModal={showEditSemesterModal}
        setShowModal={setShowEditSemesterModal}
        name="Edit Semester"
      />
      <StyledHomePage>
        <Header>
          <Semester>
            <SemesterText>
              <div>Semester 2020-2021</div>
              <Tooltip title="Edit semester">
                <IconButton
                  onClick={() => setShowEditSemesterModal(true)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </SemesterText>
            <SemesterInfo>
              <div>{`Start date: ${new Date().toUTCString()}`}</div>
              <div>Number of weeks: 15</div>
            </SemesterInfo>
          </Semester>
          <CurrentOpenRegistration>
            <Image>
              <Speaker />
            </Image>
            Registration batch 1 will be closed in 1 day
            <CloseRegistrationButton>
              Close Now!
            </CloseRegistrationButton>
          </CurrentOpenRegistration>
        </Header>

        <Toolbar>
          <Filter>
            <RegistrationText>Registration batch</RegistrationText>
            <FormControl>
              <Select
                value={batch}
                onChange={(e) => setBatch(e.target.value as number)}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
              </Select>
            </FormControl>
          </Filter>
          <Action>
            <StyledButton>Generate schedule</StyledButton>
          </Action>
        </Toolbar>
        <TableContainer>
          {teachingStatus === "loading" ? (
            <Skeleton
              variant="rectangular"
              height={440}
              animation="wave"
            />
          ) : (
            <Table<TeachingTable>
              data={prepareTeachings(teachings)}
              columns={columns}
              name="Teaching"
            />
          )}
        </TableContainer>
      </StyledHomePage>
    </>
  );
};

const StyledHomePage = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SemesterText = styled.div`
  font-size: 18px;
  font-weight: 500;
  display: flex;
  align-items: center;

  & > button {
    padding: 3px;
    svg {
      fill: #0070f3;
    }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Semester = styled.div`
  display: flex;
  flex-direction: column;
`;

const CurrentOpenRegistration = styled.div`
  height: 100%;
  width: 250px;
  border: 1px solid #dedede;
  border-radius: 3px;
  padding: 12px;
  font-size: 13px;
  font-weight: 400;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  line-height: 1.25rem;
`;

const StyledButton = styled(Button)`
  width: 250px;
`;

const RegistrationText = styled.div`
  font-size: 15px;
  font-weight: 500;
  display: flex;
  align-items: center;
  margin-right: 7px;
  padding-bottom: 7px;
`;

const TableContainer = styled.div`
  padding-top: 1rem;
  height: 100%;
  overflow-x: hidden;
`;

const SemesterInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 0.5rem;
  color: rgba(0, 0, 0, 0.5);
  font-size: 15px;
  div {
    margin-bottom: 0.3rem;
  }
`;

const Toolbar = styled.div`
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;

  @media (max-width: 600px) {
    display: inline-flex;
    flex-wrap: wrap;
    ${StyledButton} {
      width: 180px;
    }
    & > div {
      margin: 6px;
    }
  }
`;

const Filter = styled.div`
  display: flex;
`;

const Action = styled.div`
  display: grid;
  column-gap: 1rem;
  grid-template-columns: 1fr;
  font-size: 0.875rem;
`;

const Image = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  svg {
    width: 40px;
    height: 40px;
  }
`;

const CloseRegistrationButton = styled.button`
  background-color: transparent;
  margin: 0;
  padding: 0 2rem;
  height: 2rem;
  border-radius: 7px;
  color: red;
  align-items: center;
  justify-content: center;
  border: 1px solid red;
  text-decoration: none;
  cursor: pointer;
  display: inline-flex;
  position: relative;
  outline: none;
  font-size: 14px;
  margin-top: 0.5rem;
  transition: background 0.2s ease 0s, color 0.2s ease 0s;

  &:hover {
    background-color: red;
    color: white;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default HomePage;
