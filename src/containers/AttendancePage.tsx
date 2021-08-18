import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import Button from "../components/common/Button";
import { Skeleton } from "@material-ui/core";
import { styled as materialUiStyled } from "@material-ui/styles";
import { ReactComponent as NothingImage } from "../assets/images/nothing.svg";
import * as FileSaver from "file-saver";
import * as XLSX from "sheetjs-style";
import GetAppIcon from "@material-ui/icons/GetApp";

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
  Teaching,
} from "../types/model";

// import type
import { useAppSelector } from "../store";
import moment from "moment";
import _ from "lodash";
import { Column } from "react-table";
import Table from "../components/common/Table";

type AttendanceTable = {
  rowId: string;
  day: string;
  course: string;
  labName: string;
  period: string;
  checkIn: string | JSX.Element;
  checkOut: string | JSX.Element;
  lecturer: string;
  lecturerId: string;
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

const AttendancePage = () => {
  const [week, setWeek] = useState(2);
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

  const [courses] = useGetAllCourses();
  const [users] = useGetAllUsers();
  const [labs] = useGetAllLabs();
  const [teachings] = useGetAllTeaching();
  const [labUsages, labUsageStatus] =
    useGetLabUsagesBySemester(selectedSemester);

  const academicYears = useAppSelector(
    (state) => state.academicYears.academicYears
  );
  const semesters = useAppSelector(
    (state) => state.semesters.semesters
  );

  const academicYearStatus = useAppSelector(
    (state) => state.academicYears.status
  );
  const semesterStatus = useAppSelector(
    (state) => state.semesters.status
  );
  const role = useAppSelector((state) => state.auth.verifiedRole);

  // helper
  const prepareData = (
    filteredLabUsages: LabUsage[],
    teachings: Teaching[],
    courses: Course[],
    labs: Lab[],
    users: User[]
  ): {
    data: AttendanceTable[];
  } => {
    let data: AttendanceTable[];

    if (filteredLabUsages.length > 0) {
      data = filteredLabUsages
        .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
        .map((labUsage) => {
          return {
            rowId: labUsage._id!,
            day: dowNum2String(labUsage.dayOfWeek)!,
            course:
              courses &&
              teachings.find(
                (teaching) => teaching._id === labUsage.teaching
              )
                ? courses.find(
                    (course) =>
                      course._id ===
                      teachings.find(
                        (teaching) =>
                          teaching._id === labUsage.teaching
                      )!.course
                  )!.courseName
                : "",
            labName: labs.find((item) => item._id === labUsage.lab)
              ?.labName!,
            period: `${labUsage.startPeriod} - ${labUsage.endPeriod}`,
            checkIn: labUsage.checkInAt ? (
              <CheckedBadge>
                {moment(new Date(labUsage.checkInAt)).format(
                  "DD/MM/YYYY h:m:s A"
                )}
              </CheckedBadge>
            ) : (
              <PendingeBadge>Pending</PendingeBadge>
            ),
            checkOut: labUsage.checkInAt ? (
              <CheckedBadge>
                {moment(new Date(labUsage.checkOutAt!)).format(
                  "DD/MM/YYYY h:m:s A"
                )}
              </CheckedBadge>
            ) : (
              <PendingeBadge>Pending</PendingeBadge>
            ),
            lecturer:
              users.length > 0 &&
              teachings.length > 0 &&
              teachings.find(
                (teaching) => teaching._id === labUsage.teaching
              )
                ? users.find(
                    (lecturer) =>
                      lecturer._id ===
                      teachings.find(
                        (teaching) =>
                          teaching._id === labUsage.teaching
                      )!.user
                  )
                  ? users.find(
                      (lecturer) =>
                        lecturer._id ===
                        teachings.find(
                          (teaching) =>
                            teaching._id === labUsage.teaching
                        )!.user
                    )!.fullName
                  : ""
                : "",
            lecturerId:
              users.length > 0 &&
              teachings.length > 0 &&
              teachings.find(
                (teaching) => teaching._id === labUsage.teaching
              )
                ? users.find(
                    (lecturer) =>
                      lecturer._id ===
                      teachings.find(
                        (teaching) =>
                          teaching._id === labUsage.teaching
                      )!.user
                  )
                  ? users.find(
                      (lecturer) =>
                        lecturer._id ===
                        teachings.find(
                          (teaching) =>
                            teaching._id === labUsage.teaching
                        )!.user
                    )!._id
                  : ""
                : "",
          };
        });
    } else {
      data = [];
    }

    return { data };
  };

  // initialize
  useEffect(() => {
    if (academicYears.length > 0) {
      const latestAcademicYear = _.cloneDeep(academicYears).sort(
        (a, b) => moment(b.createdAt).diff(moment(a.createdAt))
      )[0];
      setSelectedYear(latestAcademicYear);

      let acaSemesters = semesters.filter(
        (item) => item.academicYear === latestAcademicYear._id
      );
      setAcademicYearSemesters(acaSemesters);

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
      setSelectedSemester(
        academicYearSemesters.find((item) => item.index === 1)!
      );
    }
  }, [selectedYear, semesters]);

  // event handler
  const exportAttendanceCSV = () => {
    let sheets: { [index: string]: XLSX.WorkSheet } = {};
    let sheetNames: string[] = [];

    const headers = [
      "Day",
      "Course",
      "Lab",
      "Period",
      "Check in",
      "Check out",
      "Lecturer",
      "Lecturer ID",
    ];

    // loop through week
    for (let i = 0; i < selectedSemester.numberOfWeeks; i++) {
      // Get lab usages by weeks
      const labUsagesByWeek = (labUsages as LabUsage[])
        .filter(
          (labUsage) =>
            labUsage.weekNo === i &&
            labUsage.semester === selectedSemester._id
        )
        .sort((a, b) => a.dayOfWeek - b.dayOfWeek);

      let rows: { [index: string]: string }[] = [];
      let wscols = headers.map((column) => {
        return { wch: 30 };
      });
      let hsrows: { hpt: number }[] = labUsagesByWeek.map((_, __) => {
        return {
          hpt: 40,
        };
      });
      hsrows.push({ hpt: 40 });

      for (let j = 0; j < labUsagesByWeek.length; j++) {
        let row: { [index: string]: string } = {};
        row[headers[0]] = dowNum2String(
          labUsagesByWeek[j].dayOfWeek
        )!;
        row[headers[1]] =
          courses &&
          teachings.find(
            (teaching) => teaching._id === labUsagesByWeek[j].teaching
          )
            ? (courses as Course[]).find(
                (course) =>
                  course._id ===
                  teachings.find(
                    (teaching) =>
                      teaching._id === labUsagesByWeek[j].teaching
                  )!.course
              )!.courseName
            : "";
        row[headers[2]] = (labs as Lab[]).find(
          (item) => item._id === labUsagesByWeek[j].lab
        )?.labName!;
        row[
          headers[3]
        ] = `${labUsagesByWeek[j].startPeriod} - ${labUsagesByWeek[j].endPeriod}`;
        row[headers[4]] = labUsagesByWeek[j].checkInAt
          ? moment(new Date(labUsagesByWeek[j].checkInAt!)).format(
              "DD/MM/YYYY h:m:s A"
            )
          : "pending";
        row[headers[5]] = labUsagesByWeek[j].checkInAt
          ? moment(new Date(labUsagesByWeek[j].checkOutAt!)).format(
              "DD/MM/YYYY h:m:s A"
            )
          : "pending";
        row[headers[6]] =
          users &&
          teachings.find(
            (teaching) => teaching._id === labUsagesByWeek[j].teaching
          )
            ? (users as User[]).find(
                (lecturer) =>
                  lecturer._id ===
                  teachings.find(
                    (teaching) =>
                      teaching._id === labUsagesByWeek[j].teaching
                  )!.user
              )!.fullName
            : "";
        row[headers[7]] =
          users &&
          teachings.find(
            (teaching) => teaching._id === labUsagesByWeek[j].teaching
          )
            ? (users as User[]).find(
                (lecturer) =>
                  lecturer._id ===
                  teachings.find(
                    (teaching) =>
                      teaching._id === labUsagesByWeek[j].teaching
                  )!.user
              )!._id
            : "";

        rows.push(row);
      }
      let lastRow: { [index: string]: string } = {};
      lastRow[headers[0]] = "Exported date";
      lastRow[headers[1]] = moment(new Date()).format(
        "DD:MM:YYYY hh:mm:ss A"
      );
      lastRow[headers[2]] = "";
      lastRow[headers[3]] = "";
      lastRow[headers[4]] = "";
      lastRow[headers[5]] = "";
      lastRow[headers[6]] = "";
      lastRow[headers[7]] = "";
      rows.push(lastRow);
      const ws = XLSX.utils.json_to_sheet(rows);
      ws["!rows"] = hsrows;
      ws["!cols"] = wscols;
      for (let i = 0; i <= labUsagesByWeek.length + 1; i++) {
        for (let j = 1; j <= headers.length; j++) {
          if (i === 0) {
            ws[`${(j + 9).toString(36).toUpperCase()}${i + 1}`].s = {
              font: {
                sz: 16,
                bold: true,
                color: { rgb: "000000" },
              },
              fill: {
                fgColor: { rgb: "FFFFAA00" },
              },
              border: {
                top: { style: "medium", color: { rgb: "000000" } },
                bottom: { style: "medium", color: { rgb: "000000" } },
                left: { style: "medium", color: { rgb: "000000" } },
                right: { style: "medium", color: { rgb: "000000" } },
              },
              alignment: { vertical: "center", horizontal: "center" },
            };
          } else {
            ws[`${(j + 9).toString(36).toUpperCase()}${i + 1}`].s = {
              font: {
                sz: 15,
                color: { rgb: "000000" },
              },
              alignment: {
                wrapText: true,
                vertical: "center",
                horizontal: "center",
              },
              border: {
                top: { style: "medium", color: { rgb: "000000" } },
                bottom: { style: "medium", color: { rgb: "000000" } },
                left: { style: "medium", color: { rgb: "000000" } },
                right: { style: "medium", color: { rgb: "000000" } },
              },
            };
          }
        }
      }

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
    FileSaver.saveAs(data, "Attendances" + fileExtension);
  };

  // Filter lab usages
  useEffect(() => {
    if (selectedSemester) {
      if (labUsages.length > 0) {
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

  const renderTable = () => {
    const columns: Array<Column<AttendanceTable>> = [
      {
        Header: "Row ID",
        accessor: "rowId" as const,
      },
      {
        Header: "Day",
        accessor: "day" as const,
      },
      {
        Header: "Course",
        accessor: "course" as const,
      },
      {
        Header: "Lab",
        accessor: "labName" as const,
      },
      {
        Header: "Period",
        accessor: "period" as const,
      },
      {
        Header: "Check in at",
        accessor: "checkIn" as const,
        disableSortBy: true,
        width: 150,
      },
      {
        Header: "Check out at",
        accessor: "checkOut" as const,
        disableSortBy: true,
        width: 150,
      },
      {
        Header: "Lecturer",
        accessor: "lecturer" as const,
      },
      {
        Header: "Lecturer ID",
        accessor: "lecturerId" as const,
      },
    ];

    if (labUsageStatus === "succeeded") {
      const { data } = prepareData(
        filteredLabUsages as LabUsage[],
        teachings as Teaching[],
        courses as Course[],
        labs as Lab[],
        users as User[]
      );
      return (
        <Table<AttendanceTable>
          data={data}
          columns={columns}
          name="Lab"
          isAllowEditDelete={false}
          isFaceId={false}
        />
      );
    } else if (labUsageStatus === "failed") {
      const data: AttendanceTable[] = [];
      return (
        <Table<AttendanceTable>
          data={data}
          columns={columns}
          name="Attendance"
          isAllowEditDelete={false}
          isFaceId={false}
        />
      );
    } else {
      return (
        <SkeletonContainer>
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
        </SkeletonContainer>
      );
    }
  };

  const renderContent = () => {
    if (
      labUsageStatus === "pending" ||
      academicYearStatus === "pending" ||
      semesterStatus === "pending"
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
    } else if (
      academicYearStatus === "succeeded" &&
      semesterStatus === "succeeded"
    ) {
      return (
        <>
          <Toolbar>
            <Filter>
              <StyledFormControl>
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
              </StyledFormControl>
              <StyledFormControl>
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
                    [...Array(selectedSemester.numberOfWeeks)].map(
                      (_, i) => (
                        <MenuItem value={i} key={i}>
                          {i}
                        </MenuItem>
                      )
                    )}
                </Select>
              </StyledFormControl>
              {selectedSemester ? (
                selectedSemester.status ===
                  SEMESTER_STATUSES.OPENING ||
                selectedSemester.status ===
                  SEMESTER_STATUSES.CLOSED ? (
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
                  "This semester has not been started"
                )
              ) : null}
            </Filter>
            <Action>
              {role === ROLES.ADMIN && (
                <StyledButton
                  onClick={exportAttendanceCSV}
                  icon={<GetAppIcon />}
                >
                  Export attendances
                </StyledButton>
              )}
            </Action>
          </Toolbar>
          <TableContainer>{renderTable()}</TableContainer>
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
    <StyledAttendancePage>{renderContent()}</StyledAttendancePage>
  );
};

const StyledAttendancePage = styled.div`
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

const PendingeBadge = styled.div`
  background-color: ${({ theme }) => theme.red};
  color: white;
  font-size: 12px;
  padding: 0 0.5rem;
  font-weight: 600;
  border-radius: 10px;
  width: 100%;
  text-align: center;
`;
const CheckedBadge = styled.div`
  background-color: ${({ theme }) => theme.green};
  color: white;
  font-size: 12px;
  padding: 0 0.5rem;
  font-weight: 600;
  border-radius: 10px;
  text-align: center;
`;

export default AttendancePage;
