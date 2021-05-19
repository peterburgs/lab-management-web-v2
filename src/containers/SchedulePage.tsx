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
import { ReactComponent as NothingImage } from "../assets/images/nothing.svg";
import PrivateRoute from "./PrivateRoute";
import EditLabUsageModal from "../components/schedule-page/EditLabUsageModal";

// import hooks
import useGetLabUsagesBySemester from "../hooks/schedule/useGetLabUsagesBySemester";
import useGetAllLabs from "../hooks/lab/useGetAllLabs";
import useGetAllCourses from "../hooks/course/useGetAllCourses";
import useGetAllUsers from "../hooks/user/useGetAllUsers";
import useGetAllTeaching from "../hooks/teaching/useGetAllTeachings";

// import model
import {
  LabUsage,
  Semester,
  Lab,
  Course,
  User,
  ROLES,
  AcademicYear,
  SEMESTER_STATUSES,
} from "../types/model";

// import type
import { useAppSelector } from "../store";
import { useHistory } from "react-router";
import ModifyLabUsageRequestModal from "../components/schedule-page/ModifyLabUsageRequestModal";
import AddExtraClassRequestModal from "../components/schedule-page/AddExtraClassRequest";
import moment from "moment";
import _ from "lodash";

const SchedulePage = () => {
  const [week, setWeek] = useState(1);
  const [filteredLabUsages, setFilterLabUsages] = useState<
    LabUsage[]
  >([]);

  const [selectedSemester, setSelectedSemester] = useState<Semester>(
    null!
  );
  const [academicYearSemesters, setAcademicYearSemesters] = useState<
    Semester[]
  >([]);

  const [selectedYear, setSelectedYear] = useState<AcademicYear>(
    null!
  );

  const [labUsageToChange, setLabUsageToChange] =
    useState<string>("");

  const [
    showModifyLabUsageRequestModal,
    setShowModifyLabUsageRequestModal,
  ] = useState(false);
  const [
    showAddExtraClassRequestModal,
    setShowAddExtraClassRequestModal,
  ] = useState(false);

  // call hooks
  const [courses] = useGetAllCourses();
  const [users] = useGetAllUsers();
  const [labs] = useGetAllLabs();

  const academicYears = useAppSelector(
    (state) => state.academicYears.academicYears
  );
  const semesters = useAppSelector(
    (state) => state.semesters.semesters
  );

  const [teachings] = useGetAllTeaching();
  const [labUsages, labUsageSchedule] =
    useGetLabUsagesBySemester(selectedSemester);
  const role = useAppSelector((state) => state.auth.verifiedRole);
  const history = useHistory();

  // useEffect

  // initialize
  useEffect(() => {
    if (academicYears.length > 0) {
      const latestAcademicYear = _.cloneDeep(
        academicYears.sort((a, b) =>
          moment(b.startDate).diff(moment(a.startDate))
        )[0]
      );
      console.log("*** Academic year:", latestAcademicYear);
      setSelectedYear(latestAcademicYear);

      let acaSemesters = semesters.filter(
        (item) => item.academicYear === latestAcademicYear._id
      );
      setAcademicYearSemesters(acaSemesters);

      console.log("*** Academic year semesters:", acaSemesters);

      if (
        acaSemesters.filter(
          (item) => item.status === SEMESTER_STATUSES.OPENING
        ).length > 0
      ) {
        setSelectedSemester(
          acaSemesters.filter(
            (item) => item.status === SEMESTER_STATUSES.OPENING
          )[0]!
        );
      } else {
        setSelectedSemester(
          acaSemesters.find((item) => item.index === 1)!
        );
      }
    }
  }, [academicYears, semesters]);

  // handle select academic year
  useEffect(() => {
    if (selectedYear) {
      const academicYearSemesters = semesters.filter(
        (item) => item.academicYear === selectedYear._id
      );
      setAcademicYearSemesters(academicYearSemesters);
    }
  }, [selectedYear, semesters]);

  // Filter lab usages
  useEffect(() => {
    if (labUsages.length > 0) {
      console.log(labUsages);
      setFilterLabUsages(
        (labUsages as LabUsage[]).filter(
          (labUsage) =>
            labUsage.semester === selectedSemester._id &&
            labUsage.weekNo === week
        )
      );
    }
  }, [week, labUsages, selectedSemester]);

  const handleEditLabUsage = (id: string) => {
    history.push(`/schedule/${id}`);
  };

  const handleRequestModifyLabUsage = (labUsageId: string) => {
    setLabUsageToChange(labUsageId);
    setShowModifyLabUsageRequestModal(true);
  };

  // conditional render
  const renderContent = () => {
    if (
      labUsageSchedule === "pending" ||
      labUsageSchedule === "idle"
    ) {
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
    } else if (labUsageSchedule === "succeeded") {
      return (
        <>
          <Toolbar>
            <Filter>
              <FormControl>
                <InputLabel id="academic-year-label">
                  Years
                </InputLabel>
                <Select
                  labelId="academic-year-label"
                  id="academic-year-select"
                  value={selectedYear ? selectedYear._id : null}
                  onChange={(e) =>
                    setSelectedYear(
                      academicYears.filter(
                        (item) => item._id === e.target.value
                      )[0]
                    )
                  }
                  label="Semester"
                >
                  {academicYears.map((item) => (
                    <MenuItem value={item._id} key={item._id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel id="semester-label">Semester</InputLabel>
                <Select
                  labelId="semester-label"
                  id="semester-select"
                  value={
                    selectedSemester ? selectedSemester._id : null
                  }
                  onChange={(e) =>
                    setSelectedSemester(
                      academicYearSemesters.filter(
                        (semester) => semester._id === e.target.value
                      )[0]
                    )
                  }
                  label="Semester"
                >
                  {console.log(
                    "250 academic year semesters",
                    academicYearSemesters
                  )}
                  {academicYearSemesters.map((semester) => (
                    <MenuItem value={semester._id} key={semester._id}>
                      {semester.semesterName}
                    </MenuItem>
                  ))}
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
                  {selectedSemester &&
                    [...Array(selectedSemester.numberOfWeeks)].map(
                      (_, i) => (
                        <MenuItem value={i} key={i}>
                          {i}
                        </MenuItem>
                      )
                    )}
                </Select>
              </FormControl>
            </Filter>
            <Action>
              {role === ROLES.ADMIN ? (
                <Button>Export theory rooms</Button>
              ) : (
                <Button
                  onClick={() =>
                    setShowAddExtraClassRequestModal(true)
                  }
                >
                  Make request to add extra class
                </Button>
              )}
            </Action>
          </Toolbar>
          <TableContainer>
            {courses.length > 0 && users.length > 0 ? (
              <TimeTable
                labUsages={filteredLabUsages}
                labs={labs as Lab[]}
                courses={courses as Course[]}
                lecturers={users as User[]}
                teachings={teachings}
                onEditLabUsage={handleEditLabUsage}
                onRequestModifyLabUsage={handleRequestModifyLabUsage}
              />
            ) : null}
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

  return (
    <>
      {labUsageToChange && (
        <ModifyLabUsageRequestModal
          semester={selectedSemester._id!}
          showModal={showModifyLabUsageRequestModal}
          setShowModal={setShowModifyLabUsageRequestModal}
          name="Make request to change lab usage"
          labUsageId={labUsageToChange}
        />
      )}
      {selectedSemester && (
        <>
          <AddExtraClassRequestModal
            semester={selectedSemester._id!}
            showModal={showAddExtraClassRequestModal}
            setShowModal={setShowAddExtraClassRequestModal}
            name="Make request to add lab usage"
          />
          <PrivateRoute
            roles={[ROLES.ADMIN]}
            path="/schedule/:id"
            exact={false}
            component={
              <EditLabUsageModal
                semester={selectedSemester._id!}
                showModal={true}
                setShowModal={() => history.goBack()}
                name="Edit lab usage"
              />
            }
          />
        </>
      )}

      <StyledSchedulePage>{renderContent()}</StyledSchedulePage>
    </>
  );
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
  grid-template-columns: 1fr 1fr 1fr 1fr;
  column-gap: 1rem;
`;

const Action = styled.div`
  display: grid;
  column-gap: 1rem;
  grid-template-columns: 1fr;
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
