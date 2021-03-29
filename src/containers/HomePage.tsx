import React, { useState } from "react";
import styled from "styled-components";
import Table from "../components/common/Table";
import {
  FormControl,
  Select,
  MenuItem,
  Skeleton,
} from "@material-ui/core";
import Button from "../components/common/Button";
import { Teaching, Registration } from "../react-app-env";
import useFetchTeachings from "../hooks/useFetchTeachings";
import { Column } from "react-table";
import RegistrationStatus from "../components/HomePage/RegistrationStatus";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import useFetchRegistrations from "../hooks/useFetchRegistrations";
import { ReactComponent as NothingImage } from "../assets/images/nothing.svg";

type TeachingTable = {
  courseId: string;
  courseName: string;
  group: number;
  period: string;
  credit: number;
  numOfStudents: number;
};

const prepareData = (
  teachings: Teaching[]
): {
  data: TeachingTable[];
  columns: Array<Column<TeachingTable>>;
} => {
  let data: TeachingTable[];

  if (teachings.length > 0) {
    data = teachings.map((teaching) => {
      return {
        courseId: teaching.course._id,
        courseName: teaching.course.courseName,
        group: teaching.group,
        period: `${teaching.startPeriod} - ${teaching.endPeriod}`,
        credit: teaching.course.numberOfCredits,
        numOfStudents: teaching.numberOfStudents,
      };
    });
  } else {
    data = [];
  }

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

  return { data, columns };
};

const HomePage = () => {
  // state
  const [batch, setBatch] = useState(1);
  const semester = useSelector(
    (state: RootState) => state.semester.semester
  );
  const semesterStatus = useSelector(
    (state: RootState) => state.semester.status
  );

  // hooks
  const [registrations, registrationStatus] = useFetchRegistrations(
    semester?._id
  );
  const [teachings, teachingStatus] = useFetchTeachings(
    (registrations as Registration[]).find(
      (reg) => reg.batch === batch
    )?._id
  );

  // Prepare data for displaying
  const { data, columns } = prepareData(teachings as Teaching[]);

  const renderContent = () => {
    if (semesterStatus === "succeeded" && semester) {
      if (registrationStatus === "loading") {
        return (
          <Skeleton
            variant="rectangular"
            animation="wave"
            width={250}
          />
        );
      }
      if (
        registrationStatus === "succeeded" &&
        registrations.length === 0
      ) {
        return (
          <NotFoundContainer>
            <NothingImage />
            <span>There is no registration</span>
            <Button>Open registration</Button>
          </NotFoundContainer>
        );
      }
      if (
        registrationStatus === "succeeded" &&
        registrations.length > 0
      ) {
        return (
          <>
            <Toolbar>
              <Filter>
                <RegistrationText>
                  Registration batch
                </RegistrationText>
                <FormControl>
                  <Select
                    value={batch}
                    onChange={(e) =>
                      setBatch(e.target.value as number)
                    }
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
            <RegistrationStatus
              registration={
                (registrations as Registration[]).find(
                  (reg) => reg.batch === batch
                )!
              }
            />

            <TableContainer>
              {teachingStatus === "loading" ? (
                <SkeletonContainer>
                  <Skeleton
                    variant="rectangular"
                    height={40}
                    animation="wave"
                  />
                  <Skeleton
                    variant="rectangular"
                    height={40}
                    animation="wave"
                  />
                  <Skeleton
                    variant="rectangular"
                    height={40}
                    animation="wave"
                  />
                  <Skeleton
                    variant="rectangular"
                    height={40}
                    animation="wave"
                  />
                </SkeletonContainer>
              ) : (
                <Table<TeachingTable>
                  data={data}
                  columns={columns}
                  name="Teaching"
                />
              )}
            </TableContainer>
          </>
        );
      }
    } else {
      <NotFoundContainer>
        <NothingImage />
        <span>There is no semester</span>
        <Button>Open semester</Button>
      </NotFoundContainer>;
    }
  };

  return (
    <>
      <StyledHomePage>{renderContent()}</StyledHomePage>
    </>
  );
};

const StyledHomePage = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SkeletonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-row-gap: 1rem;
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
`;

export default HomePage;
