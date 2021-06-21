import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import TimeTable from "../components/schedule-page/TimeTable";
import Button from "../components/common/Button";
import { Skeleton } from "@material-ui/core";
import { styled as materialUiStyled } from "@material-ui/styles";
import { ReactComponent as NothingImage } from "../assets/images/nothing.svg";
import PrivateRoute from "./PrivateRoute";
import EditLabUsageModal from "../components/schedule-page/EditLabUsageModal";
import GetAppIcon from "@material-ui/icons/GetApp";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import AddIcon from "@material-ui/icons/Add";

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
import { useAppDispatch, useAppSelector } from "../store";
import { useHistory } from "react-router";
import ModifyLabUsageRequestModal from "../components/schedule-page/ModifyLabUsageRequestModal";
import AddExtraClassRequestModal from "../components/schedule-page/AddExtraClassRequest";
import moment from "moment";
import _ from "lodash";
import {
  setShowErrorSnackBar,
  setSnackBarContent,
} from "../reducers/notificationSlice";

const SchedulePage = () => {
  const dispatch = useAppDispatch();

  const [week, setWeek] = useState(2);
  const [filteredLabUsages, setFilterLabUsages] = useState<LabUsage[]>([]);

  const [selectedSemester, setSelectedSemester] = useState<Semester>(null!);
  const [academicYearSemesters, setAcademicYearSemesters] = useState<
    Semester[]
  >([]);

  const [selectedYear, setSelectedYear] = useState<AcademicYear>(null!);

  const [labUsageToChange, setLabUsageToChange] = useState<string>("");

  const [showModifyLabUsageRequestModal, setShowModifyLabUsageRequestModal] =
    useState(false);
  const [showAddExtraClassRequestModal, setShowAddExtraClassRequestModal] =
    useState(false);

  // call hooks
  const [courses] = useGetAllCourses();
  const [users] = useGetAllUsers();
  const [labs] = useGetAllLabs();

  const academicYears = useAppSelector(
    (state) => state.academicYears.academicYears
  );
  const semesters = useAppSelector((state) => state.semesters.semesters);

  const [teachings] = useGetAllTeaching();
  const [labUsages, labUsageStatus] =
    useGetLabUsagesBySemester(selectedSemester);
  const academicYearStatus = useAppSelector(
    (state) => state.academicYears.status
  );
  const semesterStatus = useAppSelector((state) => state.semesters.status);
  const role = useAppSelector((state) => state.auth.verifiedRole);
  const history = useHistory();

  // useEffect

  // initialize
  useEffect(() => {
    if (academicYears.length > 0) {
      const latestAcademicYear = _.cloneDeep(academicYears).sort((a, b) =>
        moment(b.startDate).diff(moment(a.startDate))
      )[0];
      console.log("*** Academic year:", latestAcademicYear);
      setSelectedYear(latestAcademicYear);

      let acaSemesters = semesters.filter(
        (item) => item.academicYear === latestAcademicYear._id
      );
      setAcademicYearSemesters(acaSemesters);

      console.log("*** Academic year semesters:", acaSemesters);

      if (
        acaSemesters.filter((item) => item.status === SEMESTER_STATUSES.OPENING)
          .length > 0
      ) {
        setSelectedSemester(
          acaSemesters.filter(
            (item) => item.status === SEMESTER_STATUSES.OPENING
          )[0]!
        );
      } else {
        setSelectedSemester(acaSemesters.find((item) => item.index === 1)!);
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
    if (selectedSemester) {
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
    }
  }, [week, labUsages, selectedSemester]);

  const handleEditLabUsage = (id: string) => {
    history.push(`/schedule/${id}`);
  };

  const handleRequestModifyLabUsage = (labUsageId: string) => {
    setLabUsageToChange(labUsageId);
    setShowModifyLabUsageRequestModal(true);
  };

  const getCourseName = (labUsage: LabUsage) => {
    return (courses as Course[]).find(
      (course) =>
        course._id ===
        teachings.find((teaching) => teaching._id === labUsage.teaching)!.course
    )!.courseName;
  };

  const getLecturerName = (labUsage: LabUsage) => {
    return (users as User[]).find(
      (user) =>
        user._id ===
        teachings.find((teaching) => teaching._id === labUsage.teaching)!.user
    )!.fullName;
  };

  const getTheoryRoomName = (labUsage: LabUsage) => {
    return teachings.find((teaching) => teaching._id === labUsage.teaching)!
      .theoryRoom;
  };

  const getCell = (labUsage: LabUsage) => {
    return `${getCourseName(labUsage)} \nCBGD:${getLecturerName(
      labUsage
    )} \nTiết: ${labUsage.startPeriod} → ${labUsage.endPeriod}`;
  };

  const exportScheduleCSV = () => {
    let sheets: { [index: string]: XLSX.WorkSheet } = {};
    let sheetNames: string[] = [];

    const headers = [
      "Lab",
      "Monday",
      "Monday-a",
      "Monday-e",
      "Tuesday",
      "Tuesday-a",
      "Tuesday-e",
      "Wednesday",
      "Wednesday-a",
      "Wednesday-e",
      "Thursday",
      "Thursday-a",
      "Thursday-e",
      "Friday",
      "Friday-a",
      "Friday-e",
      "Saturday",
      "Saturday-a",
      "Saturday-e",
      "Sunday",
      "Sunday-a",
      "Sunday-e",
    ];

    // loop through week
    for (let i = 0; i < selectedSemester.numberOfWeeks; i++) {
      // Get lab usages by weeks
      const labUsagesByWeek = (labUsages as LabUsage[]).filter(
        (labUsage) => labUsage.weekNo === i
      );

      let rows: { [index: string]: string }[] = [];

      let wscols = headers.map((column) => {
        return { wch: 30 };
      });

      let hsrows = [{ hpt: 40 }];

      hsrows = hsrows.concat(
        (labs as Lab[]).map((_) => {
          return { hpt: 100 };
        })
      );

      // loop though labs
      for (let lab of labs as Lab[]) {
        let row: { [index: string]: string } = {};

        row[headers[0]] = lab.labName;
        row[headers[1]] = "";
        row[headers[2]] = "";
        row[headers[3]] = "";
        row[headers[4]] = "";
        row[headers[5]] = "";
        row[headers[6]] = "";
        row[headers[7]] = "";
        row[headers[8]] = "";
        row[headers[9]] = "";
        row[headers[10]] = "";
        row[headers[11]] = "";
        row[headers[12]] = "";
        row[headers[13]] = "";
        row[headers[14]] = "";
        row[headers[15]] = "";
        row[headers[16]] = "";
        row[headers[17]] = "";
        row[headers[18]] = "";
        row[headers[19]] = "";
        row[headers[20]] = "";
        row[headers[21]] = "";

        // get lab usages by lab
        const labUsagesByWeekByLab = labUsagesByWeek.filter(
          (labUsage) => labUsage.lab === lab._id!
        );

        labUsagesByWeekByLab.forEach((item) => {
          if (item.endPeriod <= 5) {
            row[headers[1 + item.dayOfWeek * 3]] = getCell(item);
            const index = headers.indexOf(headers[1 + item.dayOfWeek * 3]);
            wscols[index] = { wch: getCourseName(item).length };
          }
          if (item.endPeriod > 5 && item.endPeriod <= 12) {
            row[headers[2 + item.dayOfWeek * 3]] = getCell(item);
            const index = headers.indexOf(headers[2 + item.dayOfWeek * 3]);
            wscols[index] = { wch: getCourseName(item).length };
          }
          if (item.endPeriod > 12 && item.endPeriod <= 16) {
            row[headers[3 + item.dayOfWeek * 3]] = getCell(item);
            const index = headers.indexOf(headers[3 + item.dayOfWeek * 3]);
            wscols[index] = { wch: getCourseName(item).length };
          }
        });
        console.log(row);
        rows.push(row);
      }
      const ws = XLSX.utils.json_to_sheet(rows);
      console.log(ws);
      const merge = [
        { s: { r: 0, c: 1 }, e: { r: 0, c: 3 } },
        { s: { r: 0, c: 4 }, e: { r: 0, c: 6 } },
        { s: { r: 0, c: 7 }, e: { r: 0, c: 9 } },
        { s: { r: 0, c: 10 }, e: { r: 0, c: 12 } },
        { s: { r: 0, c: 13 }, e: { r: 0, c: 15 } },
        { s: { r: 0, c: 16 }, e: { r: 0, c: 18 } },
        { s: { r: 0, c: 19 }, e: { r: 0, c: 21 } },
      ];
      ws["!cols"] = wscols;
      ws["!rows"] = hsrows;
      ws["!merges"] = merge;
      sheets[`Week ${i}`] = ws;
      sheetNames.push(`Week ${i}`);
    }

    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const wb = { Sheets: sheets, SheetNames: sheetNames };

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "schedule" + fileExtension);
  };

  const exportTheoryRoomsCSV = () => {
    let sheets: { [index: string]: XLSX.WorkSheet } = {};
    let sheetNames: string[] = [];

    const headers = [
      "",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    // loop through week
    for (let i = 0; i < selectedSemester.numberOfWeeks; i++) {
      // Get lab usages by weeks
      const labUsagesByWeek = (labUsages as LabUsage[]).filter(
        (labUsage) => labUsage.weekNo === i
      );

      let rows: { [index: string]: string }[] = [];

      let hsrows = [{ hpt: 40 }, { hpt: 40 }];

      let rowMorning: { [index: string]: string } = {};
      let rowAfternoon: { [index: string]: string } = {};
      let rowEvening: { [index: string]: string } = {};

      rowMorning[headers[0]] = "Morning";
      rowMorning[headers[1]] = "";
      rowMorning[headers[2]] = "";
      rowMorning[headers[3]] = "";
      rowMorning[headers[4]] = "";
      rowMorning[headers[5]] = "";
      rowMorning[headers[6]] = "";
      rowMorning[headers[7]] = "";

      rowAfternoon[headers[0]] = "Afternoon";
      rowAfternoon[headers[1]] = "";
      rowAfternoon[headers[2]] = "";
      rowAfternoon[headers[3]] = "";
      rowAfternoon[headers[4]] = "";
      rowAfternoon[headers[5]] = "";
      rowAfternoon[headers[6]] = "";
      rowAfternoon[headers[7]] = "";

      rowEvening[headers[0]] = "Evening";
      rowEvening[headers[1]] = "";
      rowEvening[headers[2]] = "";
      rowEvening[headers[3]] = "";
      rowEvening[headers[4]] = "";
      rowEvening[headers[5]] = "";
      rowEvening[headers[6]] = "";
      rowEvening[headers[7]] = "";

      for (let i = 0; i < labUsagesByWeek.length; i++) {
        if (labUsagesByWeek[i].endPeriod <= 5) {
          rowMorning[
            headers[labUsagesByWeek[i].dayOfWeek + 1]
          ] += `${getTheoryRoomName(labUsagesByWeek[i])}: ${
            labUsagesByWeek[i].startPeriod
          } → ${labUsagesByWeek[i].endPeriod};\n`;

          rowMorning[headers[labUsagesByWeek[i].dayOfWeek + 1]] =
            rowMorning[headers[labUsagesByWeek[i].dayOfWeek + 1]].split("\n")[
              rowMorning[headers[labUsagesByWeek[i].dayOfWeek + 1]].split("\n")
                .length - 1
            ] === ""
              ? rowMorning[headers[labUsagesByWeek[i].dayOfWeek + 1]].split(
                  "\n"
                )[0]
              : rowMorning[headers[labUsagesByWeek[i].dayOfWeek + 1]]
                  .split("\n")
                  .sort()
                  .join("\n");
        }

        if (
          labUsagesByWeek[i].endPeriod > 5 &&
          labUsagesByWeek[i].endPeriod <= 12
        ) {
          rowAfternoon[
            headers[labUsagesByWeek[i].dayOfWeek + 1]
          ] += `${getTheoryRoomName(labUsagesByWeek[i])}: ${
            labUsagesByWeek[i].startPeriod
          } → ${labUsagesByWeek[i].endPeriod};\n`;

          rowAfternoon[headers[labUsagesByWeek[i].dayOfWeek + 1]] =
            rowAfternoon[headers[labUsagesByWeek[i].dayOfWeek + 1]].split("\n")[
              rowAfternoon[headers[labUsagesByWeek[i].dayOfWeek + 1]].split(
                "\n"
              ).length - 1
            ] === ""
              ? rowAfternoon[headers[labUsagesByWeek[i].dayOfWeek + 1]].split(
                  "\n"
                )[0]
              : rowAfternoon[headers[labUsagesByWeek[i].dayOfWeek + 1]]
                  .split("\n")
                  .sort()
                  .join("\n");
        }

        if (
          labUsagesByWeek[i].endPeriod > 12 &&
          labUsagesByWeek[i].endPeriod <= 16
        ) {
          rowEvening[
            headers[labUsagesByWeek[i].dayOfWeek + 1]
          ] += `${getTheoryRoomName(labUsagesByWeek[i])}: ${
            labUsagesByWeek[i].startPeriod
          } → ${labUsagesByWeek[i].endPeriod};\n`;

          rowEvening[headers[labUsagesByWeek[i].dayOfWeek + 1]] =
            rowEvening[headers[labUsagesByWeek[i].dayOfWeek + 1]].split("\n")[
              rowEvening[headers[labUsagesByWeek[i].dayOfWeek + 1]].split("\n")
                .length - 1
            ] === ""
              ? rowEvening[headers[labUsagesByWeek[i].dayOfWeek + 1]].split(
                  "\n"
                )[0]
              : rowEvening[headers[labUsagesByWeek[i].dayOfWeek + 1]]
                  .split("\n")
                  .sort()
                  .join("\n");
        }
      }
      rows.push(rowMorning);
      rows.push(rowAfternoon);
      rows.push(rowEvening);

      const ws = XLSX.utils.json_to_sheet(rows);
      console.log(ws);
      ws["!rows"] = hsrows;
      sheets[`Week ${i}`] = ws;
      sheetNames.push(`Week ${i}`);
    }

    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const wb = { Sheets: sheets, SheetNames: sheetNames };

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "idle_theory_rooms" + fileExtension);
  };

  // conditional render
  const renderContent = () => {
    if (
      labUsageStatus === "pending" ||
      academicYearStatus === "pending" ||
      semesterStatus === "pending"
    ) {
      return (
        <SkeletonContainer>
          <Skeleton variant="rectangular" height={40} animation="wave" />
          <Skeleton variant="rectangular" height={40} animation="wave" />
          <Skeleton variant="rectangular" height={40} animation="wave" />
          <Skeleton variant="rectangular" height={40} animation="wave" />
        </SkeletonContainer>
      );
    } else if (
      academicYearStatus === "succeeded" &&
      semesterStatus === "succeeded"
    ) {
      return (
        <>
          <Toolbar>
            <Filter>
              <StyledFormControl>
                <InputLabel id="academic-year-label">Years</InputLabel>
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
              </StyledFormControl>
              <StyledFormControl>
                <InputLabel id="semester-label">Semester</InputLabel>
                <Select
                  labelId="semester-label"
                  id="semester-select"
                  value={selectedSemester ? selectedSemester._id : null}
                  onChange={(e) =>
                    setSelectedSemester(
                      academicYearSemesters.filter(
                        (semester) => semester._id === e.target.value
                      )[0]
                    )
                  }
                  label="Semester"
                >
                  {academicYearSemesters.map((semester) => (
                    <MenuItem value={semester._id} key={semester._id}>
                      {semester.semesterName}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
              <StyledFormControl>
                <InputLabel id="shift-label">Week</InputLabel>
                <Select
                  labelId="week-label"
                  id="week-select"
                  value={week}
                  onChange={(e) => setWeek(e.target.value as number)}
                  label="Week"
                >
                  {selectedSemester &&
                    [...Array(selectedSemester.numberOfWeeks)].map((_, i) => (
                      <MenuItem value={i} key={i}>
                        {i}
                      </MenuItem>
                    ))}
                </Select>
              </StyledFormControl>
              {selectedSemester ? (
                selectedSemester.status === SEMESTER_STATUSES.OPENING ? (
                  <Text>
                    From{" "}
                    {moment(new Date(selectedSemester.startDate!))
                      .add(week, "weeks")
                      .format("dddd DD/MM/yyyy")}{" "}
                    to{" "}
                    {moment(new Date(selectedSemester.startDate!))
                      .add(week, "weeks")
                      .add(6, "days")
                      .format("dddd DD/MM/yyyy")}
                  </Text>
                ) : (
                  <Text>This semester has not been started</Text>
                )
              ) : null}
            </Filter>
            <Action>
              <StyledButton onClick={exportScheduleCSV} icon={<GetAppIcon />}>
                Export schedule
              </StyledButton>
              {role === ROLES.ADMIN ? (
                <StyledButton
                  onClick={exportTheoryRoomsCSV}
                  icon={<GetAppIcon />}
                >
                  Export theory rooms
                </StyledButton>
              ) : (
                <StyledButton
                  icon={<AddIcon />}
                  onClick={() => {
                    if (labUsages.length === 0) {
                      dispatch(setShowErrorSnackBar(true));
                      dispatch(
                        setSnackBarContent(
                          "Request is not available now. Try again later"
                        )
                      );
                    } else {
                      setShowAddExtraClassRequestModal(true);
                    }
                  }}
                >
                  Make request to add extra class
                </StyledButton>
              )}
            </Action>
          </Toolbar>
          <TableContainer>
            {courses.length > 0 && users.length > 0 ? (
              <TimeTable
                labUsages={filteredLabUsages}
                labs={
                  (labs as Lab[]).length > 1
                    ? _.cloneDeep(labs as Lab[]).sort(
                        (a, b) =>
                          filteredLabUsages.filter((item) => item.lab === b._id)
                            .length -
                          filteredLabUsages.filter((item) => item.lab === a._id)
                            .length
                      )
                    : (labs as Lab[])
                }
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
          <span>No schedule found</span>
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
  display: flex;
  margin-right: 4rem;
  justify-content: center;
  align-items: center;
`;

const Action = styled.div`
  display: flex;

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

const StyledButton = styled(Button)`
  padding: 0 0.5rem;
  margin: 0 0.5rem;
`;

const StyledFormControl = materialUiStyled(FormControl)({
  marginRight: "1rem",
});

const Text = styled.div`
  font-size: 16px;
`;

export default SchedulePage;
