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
import useGetAllSemester from "../hooks/semester/useGetAllSemester";
import useGetAllTeaching from "../hooks/teaching/useGetAllTeachings";

// import model
import {
  LabUsage,
  Semester,
  Lab,
  Course,
  User,
  ROLES,
} from "../types/model";

// import type
import { useAppSelector } from "../store";
import { useHistory } from "react-router";
import ModifyLabUsageRequestModal from "../components/schedule-page/ModifyLabUsageRequestModal";
import AddExtraClassRequestModal from "../components/schedule-page/AddExtraClassRequest";

const period2Shift = (start: number, end: number) => {
  if (start >= 1 && end <= 5) return 1;
  if (start >= 7 && end <= 11) return 2;
  if (start >= 12 && end <= 15) return 3;
  return 0;
};

const SchedulePage = () => {
  const [shift, setShift] = useState(0);
  const [week, setWeek] = useState(1);
  const [filteredLabUsages, setFilterLabUsages] = useState<
    LabUsage[]
  >([]);

  const [selectedSemester, setSelectedSemester] = useState<Semester>(
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
  const openingSemester = useAppSelector(
    (state) => state.semesters.semesters[0]
  );
  const [semesters] = useGetAllSemester();
  const [teachings] = useGetAllTeaching();
  const [labUsages, labUsageSchedule] =
    useGetLabUsagesBySemester(selectedSemester);
  const role = useAppSelector((state) => state.auth.verifiedRole);
  const history = useHistory();

  // useEffect

  // initialize selected semester
  useEffect(() => {
    if (semesters.length > 0 && openingSemester) {
      setSelectedSemester(openingSemester);
    }
  }, [semesters, openingSemester]);

  // Filter lab usages
  useEffect(() => {
    if (labUsages.length > 0) {
      console.log(labUsages);
      setFilterLabUsages(
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
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
        </SkeletonContainer>
      );
    } else if (labUsageSchedule === "succeeded") {
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
                      semesters.filter(
                        (semester) => semester._id === e.target.value
                      )[0]
                    )
                  }
                  label="Semester"
                >
                  {semesters.map((semester) => (
                    <MenuItem value={semester._id} key={semester._id}>
                      {semester.semesterName}
                    </MenuItem>
                  ))}
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
          showModal={showModifyLabUsageRequestModal}
          setShowModal={setShowModifyLabUsageRequestModal}
          name="Make request to change lab usage"
          labUsageId={labUsageToChange}
        />
      )}
      <AddExtraClassRequestModal
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
            showModal={true}
            setShowModal={() => history.goBack()}
            name="Edit lab usage"
          />
        }
      />
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
  grid-template-columns: 1fr 1fr 1fr;
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
