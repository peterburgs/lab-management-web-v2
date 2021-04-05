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
import {
  Teaching,
  Registration,
  Course,
  User,
  Semester,
} from "../react-app-env";
import useFetchTeachings from "../hooks/teaching/useFetchTeachings";
import { Column } from "react-table";
import RegistrationStatus from "../components/home-page/RegistrationStatus";
import useFetchRegistrations from "../hooks/registration/useFetchRegistrations";
import { ReactComponent as NothingImage } from "../assets/images/nothing.svg";
import StartSemesterModal from "../components/home-page/StartSemesterModal";
import useFetchCourses from "../hooks/course/useFetchCourses";
import useFetchUsers from "../hooks/user/useFetchUsers";
import useFetchSemester from "../hooks/semester/useFetchSemester";

type TeachingTable = {
  courseId: string;
  courseName: string;
  group: number;
  period: string;
  credit: number;
  numOfStudents: number;
  lecturer: string;
};

const prepareData = (
  teachings: Teaching[],
  courses: Course[],
  users: User[]
): {
  data: TeachingTable[];
} => {
  let data: TeachingTable[];

  if (teachings.length > 0) {
    data = teachings.map((teaching) => {
      return {
        courseId: teaching.course,
        courseName: courses.find((c) => c._id === teaching.course)!
          .courseName,
        group: teaching.group,
        period: `${teaching.startPeriod} - ${teaching.endPeriod}`,
        credit: courses.find((c) => c._id === teaching.course)!
          .numberOfCredits,
        numOfStudents: teaching.numberOfStudents,
        lecturer: users.find((c) => c._id === teaching.user)!
          .fullName,
      };
    });
  } else {
    data = [];
  }

  return { data };
};

const HomePage = () => {
  // state
  const [batch, setBatch] = useState(1);
  const [showStartSemesterModal, setShowSemesterModal] = useState(
    false
  );

  // hooks
  // * Call API
  const [semester, semesterStatus] = useFetchSemester();
  const [registrations, registrationStatus] = useFetchRegistrations(
    (semester as Semester)?._id
  );
  const [teachings, teachingStatus] = useFetchTeachings(
    registrations as Registration[],
    batch
  );
  const [courses, courseStatus] = useFetchCourses();
  const [users, userStatus] = useFetchUsers();

  const renderTable = () => {
    const columns: Array<Column<TeachingTable>> = [
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
      {
        Header: "Lecturer",
        accessor: "lecturer" as const,
      },
    ];
    if (courseStatus === "succeeded" && userStatus === "succeeded") {
      const { data } = prepareData(
        teachings as Teaching[],
        courses as Course[],
        users as User[]
      );
      if (teachingStatus === "succeeded") {
        return (
          <Table<TeachingTable>
            data={data}
            columns={columns}
            name="Teaching"
          />
        );
      } else if (teachingStatus === "failed") {
        const data: TeachingTable[] = [];
        return (
          <Table<TeachingTable>
            data={data}
            columns={columns}
            name="Teaching"
          />
        );
      } else {
        return (
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
        );
      }
    } else if (courseStatus === "failed" || userStatus === "failed") {
      const data: TeachingTable[] = [];
      return (
        <Table<TeachingTable>
          data={data}
          columns={columns}
          name="Teaching"
        />
      );
    } else {
      return (
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
      );
    }
  };

  const renderContent = () => {
    if (semesterStatus === "succeeded") {
      if (registrationStatus === "pending") {
        return (
          <Skeleton
            variant="rectangular"
            animation="wave"
            width={250}
          />
        );
      }
      if (registrationStatus === "failed") {
        return (
          <NotFoundContainer>
            <NothingImage />
            <span>There is no registration</span>
            <Button>Open registration</Button>
          </NotFoundContainer>
        );
      }
      if (registrationStatus === "succeeded") {
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
                    {(registrations as Registration[]).map((reg) => (
                      <MenuItem value={reg.batch} key={reg._id}>
                        {reg.batch}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Filter>

              <Action>
                <Button
                  disabled={
                    (registrations as Registration[]).findIndex(
                      (reg) => reg.isOpening === true
                    ) !== -1
                  }
                >
                  Open registration
                </Button>
                <Button>Generate schedule</Button>
              </Action>
            </Toolbar>
            <RegistrationStatus
              registration={
                (registrations as Registration[]).find(
                  (reg) => reg.batch === batch
                )!
              }
            />

            <TableContainer>{renderTable()}</TableContainer>
          </>
        );
      }
    } else if (semesterStatus === "failed") {
      return (
        <NotFoundContainer>
          <NothingImage />
          <span>There is no semester</span>
          <Button onClick={() => setShowSemesterModal(true)}>
            Start semester
          </Button>
        </NotFoundContainer>
      );
    }
  };

  return (
    <>
      <StartSemesterModal
        name="Start semester"
        showModal={showStartSemesterModal}
        setShowModal={setShowSemesterModal}
      />
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
  width: 100%;
  overflow: hidden;
`;

const Toolbar = styled.div`
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;

  @media (max-width: 600px) {
    display: inline-flex;
    flex-wrap: wrap;
    & > div {
      margin-bottom: 6px;
    }
  }
`;

const Filter = styled.div`
  display: flex;
`;

const Action = styled.div`
  display: grid;
  column-gap: 1rem;
  grid-template-columns: 1fr 1fr;
  font-size: 0.875rem;
  margin-left: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    row-gap: 0.5rem;
    width: 100%;
    margin: 0;

    button {
      width: 100%;
    }
  }
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

export default HomePage;
