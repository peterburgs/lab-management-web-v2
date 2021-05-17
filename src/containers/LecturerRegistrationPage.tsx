import React, { useEffect, useState } from "react";
import styled from "styled-components";
// import components
import Table from "../components/common/Table";
import { Skeleton } from "@material-ui/core";
import Button from "../components/common/Button";
import { Column } from "react-table";
import RegistrationStatus from "../components/common/RegistrationStatus";
import { ReactComponent as NothingImage } from "../assets/images/nothing.svg";
import AddIcon from "@material-ui/icons/Add";
import EditTeachingModal from "../components/lecturer-registration-page/EditTeachingModal";
import PrivateRoute from "../containers/PrivateRoute";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import ImportPanel from "../components/lecturer-registration-page/ImportPanel";

// Import modal
import NewTeachingModal from "../components/lecturer-registration-page/NewTeachingModal";
import DeleteTeachingModal from "../components/lecturer-registration-page/DeleteTeachingModal";
import ImportTeachingModal from "../components/lecturer-registration-page/ImportTeachingModal";

// import models
import { Teaching, Course, ROLES } from "../types/model";

// import hooks
import useFetchTeachingsByOpenRegistrationAndUser from "../hooks/teaching/useGetTeachingsByRegistrationAndUser";
import { useAppSelector } from "../store";
import useGetAllCourses from "../hooks/course/useGetAllCourses";
import { useHistory } from "react-router";

// Table type
type TeachingTable = {
  rowId: string;
  teachingId: string;
  courseName: string;
  group: number;
  period: string;
  numOfStudents: number;
  dayOfWeek: string;
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

// prepare data for the table
const prepareData = (
  teachings: Teaching[],
  courses: Course[]
): {
  data: TeachingTable[];
} => {
  let data: TeachingTable[];

  if (teachings.length > 0 && courses.length > 0) {
    console.log(teachings);
    data = teachings.map((teaching) => {
      return {
        rowId: teaching._id,
        teachingId: teaching._id,
        courseName: courses.find((c) => c._id === teaching.course)!
          .courseName,
        group: teaching.group,
        period: `${teaching.startPeriod} - ${teaching.endPeriod}`,
        numOfStudents: teaching.numberOfStudents,
        dayOfWeek: dowNum2String(teaching.dayOfWeek)!,
      };
    });
  } else {
    data = [];
  }

  return { data };
};

const LecturerRegistrationPage = () => {
  // state
  const [showNewTeachingModal, setShowNewTeachingModal] =
    useState(false);
  const [showDeleteTeachingModal, setShowDeleteTeachingModal] =
    useState(false);
  const [teachingIdToDelete, setTeachingIdToDelete] =
    useState<string>(null!);
  const [showImportPanel, setShowImportPanel] = useState(false);
  const [showImportTeachingModal, setShowImportTeachingModal] =
    useState(false);

  // call hooks
  const semesterStatus = useAppSelector(
    (state) => state.semesters.status
  );
  const openRegistration = useAppSelector((state) =>
    state.registrations.registrations.find(
      (reg) => reg.isOpening === true
    )
  );
  const registrationStatus = useAppSelector(
    (state) => state.registrations.status
  );
  const verifiedUser = useAppSelector(
    (state) => state.auth.verifiedUser
  );
  const [teachings, teachingStatus] =
    useFetchTeachingsByOpenRegistrationAndUser(
      openRegistration,
      verifiedUser
    );
  const [courses, courseStatus] = useGetAllCourses();
  const teachingSearchText = useAppSelector(
    (state) => state.search.teachingSearchText
  );
  const history = useHistory();

  // conditional renderer
  const renderTable = () => {
    const columns: Array<Column<TeachingTable>> = [
      {
        Header: "Row ID",
        accessor: "rowId" as const,
      },
      {
        Header: "Teaching ID",
        accessor: "teachingId" as const,
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
        Header: "Day of week",
        accessor: "dayOfWeek" as const,
      },
      {
        Header: "Period",
        accessor: "period" as const,
      },
      {
        Header: "Number of students",
        accessor: "numOfStudents" as const,
      },
    ];

    if (courseStatus === "succeeded") {
      const { data } = prepareData(
        (teachings as Teaching[]).filter((item) => {
          if (teachingSearchText === "") return true;
          return (
            (item.course as string).includes(teachingSearchText) ||
            (courses as Course[])
              .find((course) => course._id === item.course)
              ?.courseName.toLowerCase()
              .includes(teachingSearchText.toLowerCase())
          );
        }),
        courses as Course[]
      );
      if (teachingStatus === "succeeded") {
        return (
          <Table<TeachingTable>
            data={data}
            columns={columns}
            name="Teaching"
            onClickEditBtn={(id) =>
              history.push(`/registration/teachings/${id}`)
            }
            onClickDeleteBtn={(id) => {
              setShowDeleteTeachingModal(true);
              setTeachingIdToDelete(id);
            }}
            isAllowEditDelete={true}
          />
        );
      } else if (teachingStatus === "failed") {
        const data: TeachingTable[] = [];
        return (
          <Table<TeachingTable>
            data={data}
            columns={columns}
            name="Teaching"
            onClickEditBtn={(id) =>
              history.push(`/registration/teachings/${id}`)
            }
            onClickDeleteBtn={(id) => {
              setShowDeleteTeachingModal(true);
              setTeachingIdToDelete(id);
            }}
            isAllowEditDelete={true}
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
    } else if (courseStatus === "failed") {
      const data: TeachingTable[] = [];
      return (
        <Table<TeachingTable>
          data={data}
          columns={columns}
          name="Teaching"
          onClickEditBtn={(id) =>
            history.push(`/registration/teachings/${id}`)
          }
          onClickDeleteBtn={(id) => {
            setShowDeleteTeachingModal(true);
            setTeachingIdToDelete(id);
          }}
          isAllowEditDelete={true}
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
          </NotFoundContainer>
        );
      }
      if (registrationStatus === "succeeded") {
        if (openRegistration) {
          return (
            <>
              <Toolbar>
                <Filter>
                  <RegistrationText>
                    Registration batch {openRegistration.batch}
                  </RegistrationText>
                  <RegistrationDuration>
                    (
                    {new Date(
                      openRegistration.startDate
                    ).toDateString()}{" "}
                    -{" "}
                    {new Date(
                      openRegistration.endDate
                    ).toDateString()}
                    )
                  </RegistrationDuration>
                </Filter>
                <Action>
                  <Button
                    onClick={() =>
                      setShowImportPanel((current) => !current)
                    }
                    icon={<ImportExportIcon />}
                  >
                    Import teachings
                  </Button>
                  {showImportPanel && (
                    <ImportPanelContainer>
                      <ImportPanel
                        setShowImportTeachingModal={
                          setShowImportTeachingModal
                        }
                      />
                    </ImportPanelContainer>
                  )}
                  <Button
                    onClick={() => setShowNewTeachingModal(true)}
                    icon={<AddIcon />}
                  >
                    New teaching
                  </Button>
                </Action>
              </Toolbar>
              <RegistrationStatus registration={openRegistration} />

              <TableContainer>{renderTable()}</TableContainer>
            </>
          );
        } else {
          return (
            <NotFoundContainer>
              <NothingImage />
              <span>There is no opening registration yet</span>
            </NotFoundContainer>
          );
        }
      }
    } else if (semesterStatus === "failed") {
      return (
        <NotFoundContainer>
          <NothingImage />
          <span>There is no semester</span>
        </NotFoundContainer>
      );
    }
  };

  return (
    <>
      <PrivateRoute
        roles={[ROLES.ADMIN, ROLES.LECTURER]}
        path="/registration/teachings/:id"
        exact={false}
        component={
          <EditTeachingModal
            showModal={true}
            setShowModal={() => history.goBack()}
            name="Edit teaching"
          />
        }
      />
      <NewTeachingModal
        showModal={showNewTeachingModal}
        setShowModal={setShowNewTeachingModal}
        name="New teaching"
      />
      <DeleteTeachingModal
        showModal={showDeleteTeachingModal}
        setShowModal={setShowDeleteTeachingModal}
        name="Confirm delete teaching"
        teachingId={teachingIdToDelete}
      />
      <ImportTeachingModal
        showModal={showImportTeachingModal}
        setShowModal={setShowImportTeachingModal}
        name="Import teachings"
      />
      <StyledRegistrationPage>
        {renderContent()}
      </StyledRegistrationPage>
    </>
  );
};

// Styling
const StyledRegistrationPage = styled.div`
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
  align-items: flex-end;
`;

const RegistrationDuration = styled.span`
  font-size: 14px;
  margin-left: 7px;
`;

const RegistrationText = styled.div`
  font-size: 15px;
  font-weight: 500;
  display: flex;
  align-items: center;
  margin-right: 7px;
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

const ImportPanelContainer = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  transform: translate(-210px, 155px);
  z-index: 3;

  @media (max-width: 1220px) {
    transform: translate(-210px, 60px);
  }
`;

export default LecturerRegistrationPage;
