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
import GetAppIcon from "@material-ui/icons/GetApp";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

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

  const getCourseName = (labUsage: LabUsage) => {
    return (courses as Course[]).find(
      (course) =>
        course._id ===
        teachings.find(
          (teaching) => teaching._id === labUsage.teaching
        )!.course
    )!.courseName;
  };

  const getLecturerName = (labUsage: LabUsage) => {
    return (users as User[]).find(
      (user) =>
        user._id ===
        teachings.find(
          (teaching) => teaching._id === labUsage.teaching
        )!.user
    )!.fullName;
  };

  const getTheoryRoomName = (labUsage: LabUsage) => {
    return teachings.find(
      (teaching) => teaching._id === labUsage.teaching
    )!.theoryRoom;
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
      "Phòng lab",
      "Sáng T2",
      "Chiều T2",
      "Tối T2",
      "Sáng T3",
      "Chiều T3",
      "Tối T3",
      "Sáng T4",
      "Chiều T4",
      "Tối T4",
      "Sáng T5",
      "Chiều T5",
      "Tối T5",
      "Sáng T6",
      "Chiều T6",
      "Tối T6",
      "Sáng T7",
      "Chiều T7",
      "Tối T7",
      "Sáng CN",
      "Chiều CN",
      "Tối CN",
    ];

    // loop through week
    for (let i = 0; i < selectedSemester.numberOfWeeks; i++) {
      // Get lab usages by weeks
      const labUsagesByWeek = (labUsages as LabUsage[]).filter(
        (labUsage) => labUsage.weekNo === i
      );

      let rows: { [index: string]: string }[] = [];

      let wscols = headers.map((column) => {
        return { wch: column.length };
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
          if (item.dayOfWeek === 0) {
            if (item.endPeriod <= 5) {
              row[headers[1]] = getCell(item);
              const index = headers.indexOf(headers[1]);
              wscols[index] = { wch: getCourseName(item).length };
            }
            if (item.endPeriod > 5 && item.endPeriod <= 12) {
              row[headers[2]] = getCell(item);
              const index = headers.indexOf(headers[2]);
              wscols[index] = { wch: getCourseName(item).length };
            }
            if (item.endPeriod > 12 && item.endPeriod <= 16) {
              row[headers[3]] = getCell(item);
              const index = headers.indexOf(headers[3]);
              wscols[index] = { wch: getCourseName(item).length };
            }
          }
          if (item.dayOfWeek === 1) {
            if (item.endPeriod <= 5) {
              row[headers[4]] = getCell(item);
              const index = headers.indexOf(headers[4]);
              wscols[index] = { wch: getCourseName(item).length };
            }
            if (item.endPeriod > 5 && item.endPeriod <= 12) {
              row[headers[5]] = getCell(item);
              const index = headers.indexOf(headers[5]);
              wscols[index] = { wch: getCourseName(item).length };
            }
            if (item.endPeriod > 12 && item.endPeriod <= 16) {
              row[headers[6]] = getCell(item);
              const index = headers.indexOf(headers[6]);
              wscols[index] = { wch: getCourseName(item).length };
            }
          }
          if (item.dayOfWeek === 2) {
            if (item.endPeriod <= 5) {
              row[headers[7]] = getCell(item);
              const index = headers.indexOf(headers[7]);
              wscols[index] = { wch: getCourseName(item).length };
            }
            if (item.endPeriod > 5 && item.endPeriod <= 12) {
              row[headers[8]] = getCell(item);
              const index = headers.indexOf(headers[8]);
              wscols[index] = { wch: getCourseName(item).length };
            }
            if (item.endPeriod > 12 && item.endPeriod <= 16) {
              row[headers[9]] = getCell(item);
              const index = headers.indexOf(headers[9]);
              wscols[index] = { wch: getCourseName(item).length };
            }
          }
          if (item.dayOfWeek === 3) {
            if (item.endPeriod <= 5) {
              row[headers[10]] = getCell(item);
              const index = headers.indexOf(headers[10]);
              wscols[index] = { wch: getCourseName(item).length };
            }
            if (item.endPeriod > 5 && item.endPeriod <= 12) {
              row[headers[11]] = getCell(item);
              const index = headers.indexOf(headers[11]);
              wscols[index] = { wch: getCourseName(item).length };
            }
            if (item.endPeriod > 12 && item.endPeriod <= 16) {
              row[headers[12]] = getCell(item);
              const index = headers.indexOf(headers[12]);
              wscols[index] = { wch: getCourseName(item).length };
            }
          }
          if (item.dayOfWeek === 4) {
            if (item.endPeriod <= 5) {
              row[headers[13]] = getCell(item);
              const index = headers.indexOf(headers[13]);
              wscols[index] = { wch: getCourseName(item).length };
            }
            if (item.endPeriod > 5 && item.endPeriod <= 12) {
              row[headers[14]] = getCell(item);
              const index = headers.indexOf(headers[14]);
              wscols[index] = { wch: getCourseName(item).length };
            }
            if (item.endPeriod > 12 && item.endPeriod <= 16) {
              row[headers[15]] = getCell(item);
              const index = headers.indexOf(headers[15]);
              wscols[index] = { wch: getCourseName(item).length };
            }
          }
          if (item.dayOfWeek === 5) {
            if (item.endPeriod <= 5) {
              row[headers[16]] = getCell(item);
              const index = headers.indexOf(headers[16]);
              wscols[index] = { wch: getCourseName(item).length };
            }
            if (item.endPeriod > 5 && item.endPeriod <= 12) {
              row[headers[17]] = getCell(item);
              const index = headers.indexOf(headers[17]);
              wscols[index] = { wch: getCourseName(item).length };
            }
            if (item.endPeriod > 12 && item.endPeriod <= 16) {
              row[headers[18]] = getCell(item);
              const index = headers.indexOf(headers[18]);
              wscols[index] = { wch: getCourseName(item).length };
            }
          }
          if (item.dayOfWeek === 6) {
            if (item.endPeriod <= 5) {
              row[headers[19]] = getCell(item);
              const index = headers.indexOf(headers[19]);
              wscols[index] = { wch: getCourseName(item).length };
            }
            if (item.endPeriod > 5 && item.endPeriod <= 12) {
              row[headers[20]] = getCell(item);
              const index = headers.indexOf(headers[20]);
              wscols[index] = { wch: getCourseName(item).length };
            }
            if (item.endPeriod > 12 && item.endPeriod <= 16) {
              row[headers[21]] = getCell(item);
              const index = headers.indexOf(headers[21]);
              wscols[index] = { wch: getCourseName(item).length };
            }
          }
        });
        console.log(row);
        rows.push(row);
      }
      const ws = XLSX.utils.json_to_sheet(rows);
      console.log(ws);
      ws["!cols"] = wscols;
      ws["!rows"] = hsrows;
      sheets[`Tuần ${i}`] = ws;
      sheetNames.push(`Tuần ${i}`);
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
      "Sáng T2",
      "Chiều T2",
      "Tối T2",
      "Sáng T3",
      "Chiều T3",
      "Tối T3",
      "Sáng T4",
      "Chiều T4",
      "Tối T4",
      "Sáng T5",
      "Chiều T5",
      "Tối T5",
      "Sáng T6",
      "Chiều T6",
      "Tối T6",
      "Sáng T7",
      "Chiều T7",
      "Tối T7",
      "Sáng CN",
      "Chiều CN",
      "Tối CN",
    ];

    // loop through week
    for (let i = 0; i < selectedSemester.numberOfWeeks; i++) {
      // Get lab usages by weeks
      const labUsagesByWeek = (labUsages as LabUsage[]).filter(
        (labUsage) => labUsage.weekNo === i
      );

      let rows: { [index: string]: string }[] = [];

      let hsrows = [{ hpt: 40 }, { hpt: 40 }];

      let row: { [index: string]: string } = {};

      row[headers[0]] = "";
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

      labUsagesByWeek.forEach((item) => {
        if (item.dayOfWeek === 0) {
          if (item.endPeriod <= 5) {
            row[headers[0]] += `, ${getTheoryRoomName(item)} (${
              item.startPeriod
            } → ${item.endPeriod})`;
            row[headers[0]] = row[headers[0]]
              .split(", ")
              .sort()
              .join(", ");
          }
          if (item.endPeriod > 5 && item.endPeriod <= 12) {
            row[headers[1]] += `, ${getTheoryRoomName(item)} (${
              item.startPeriod
            } → ${item.endPeriod})`;
            row[headers[1]] = row[headers[1]]
              .split(", ")
              .sort()
              .join(", ");
          }
          if (item.endPeriod > 12 && item.endPeriod <= 16) {
            row[headers[2]] += `, ${getTheoryRoomName(item)} (${
              item.startPeriod
            } → ${item.endPeriod})`;
            row[headers[2]] = row[headers[2]]
              .split(", ")
              .sort()
              .join(", ");
          }
        }
        if (item.dayOfWeek === 1) {
          if (item.endPeriod <= 5) {
            row[headers[3]] += `, ${getTheoryRoomName(item)} (${
              item.startPeriod
            } → ${item.endPeriod})`;
            row[headers[3]] = row[headers[3]]
              .split(", ")
              .sort()
              .join(", ");
          }
          if (item.endPeriod > 5 && item.endPeriod <= 12) {
            row[headers[4]] += `, ${getTheoryRoomName(item)} (${
              item.startPeriod
            } → ${item.endPeriod})`;
            row[headers[4]] = row[headers[4]]
              .split(", ")
              .sort()
              .join(", ");
          }
          if (item.endPeriod > 12 && item.endPeriod <= 16) {
            row[headers[5]] += `, ${getTheoryRoomName(item)} (${
              item.startPeriod
            } → ${item.endPeriod})`;
            row[headers[5]] = row[headers[5]]
              .split(", ")
              .sort()
              .join(", ");
          }
        }
        if (item.dayOfWeek === 2) {
          if (item.endPeriod <= 5) {
            row[headers[6]] += `, ${getTheoryRoomName(item)} (${
              item.startPeriod
            } → ${item.endPeriod})`;
            row[headers[6]] = row[headers[6]]
              .split(", ")
              .sort()
              .join(", ");
          }
          if (item.endPeriod > 5 && item.endPeriod <= 12) {
            row[headers[7]] += `, ${getTheoryRoomName(item)} (${
              item.startPeriod
            } → ${item.endPeriod})`;
            row[headers[7]] = row[headers[7]]
              .split(", ")
              .sort()
              .join(", ");
          }
          if (item.endPeriod > 12 && item.endPeriod <= 16) {
            row[headers[8]] += `, ${getTheoryRoomName(item)} (${
              item.startPeriod
            } → ${item.endPeriod})`;
            row[headers[8]] = row[headers[8]]
              .split(", ")
              .sort()
              .join(", ");
          }
        }
        if (item.dayOfWeek === 3) {
          if (item.endPeriod <= 5) {
            row[headers[9]] += `, ${getTheoryRoomName(item)} (${
              item.startPeriod
            } → ${item.endPeriod})`;
            row[headers[9]] = row[headers[9]]
              .split(", ")
              .sort()
              .join(", ");
          }
          if (item.endPeriod > 5 && item.endPeriod <= 12) {
            row[headers[10]] += `, ${getTheoryRoomName(item)} (${
              item.startPeriod
            } → ${item.endPeriod})`;
            row[headers[10]] = row[headers[10]]
              .split(", ")
              .sort()
              .join(", ");
          }
          if (item.endPeriod > 12 && item.endPeriod <= 16) {
            row[headers[11]] += `, ${getTheoryRoomName(item)} (${
              item.startPeriod
            } → ${item.endPeriod})`;
            row[headers[11]] = row[headers[11]]
              .split(", ")
              .sort()
              .join(", ");
          }
        }
        if (item.dayOfWeek === 4) {
          if (item.endPeriod <= 5) {
            row[headers[12]] += `, ${getTheoryRoomName(item)} (${
              item.startPeriod
            } → ${item.endPeriod})`;
            row[headers[12]] = row[headers[12]]
              .split(", ")
              .sort()
              .join(", ");
          }
          if (item.endPeriod > 5 && item.endPeriod <= 12) {
            row[headers[13]] += `, ${getTheoryRoomName(item)} (${
              item.startPeriod
            } → ${item.endPeriod})`;
            row[headers[13]] = row[headers[13]]
              .split(", ")
              .sort()
              .join(", ");
          }
          if (item.endPeriod > 12 && item.endPeriod <= 16) {
            row[headers[14]] += `, ${getTheoryRoomName(item)} (${
              item.startPeriod
            } → ${item.endPeriod})`;
            row[headers[14]] = row[headers[14]]
              .split(", ")
              .sort()
              .join(", ");
          }
        }
        if (item.dayOfWeek === 5) {
          if (item.endPeriod <= 5) {
            row[headers[15]] += `, ${getTheoryRoomName(item)} (${
              item.startPeriod
            } → ${item.endPeriod})`;
            row[headers[15]] = row[headers[15]]
              .split(", ")
              .sort()
              .join(", ");
          }
          if (item.endPeriod > 5 && item.endPeriod <= 12) {
            row[headers[16]] += `, ${getTheoryRoomName(item)} (${
              item.startPeriod
            } → ${item.endPeriod})`;
            row[headers[16]] = row[headers[16]]
              .split(", ")
              .sort()
              .join(", ");
          }
          if (item.endPeriod > 12 && item.endPeriod <= 16) {
            row[headers[17]] += `, ${getTheoryRoomName(item)} (${
              item.startPeriod
            } → ${item.endPeriod})`;
            row[headers[17]] = row[headers[17]]
              .split(", ")
              .sort()
              .join(", ");
          }
        }
        if (item.dayOfWeek === 6) {
          if (item.endPeriod <= 5) {
            row[headers[18]] += `, ${getTheoryRoomName(item)} (${
              item.startPeriod
            } → ${item.endPeriod})`;
            row[headers[18]] = row[headers[18]]
              .split(", ")
              .sort()
              .join(", ");
          }
          if (item.endPeriod > 5 && item.endPeriod <= 12) {
            row[headers[19]] += `, ${getTheoryRoomName(item)} (${
              item.startPeriod
            } → ${item.endPeriod})`;
            row[headers[19]] = row[headers[19]]
              .split(", ")
              .sort()
              .join(", ");
          }
          if (item.endPeriod > 12 && item.endPeriod <= 16) {
            row[headers[20]] += `, ${getTheoryRoomName(item)} (${
              item.startPeriod
            } → ${item.endPeriod})`;
            row[headers[20]] = row[headers[20]]
              .split(", ")
              .sort()
              .join(", ");
          }
        }
      });
      console.log(row);
      rows.push(row);

      const ws = XLSX.utils.json_to_sheet(rows);
      console.log(ws);
      ws["!rows"] = hsrows;
      sheets[`Tuần ${i}`] = ws;
      sheetNames.push(`Tuần ${i}`);
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
              <Button
                onClick={exportScheduleCSV}
                icon={<GetAppIcon />}
              >
                Export schedule
              </Button>
              {role === ROLES.ADMIN ? (
                <Button
                  onClick={exportTheoryRoomsCSV}
                  icon={<GetAppIcon />}
                >
                  Export theory rooms
                </Button>
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
