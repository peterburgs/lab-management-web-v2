import React, { useState, useEffect } from "react";
import styled from "styled-components";
// Import components
import Table from "../components/common/Table";
import {
  FormControl,
  Select,
  MenuItem,
  Skeleton,
} from "@material-ui/core";
import Button from "../components/common/Button";
import { Column } from "react-table";
import RegistrationStatus from "../components/common/RegistrationStatus";
import { ReactComponent as NothingImage } from "../assets/images/nothing.svg";
import { CheckboxItem } from "../components/common/CheckboxList";
import AddIcon from "@material-ui/icons/Add";
import _ from "lodash";

// Import modals
import OpenRegistrationModal from "../components/registration-page/OpenRegistrationModal";
import SelectCourseModal from "../components/registration-page/SelectCourseModal";
import CloseRegistrationModal from "../components/registration-page/CloseRegistration";
import GenerateScheduleModal from "../components/registration-page/GenerateScheduleModal";

// Import models
import {
  Teaching,
  Registration,
  Course,
  User,
  SEMESTER_STATUSES,
} from "../types/model";

// Import hooks
import useGetTeachingsByRegistrationBatch from "../hooks/teaching/useGetTeachingsByRegistrationBatch";
import useGetAllCourses from "../hooks/course/useGetAllCourses";
import useGetAllUsers from "../hooks/user/useGetAllUsers";
import { useAppDispatch, useAppSelector } from "../store";

// Import reducers
import {
  setShowErrorSnackBar,
  setSnackBarContent,
} from "../reducers/notificationSlice";

// Table type
type TeachingTable = {
  rowId: string;
  courseId: string;
  courseName: string;
  group: number;
  period: string;
  numOfStudents: number;
  lecturerId: string;
  lecturerName: string;
};

// Prepare data for the table
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
        rowId: teaching._id!,
        courseId: teaching.course as string,
        courseName: courses.find((c) => c._id === teaching.course)!
          .courseName,
        group: teaching.group,
        period: `${teaching.startPeriod} - ${teaching.endPeriod}`,
        numOfStudents: teaching.numberOfStudents,
        lecturerName: users.find((c) => c._id === teaching.user)!
          .fullName,
        lecturerId: users.find((c) => c._id === teaching.user)!._id,
      };
    });
  } else {
    data = [];
  }

  return { data };
};

const RegistrationPage = () => {
  // useState
  const [showOpenRegistrationModal, setShowOpenRegistrationModal] =
    useState(false);
  const [showSelectCourseModal, setShowSelectCourseModal] =
    useState(false);
  const [showCloseRegistrationModal, setShowCloseRegistrationModal] =
    useState(false);
  const [showGenerateScheduleModal, setShowGenerateScheduleModal] =
    useState(false);
  const [selectedCourses, setSelectedCourses] = useState<
    CheckboxItem[]
  >([]);
  const [batch, setBatch] = useState(1);

  // call hooks
  const openSemester = useAppSelector((state) =>
    state.semesters.semesters.find(
      (item) => item.status === SEMESTER_STATUSES.OPENING
    )
  );
  const openSemesterStatus = useAppSelector(
    (state) => state.semesters.status
  );

  const openAcademicYear = useAppSelector((state) =>
    state.academicYears.academicYears.find(
      (item) => item.isOpening === true
    )
  );

  const openAcademicYearStatus = useAppSelector(
    (state) => state.academicYears.status
  );

  const registrations = useAppSelector(
    (state) => state.registrations.registrations
  );
  const registrationStatus = useAppSelector(
    (state) => state.registrations.status
  );
  const [teachings, teachingStatus] =
    useGetTeachingsByRegistrationBatch(
      registrations as Registration[],
      batch
    );
  const [courses, courseStatus] = useGetAllCourses();
  const [users, userStatus] = useGetAllUsers();
  const teachingSearchText = useAppSelector(
    (state) => state.search.teachingSearchText
  );
  const dispatch = useAppDispatch();

  // event handling
  const handleSelectCourse = (value: CheckboxItem) => () => {
    const currentIndex = selectedCourses.findIndex(
      (course) => course._id === value._id
    );
    const newSelectedCourses = [...selectedCourses];

    if (currentIndex === -1) {
      newSelectedCourses.push(value);
    } else {
      newSelectedCourses.splice(currentIndex, 1);
    }
    setSelectedCourses(newSelectedCourses);
  };

  useEffect(() => {
    if (registrations.length > 0) {
      let reg: Registration;
      if (registrations.length === 1) {
        reg = _.cloneDeep(registrations[0]);
        setBatch(reg.batch);
      } else {
        const newRegs = _.cloneDeep(registrations);
        reg = _.cloneDeep(
          newRegs.sort((a, b) => b.batch - a.batch)
        )[0];
        setBatch(reg.batch);
      }
    }
  }, [registrations]);

  // conditional renderer
  const renderTable = () => {
    const columns: Array<Column<TeachingTable>> = [
      {
        Header: "Row ID",
        accessor: "rowId" as const,
      },
      {
        Header: "Course Name",
        accessor: "courseName" as const,
      },
      {
        Header: "Course ID",
        accessor: "courseId" as const,
        width: 100,
      },
      {
        Header: "Group",
        accessor: "group" as const,
        width: 20,
      },
      {
        Header: "Period",
        accessor: "period" as const,
        width: 50,
      },
      {
        Header: "Students",
        accessor: "numOfStudents" as const,
        width: 50,
      },
      {
        Header: "Lecturer ID",
        accessor: "lecturerId" as const,
        width: 100,
      },
      {
        Header: "Lecturer name",
        accessor: "lecturerName" as const,
        width: 100,
      },
    ];
    if (courseStatus === "succeeded" && userStatus === "succeeded") {
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
        courses as Course[],
        users as User[]
      );
      if (teachingStatus === "succeeded") {
        return (
          <Table<TeachingTable>
            data={data}
            columns={columns}
            name="Teaching"
            isAllowEditDelete={false}
            isFaceId={false}
          />
        );
      } else if (teachingStatus === "failed") {
        const data: TeachingTable[] = [];
        return (
          <Table<TeachingTable>
            data={data}
            columns={columns}
            name="Teaching"
            isAllowEditDelete={false}
            isFaceId={false}
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
          isAllowEditDelete={false}
          isFaceId={false}
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
    if (
      openAcademicYearStatus === "pending" ||
      openSemesterStatus === "pending"
    ) {
      return (
        <>
          <Skeleton
            variant="rectangular"
            animation="wave"
            height={50}
            style={{ marginBottom: "1rem" }}
          />

          <Skeleton
            variant="rectangular"
            animation="wave"
            height={50}
            style={{ marginBottom: "1rem" }}
          />

          <Skeleton
            variant="rectangular"
            animation="wave"
            height={200}
            style={{ marginBottom: "1rem" }}
          />
        </>
      );
    } else if (openSemester && openAcademicYear) {
      if (registrationStatus === "pending") {
        return (
          <>
            <Skeleton
              variant="rectangular"
              animation="wave"
              height={50}
              style={{ marginBottom: "1rem" }}
            />

            <Skeleton
              variant="rectangular"
              animation="wave"
              height={50}
              style={{ marginBottom: "1rem" }}
            />

            <Skeleton
              variant="rectangular"
              animation="wave"
              height={200}
              style={{ marginBottom: "1rem" }}
            />
          </>
        );
      }
      if (registrationStatus === "failed") {
        return (
          <NotFoundContainer>
            {/* <img alt="Nothing" src={getImage("Nothing.gif")} /> */}
            <span>There is no registration</span>
            <Button
              onClick={() => setShowOpenRegistrationModal(true)}
            >
              Open registration
            </Button>
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
                    variant="standard"
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
                <RegistrationDuration>
                  (
                  {new Date(
                    registrations.find(
                      (reg) => reg.batch === batch
                    )!.startDate
                  ).toDateString()}{" "}
                  -{" "}
                  {new Date(
                    registrations.find(
                      (reg) => reg.batch === batch
                    )!.endDate
                  ).toDateString()}
                  )
                </RegistrationDuration>
              </Filter>

              <Action>
                {/* <Tooltip title="Refresh table data">
                  <IconButtonContainer>
                    <IconButton
                      onClick={handleRefreshData}
                      icon={<RefreshIcon fontSize="small" />}
                    />
                  </IconButtonContainer>
                </Tooltip> */}
                <Button
                  icon={<AddIcon />}
                  onClick={() => {
                    if (
                      (registrations as Registration[]).findIndex(
                        (reg) => reg.isOpening === true
                      ) !== -1
                    ) {
                      dispatch(setShowErrorSnackBar(true));
                      dispatch(
                        setSnackBarContent(
                          "A registration is opening. Cannot start new one"
                        )
                      );
                    } else {
                      setShowOpenRegistrationModal(true);
                    }
                  }}
                >
                  Open registration
                </Button>
                <Button
                  icon={<AddIcon />}
                  onClick={() => setShowGenerateScheduleModal(true)}
                >
                  Generate schedule
                </Button>
              </Action>
            </Toolbar>

            <RegistrationStatus
              onCloseBtnClick={() =>
                setShowCloseRegistrationModal(true)
              }
              registration={
                (registrations as Registration[]).find(
                  (reg) => reg.batch === batch
                )!
              }
            />
            <Total>Total teachings:&nbsp;{teachings.length}</Total>
            <TableContainer>{renderTable()}</TableContainer>
          </>
        );
      }
    } else if (!openSemester || !openAcademicYear) {
      return (
        <NotFoundContainer>
          <NothingImage />
          <span>No data found</span>
        </NotFoundContainer>
      );
    }
  };

  return (
    <>
      <SelectCourseModal
        name="Select course"
        selectedCourses={selectedCourses}
        courses={courses as Course[]}
        handleSelectCourse={handleSelectCourse}
        showModal={showSelectCourseModal}
        setShowModal={setShowSelectCourseModal}
      />
      <OpenRegistrationModal
        name="Open registration"
        showModal={showOpenRegistrationModal}
        setShowModal={setShowOpenRegistrationModal}
        setShowSelectCourseModal={setShowSelectCourseModal}
        selectedCourses={selectedCourses}
        setBatch={setBatch}
      />
      <CloseRegistrationModal
        showModal={showCloseRegistrationModal}
        setShowModal={setShowCloseRegistrationModal}
        name="Do you want to close this registration"
      />
      <GenerateScheduleModal
        showModal={showGenerateScheduleModal}
        setShowModal={setShowGenerateScheduleModal}
        name="Generate schedule"
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

const RegistrationText = styled.div`
  font-size: 15px;
  font-weight: 500;
  display: flex;
  align-items: center;
  margin-right: 7px;
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

const Total = styled.div`
  font-size: 13px;
  margin-top: 1rem;
`;

export default RegistrationPage;
