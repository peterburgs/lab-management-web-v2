import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import {
  REQUEST_STATUSES,
  User,
  Request,
  ROLES,
  Semester,
  AcademicYear,
  SEMESTER_STATUSES,
  LabUsage,
  REQUEST_TYPES,
  Course,
  Lab,
} from "../types/model";
import HourglassEmptyOutlinedIcon from "@material-ui/icons/HourglassEmptyOutlined";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
} from "@material-ui/core";
import useGetAllUsers from "../hooks/user/useGetAllUsers";
import RequestCard from "../components/request-page/RequestCard";
import "simplebar/dist/simplebar.min.css";
import SimpleBar from "simplebar-react";
import useGetAllRequests from "../hooks/request/useGetAllRequests";
import { ReactComponent as NothingImage } from "../assets/images/nothing.svg";
import _ from "lodash";
import { useAppSelector } from "../store";
import useGetAllComments from "../hooks/comment/useGetAllComments";
import moment from "moment";
import Button from "../components/common/Button";
import { styled as materialUiStyled } from "@material-ui/styles";
import GetAppIcon from "@material-ui/icons/GetApp";
import useGetLabUsagesBySemester from "../hooks/schedule/useGetLabUsagesBySemester";
import useGetAllRegistrations from "../hooks/registration/useGetAllRegistrations";
import useGetAllTeaching from "../hooks/teaching/useGetAllTeachings";
import * as XLSX from "sheetjs-style";
import * as FileSaver from "file-saver";
import useGetAllCourses from "../hooks/course/useGetAllCourses";
import useGetAllLabs from "../hooks/lab/useGetAllLabs";

enum SORT_BY {
  NEWEST,
  OLDEST,
}

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

const RequestPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<REQUEST_STATUSES>(
    REQUEST_STATUSES.PENDING
  );

  const [sortBy, setSortBy] = useState<SORT_BY>(null!);
  const [upperFilteredRequests, setUpperFilterRequests] = useState<Request[]>(
    []
  );
  const [filteredRequests, setFilterRequests] = useState<Request[]>([]);
  const [roleFilteredRequests, setRoleFilterRequests] = useState<Request[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<Semester>(null!);
  const [academicYearSemesters, setAcademicYearSemesters] = useState<
    Semester[]
  >([]);

  const [selectedYear, setSelectedYear] = useState<AcademicYear>(null!);

  // call hooks
  const requestSearchText = useAppSelector(
    (state) => state.search.requestSearchText
  );
  const handleSelectStatus = (status: REQUEST_STATUSES) => {
    setSelectedStatus(status);
  };
  const [users, userStatus] = useGetAllUsers();
  const [requests, requestStatus] = useGetAllRequests();
  const [comments] = useGetAllComments();
  const [registrations] = useGetAllRegistrations();
  const [teachings] = useGetAllTeaching();

  const academicYears = useAppSelector(
    (state) => state.academicYears.academicYears
  );
  const semesters = useAppSelector((state) => state.semesters.semesters);
  const [courses, courseStatus] = useGetAllCourses();
  const [labs, labStatus] = useGetAllLabs();

  const academicYearStatus = useAppSelector(
    (state) => state.academicYears.status
  );
  const semesterStatus = useAppSelector((state) => state.semesters.status);
  const [labUsages, labUsageStatus] =
    useGetLabUsagesBySemester(selectedSemester);
  const role = useAppSelector((state) => state.auth.verifiedRole);
  const lecturer = useAppSelector((state) => state.auth.verifiedUser?._id);

  const getUsage = (
    teachingId: string,
    lab: string,
    week: number,
    dayOfWeek: number,
    startPeriod: number,
    endPeriod: number
  ) => {
    const teaching = teachings.filter((item) => item._id === teachingId)[0];
    const courseName = (courses as Course[]).filter(
      (item) => item._id === teaching.course
    )[0].courseName;
    const labName = (labs as Lab[]).filter((item) => item._id === lab)[0]
      .labName;
    return `Course: ${courseName}\nLab: ${labName}\nWeek: ${week}\n Day of week: ${dowNum2String(
      dayOfWeek
    )}\n Period: ${startPeriod} -> ${endPeriod}`;
  };

  const getLecturerName = (teachingId: string) => {
    const teaching = teachings.filter((item) => item._id === teachingId)[0];
    const lecturerName = (users as User[]).filter(
      (item) => item._id === teaching.user
    )[0].fullName;
    return lecturerName;
  };

  const getLecturerID = (teachingId: string) => {
    const teaching = teachings.filter((item) => item._id === teachingId)[0];
    const lecturerID = (users as User[]).filter(
      (item) => item._id === teaching.user
    )[0]._id;
    return lecturerID;
  };

  const exportRequestCSV = () => {
    let sheets: { [index: string]: XLSX.WorkSheet } = {};
    let sheetNames: string[] = [];

    const headers = [
      "Status",
      "Type",
      "Current lab usage",
      "New lab usage",
      "Extra class usage",
      "Create at",
      "Lecturer name",
      "Lecturer ID",
    ];

    let statusArr = [
      REQUEST_STATUSES.PENDING,
      REQUEST_STATUSES.APPROVED,
      REQUEST_STATUSES.DENIED,
    ];

    for (let i = 0; i < statusArr.length; i++) {
      const _clonedRequests = _.cloneDeep(upperFilteredRequests);
      _clonedRequests.sort((a, b) =>
        moment(b.updatedAt).diff(moment(a.updatedAt))
      );
      const requests = _clonedRequests.filter(
        (item) => item.status === statusArr[i]
      );

      let rows: { [index: string]: string }[] = [];
      let wscols = headers.map((column) => {
        return { wch: 40 };
      });
      let hsrows: { hpt: number }[] = requests.map((_, __) => {
        return {
          hpt: 70,
        };
      });
      hsrows.push({ hpt: 40 });

      for (let j = 0; j < requests.length; j++) {
        let row: { [index: string]: string } = {};
        row[headers[0]] =
          statusArr[i] === REQUEST_STATUSES.PENDING
            ? "Pending"
            : statusArr[i] === REQUEST_STATUSES.APPROVED
            ? "Approved"
            : "Denied";
        row[headers[1]] =
          requests[j].type === REQUEST_TYPES.MODIFY_LAB_USAGE
            ? "MODIFY_LAB_USAGE"
            : "ADD_EXTRA_CLASS";
        row[headers[2]] =
          requests[j].type === REQUEST_TYPES.MODIFY_LAB_USAGE
            ? getUsage(
                teachings.filter(
                  (item) =>
                    item._id ===
                    (labUsages as LabUsage[]).filter(
                      (item) => item._id === (requests[j].labUsage as string)
                    )[0].teaching
                )[0]._id!,
                requests[j].oldLab,
                requests[j].oldWeekNo,
                requests[j].oldDayOfWeek,
                requests[j].oldStartPeriod,
                requests[j].oldEndPeriod
              )
            : "";
        row[headers[3]] =
          requests[j].type === REQUEST_TYPES.MODIFY_LAB_USAGE
            ? getUsage(
                teachings.filter(
                  (item) =>
                    item._id ===
                    (labUsages as LabUsage[]).filter(
                      (item) => item._id === (requests[j].labUsage as string)
                    )[0].teaching
                )[0]._id!,
                requests[j].lab as string,
                requests[j].weekNo,
                requests[j].dayOfWeek,
                requests[j].startPeriod,
                requests[j].endPeriod
              )
            : "";
        row[headers[4]] =
          requests[j].type === REQUEST_TYPES.ADD_EXTRA_CLASS
            ? getUsage(
                requests[j].teaching as string,
                requests[j].lab as string,
                requests[j].weekNo,
                requests[j].dayOfWeek,
                requests[j].startPeriod,
                requests[j].endPeriod
              )
            : "";
        row[headers[5]] = moment(requests[j].createdAt).format(
          "DD/MM/YYYY hh:mm:ss A"
        );
        row[headers[6]] =
          requests[j].type === REQUEST_TYPES.MODIFY_LAB_USAGE
            ? getLecturerName(
                teachings.filter(
                  (item) =>
                    item._id ===
                    (labUsages as LabUsage[]).filter(
                      (item) => item._id === (requests[j].labUsage as string)
                    )[0].teaching
                )[0]._id!
              )
            : getLecturerName(requests[j].teaching as string);
        row[headers[7]] =
          requests[j].type === REQUEST_TYPES.MODIFY_LAB_USAGE
            ? getLecturerID(
                teachings.filter(
                  (item) =>
                    item._id ===
                    (labUsages as LabUsage[]).filter(
                      (item) => item._id === (requests[j].labUsage as string)
                    )[0].teaching
                )[0]._id!
              )
            : getLecturerID(requests[j].teaching as string);

        rows.push(row);
      }
      let lastRow: { [index: string]: string } = {};
      lastRow[headers[0]] = "Exported date";
      lastRow[headers[1]] = moment(new Date()).format("DD:MM:YYYY hh:mm:ss A");
      lastRow[headers[2]] = "";
      lastRow[headers[3]] = "";
      lastRow[headers[4]] = "";
      lastRow[headers[5]] = "";
      lastRow[headers[6]] = "";
      lastRow[headers[7]] = "";
      rows.push(lastRow);
      const ws = XLSX.utils.json_to_sheet(rows);
      console.log(ws);
      ws["!rows"] = hsrows;
      ws["!cols"] = wscols;
      for (let i = 0; i <= requests.length + 1; i++) {
        for (let j = 1; j <= headers.length; j++) {
          console.log(`${(j + 9).toString(36).toUpperCase()}${i + 1}`);
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
      sheets[
        `${
          statusArr[i] === REQUEST_STATUSES.PENDING
            ? "Pending"
            : statusArr[i] === REQUEST_STATUSES.APPROVED
            ? "Aprroved"
            : "Denied"
        }`
      ] = ws;
      sheetNames.push(
        `${
          statusArr[i] === REQUEST_STATUSES.PENDING
            ? "Pending"
            : statusArr[i] === REQUEST_STATUSES.APPROVED
            ? "Aprroved"
            : "Denied"
        }`
      );
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
    FileSaver.saveAs(data, "Requests" + fileExtension);
  };

  // conditional renderer
  const renderRquests = () => {
    if (labUsageStatus === "pending") {
      return (
        <SkeletonContainer>
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
        </SkeletonContainer>
      );
    }
    return (
      <SimpleBar
        style={{
          maxHeight: "calc(100% - 70px)",
        }}
      >
        <RequestListContainer>
          {(filteredRequests as Request[]).map((request) => {
            if (request.status === REQUEST_STATUSES.PENDING) {
              return (
                <RequestCard
                  key={request._id}
                  title={request.title}
                  type={request.type}
                  status={request.status}
                  pendingAt={request.updatedAt}
                  requestId={request._id}
                  user={
                    (users as User[]).find((user) => user._id === request.user)!
                  }
                  numberOfComments={
                    comments.filter((item) => item.request === request._id)
                      .length
                  }
                />
              );
            } else if (request.status === REQUEST_STATUSES.APPROVED) {
              return (
                <RequestCard
                  key={request._id}
                  title={request.title}
                  type={request.type}
                  status={request.status}
                  approvedAt={request.updatedAt}
                  requestId={request._id}
                  user={
                    (users as User[]).find((user) => user._id === request.user)!
                  }
                  numberOfComments={
                    comments.filter((item) => item.request === request._id)
                      .length
                  }
                />
              );
            }
            return (
              <RequestCard
                key={request._id}
                title={request.title}
                type={request.type}
                status={request.status}
                deniedAt={request.updatedAt}
                requestId={request._id}
                user={
                  (users as User[]).find((user) => user._id === request.user)!
                }
                numberOfComments={
                  comments.filter((item) => item.request === request._id).length
                }
              />
            );
          })}
        </RequestListContainer>
      </SimpleBar>
    );
  };

  // initialize
  useEffect(() => {
    if (academicYears.length > 0) {
      const latestAcademicYear = _.cloneDeep(academicYears).sort((a, b) =>
        moment(b.createdAt).diff(moment(a.createdAt))
      )[0];
      setSelectedYear(latestAcademicYear);

      let acaSemesters = semesters.filter(
        (item) => item.academicYear === latestAcademicYear._id
      );
      setAcademicYearSemesters(acaSemesters);
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
      setSelectedSemester(
        academicYearSemesters.find((item) => item.index === 1)!
      );
    }
  }, [selectedYear, semesters]);

  // filter by role
  useEffect(() => {
    if (lecturer && role) {
      if (role === ROLES.LECTURER) {
        const filteredRequests = (requests as Request[]).filter(
          (request) => request.user === lecturer
        );
        setRoleFilterRequests(filteredRequests);
      }
    } else {
      setRoleFilterRequests(_.cloneDeep(requests as Request[]));
    }
  }, [lecturer, role, requests]);

  // upper filter requests
  useEffect(() => {
    if (registrations.length > 0 && teachings.length > 0 && selectedSemester) {
      let filteredRequests = (roleFilteredRequests as Request[]).filter(
        (request) => {
          if (request.type === REQUEST_TYPES.MODIFY_LAB_USAGE) {
            const filteredLabUsages = (labUsages as LabUsage[]).filter(
              (item) => item.semester === selectedSemester._id
            );

            return filteredLabUsages.filter(
              (item) => item._id === request.labUsage
            ).length;
          } else {
            const teaching = teachings.filter(
              (item) => item._id === request.teaching
            )[0];

            const reg = registrations.filter(
              (item) => item._id === teaching.registration
            )[0];
            return selectedSemester._id === reg.semester;
          }
        }
      );
      setUpperFilterRequests(filteredRequests);
    }
  }, [
    roleFilteredRequests,
    labUsages,
    registrations,
    teachings,
    selectedSemester,
  ]);

  // filter requests
  useEffect(() => {
    let filteredRequests = (upperFilteredRequests as Request[]).filter(
      (request) =>
        request.status === selectedStatus &&
        request.title.toLowerCase().includes(requestSearchText.toLowerCase())
    );

    if (sortBy === SORT_BY.NEWEST) {
      filteredRequests.sort((a, b) =>
        moment(b.updatedAt).diff(moment(a.updatedAt))
      );
    }

    if (sortBy === SORT_BY.OLDEST) {
      filteredRequests.sort((a, b) =>
        moment(a.updatedAt).diff(moment(b.updatedAt))
      );
    }
    setFilterRequests(filteredRequests);
  }, [upperFilteredRequests, selectedStatus, requestSearchText, sortBy]);

  return (
    <StyledRequestPage>
      {userStatus === "pending" ||
      requestStatus === "pending" ||
      academicYearStatus === "pending" ||
      semesterStatus === "pending" ||
      labStatus === "pending" ||
      courseStatus === "pending" ? (
        <SkeletonContainer>
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
        </SkeletonContainer>
      ) : (
        <>
          <Toolbar>
            <UpperFilter>
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
            </UpperFilter>
            <Action>
              {role === ROLES.ADMIN && (
                <StyledButton onClick={exportRequestCSV} icon={<GetAppIcon />}>
                  Export requests
                </StyledButton>
              )}
            </Action>
          </Toolbar>
          <Filterbar>
            <StatusContainer>
              <SelectStatusButton
                isSelected={selectedStatus === REQUEST_STATUSES.PENDING}
                onClick={() => handleSelectStatus(REQUEST_STATUSES.PENDING)}
              >
                <HourglassEmptyOutlinedIcon fontSize="small" />
                <span>
                  {`${
                    upperFilteredRequests.filter(
                      (request) => request.status === REQUEST_STATUSES.PENDING
                    ).length
                  } pending`}
                </span>
              </SelectStatusButton>
              <SelectStatusButton
                isSelected={selectedStatus === REQUEST_STATUSES.APPROVED}
                onClick={() => handleSelectStatus(REQUEST_STATUSES.APPROVED)}
              >
                <CheckIcon fontSize="small" />
                <span>{`${
                  upperFilteredRequests.filter(
                    (request) => request.status === REQUEST_STATUSES.APPROVED
                  ).length
                } approved`}</span>
              </SelectStatusButton>
              <SelectStatusButton
                isSelected={selectedStatus === REQUEST_STATUSES.DENIED}
                onClick={() => handleSelectStatus(REQUEST_STATUSES.DENIED)}
              >
                <CloseIcon fontSize="small" />
                <span>{`${
                  upperFilteredRequests.filter(
                    (request) => request.status === REQUEST_STATUSES.DENIED
                  ).length
                } denied`}</span>
              </SelectStatusButton>
            </StatusContainer>
            <Filter isAdmin={role === ROLES.ADMIN}>
              <FormControl variant="standard" style={{ minWidth: 120 }}>
                <InputLabel id="sort-by-label">Sort By</InputLabel>
                <Select
                  margin="none"
                  labelId="sort-by-label"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort by"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>

                  <MenuItem value={SORT_BY.NEWEST}>Newest</MenuItem>
                  <MenuItem value={SORT_BY.OLDEST}>Oldest</MenuItem>
                </Select>
              </FormControl>
              {/* {role === ROLES.ADMIN && (
                <FormControl variant="standard" style={{ minWidth: 120 }}>
                  <InputLabel id="author-label">Author</InputLabel>
                  <Select
                    margin="none"
                    labelId="author-label"
                    value={selectedAuthor}
                    onChange={(e) => setSelectedAuthor(e.target.value)}
                    label="Author"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {(users as User[]).map((user) => (
                      <MenuItem value={user._id} key={user._id}>
                        {user.email}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )} */}
            </Filter>
          </Filterbar>
          {renderRquests()}
        </>
      )}
    </StyledRequestPage>
  );
};

const StyledRequestPage = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const RequestListContainer = styled.div`
  margin-top: 1rem;
  height: 100%;
  overflow: hidden;
`;

interface FilterProps {
  isAdmin: boolean;
}

const Filter = styled.div<FilterProps>`
  display: grid;
  grid-template-columns: ${({ isAdmin }) => (isAdmin ? "1fr" : "1fr")};
  justify-content: center;
  align-items: center;
  column-gap: 1rem;
`;

const Action = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  justify-self: flex-end;
`;

const Filterbar = styled.div`
  display: flex;
  border-radius: 7px;
  background: #f6f8fa;
  padding: 0.5rem;
  justify-content: space-between;
`;

const StatusContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

interface SelectStatusButtonProps {
  isSelected: boolean;
}

const SelectStatusButton = styled.button<SelectStatusButtonProps>`
  font-size: 16px;
  outline: none;
  background: none;
  cursor: pointer;
  margin: 0 0.1rem;
  border: none;
  opacity: 0.5;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  ${({ isSelected, theme }) =>
    isSelected &&
    css`
      opacity: 1;
      color: ${theme.blue};
    `}

  & > span {
    margin-left: 0.2rem;
  }
`;

const SkeletonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-row-gap: 1rem;
  margin-top: 1rem;
`;
const Toolbar = styled.div`
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;

  @media (max-width: 900px) {
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: center;
    & > div {
      margin: 6px;
    }
  }
`;

const UpperFilter = styled.div`
  display: flex;
  margin-right: 4rem;
  justify-content: center;
  align-items: center;
`;
const StyledFormControl = materialUiStyled(FormControl)({
  marginRight: "1rem",
});

const StyledButton = styled(Button)`
  padding: 0 0.5rem;
`;
export default RequestPage;
