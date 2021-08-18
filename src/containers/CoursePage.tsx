import React, { useState } from "react";
import styled from "styled-components";
import { Column } from "react-table";
import Table from "../components/common/Table";
import Button from "../components/common/Button";
import { Skeleton } from "@material-ui/core";
import NewCourseModal from "../components/course-page/NewCourseModal";
import AddIcon from "@material-ui/icons/Add";
import EditCourseModal from "../components/course-page/EditCourseModal";
import PrivateRoute from "./PrivateRoute";
import DeleteCourseModal from "../components/course-page/DeleteCourseModal";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import ImportCoursePanel from "../components/course-page/ImportCoursePanel";
import ImportCourseModal from "../components/course-page/ImportCourseModal";
import GetAppIcon from "@material-ui/icons/GetApp";
import * as FileSaver from "file-saver";
import * as XLSX from "sheetjs-style";

// import models
import { Course, COURSE_TYPES, ROLES } from "../types/model";

// import reducers

// import hooks
import useGetAllCourses from "../hooks/course/useGetAllCourses";
import { useAppSelector } from "../store";
import { useHistory } from "react-router";
import moment from "moment";

type CourseTable = {
  rowId: string;
  id: string;
  name: string;
  numberOfCredits: number;
  type: string;
  emptyColumn: string;
};

const prepareData = (
  courses: Course[]
): {
  data: CourseTable[];
} => {
  let data: CourseTable[];

  if (courses.length > 0) {
    data = courses.map((course) => {
      return {
        rowId: course._id,
        id: course._id,
        name: course.courseName,
        numberOfCredits: course.numberOfCredits,
        type:
          course.type === COURSE_TYPES.PRACTICAL
            ? "Practical"
            : "Theory",
        createdAt: new Date(course.createdAt!).toDateString(),
        emptyColumn: "",
      };
    });
  } else {
    data = [];
  }

  return { data };
};

const CoursePage = () => {
  // State
  const [showNewCourseModal, setShowNewCourseModal] = useState(false);
  const [showDeleteCourseModal, setShowDeleteCourseModal] =
    useState(false);
  const [courseIdToDelete, setCourseIdToDelete] = useState<string>(
    null!
  );
  const [showImportCoursePanel, setShowImportCoursePanel] =
    useState(false);
  const [showImportCourseModal, setShowImportCourseModal] =
    useState(false);

  // * Call API
  const [courses, courseStatus] = useGetAllCourses();

  // call hooks
  const courseSearchText = useAppSelector(
    (state) => state.search.courseSearchText
  );
  const role = useAppSelector((state) => state.auth.verifiedRole);
  const history = useHistory();

  // event handling
  // handle export template

  const exportCSV = () => {
    const template: {
      STT: string;
      "Course ID": string;
      "Course Name": string;
      "Course type": COURSE_TYPES | string;
      Credits: number | string;
    }[] = (courses as Course[]).map((course, i) => {
      return {
        STT: String(i + 1),
        "Course ID": course._id,
        "Course Name": course.courseName,
        "Course type":
          course.type === COURSE_TYPES.THEORY
            ? "Theory"
            : "Practical",
        Credits: course.numberOfCredits,
      };
    });
    template.push({
      STT: "Exported date",
      "Course ID": moment(new Date()).format("DD:MM:YYYY hh:mm:ss A"),
      "Course Name": "",
      "Course type": "",
      Credits: "",
    });

    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    let wscols = [
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
    ];

    let hsrows: { hpt: number }[] = (courses as Course[]).map(
      (_, __) => {
        return {
          hpt: 40,
        };
      }
    );
    const ws = XLSX.utils.json_to_sheet(template);
    ws["!rows"] = hsrows;
    ws["!cols"] = wscols;
    if ((courses as Course[]).length > 0) {
      for (let i = 0; i <= (courses as Course[]).length + 1; i++) {
        for (let j = 1; j <= 5; j++) {
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
    }
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "courses" + fileExtension);
  };

  const renderTable = () => {
    const columns: Array<Column<CourseTable>> = [
      {
        Header: "Row ID",
        accessor: "rowId" as const,
      },
      {
        Header: "ID",
        accessor: "id" as const,
        width: 100,
      },
      {
        Header: "Course Name",
        accessor: "name" as const,
        minWidth: 200,
      },
      {
        Header: "Number of credits",
        accessor: "numberOfCredits" as const,
        width: 100,
      },
      {
        Header: "Type",
        accessor: "type" as const,
      },
      {
        Header: "",
        accessor: "emptyColumn" as const,
        disableSortBy: true,
        width: 50,
      },
    ];
    if (courseStatus === "succeeded") {
      const { data } = prepareData(
        (courses as Course[]).filter(
          (item) =>
            item._id.includes(courseSearchText) ||
            item.courseName
              .toLowerCase()
              .includes(courseSearchText.toLowerCase())
        )
      );
      return (
        <Table<CourseTable>
          data={data}
          columns={columns}
          name="Course"
          isAllowEditDelete={role === ROLES.ADMIN}
          isFaceId={false}
          onClickEditBtn={(id) => history.push(`/courses/${id}`)}
          onClickDeleteBtn={(id) => {
            setShowDeleteCourseModal(true);
            setCourseIdToDelete(id);
          }}
        />
      );
    } else if (courseStatus === "failed") {
      const data: CourseTable[] = [];
      return (
        <Table<CourseTable>
          data={data}
          columns={columns}
          name="Course"
          isAllowEditDelete={role === ROLES.ADMIN}
          isFaceId={false}
          onClickEditBtn={(id) => history.push(`/courses/${id}`)}
          onClickDeleteBtn={(id) => {
            setShowDeleteCourseModal(true);
            setCourseIdToDelete(id);
          }}
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

  return (
    <>
      <PrivateRoute
        roles={[ROLES.ADMIN]}
        path="/courses/:id"
        exact={false}
        component={
          <EditCourseModal
            showModal={true}
            setShowModal={() => history.goBack()}
            name="Edit course"
          />
        }
      />
      <ImportCourseModal
        name="Import course"
        showModal={showImportCourseModal}
        setShowModal={setShowImportCourseModal}
      />
      <NewCourseModal
        name="New course"
        showModal={showNewCourseModal}
        setShowModal={setShowNewCourseModal}
      />
      <DeleteCourseModal
        showModal={showDeleteCourseModal}
        setShowModal={setShowDeleteCourseModal}
        name="Confirm delete course"
        courseId={courseIdToDelete}
      />
      <StyledCoursePage>
        <Toolbar>
          <Total>Total:&nbsp;{courses.length}</Total>
          <Action isAdmin={role === ROLES.ADMIN}>
            {/* <Tooltip title="Refresh table data">
              <IconButtonContainer>
                <IconButton
                  onClick={handleRefreshData}
                  icon={<RefreshIcon fontSize="small" />}
                />
              </IconButtonContainer>
            </Tooltip> */}
            {role === ROLES.ADMIN && (
              <>
                <Button
                  onClick={() =>
                    setShowImportCoursePanel((current) => !current)
                  }
                  icon={<ImportExportIcon />}
                >
                  Import courses
                </Button>
                <Button onClick={exportCSV} icon={<GetAppIcon />}>
                  Export courses
                </Button>
                {showImportCoursePanel && (
                  <ImportPanelContainer>
                    <ImportCoursePanel
                      setShowImportCourseModal={
                        setShowImportCourseModal
                      }
                    />
                  </ImportPanelContainer>
                )}
                <Button
                  icon={<AddIcon />}
                  onClick={() => setShowNewCourseModal(true)}
                >
                  New course
                </Button>
              </>
            )}
          </Action>
        </Toolbar>
        <TableContainer>{renderTable()}</TableContainer>
      </StyledCoursePage>
    </>
  );
};

const StyledCoursePage = styled.div`
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

interface ActionProps {
  isAdmin: boolean;
}

const Action = styled.div<ActionProps>`
  display: grid;
  column-gap: 1rem;
  grid-template-columns: ${({ isAdmin }) =>
    isAdmin ? "1fr 1fr 1fr" : "1fr"};
  font-size: 0.875rem;

  @media (max-width: 600px) {
    width: 100%;
    margin: 0;
    display: flex;
    flex-direction: row;

    button {
      width: 100%;
    }
  }
`;

const TableContainer = styled.div`
  padding-top: 1rem;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const Total = styled.div`
  font-size: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImportPanelContainer = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  transform: translate(-400px, 155px);
  z-index: 3;

  @media (max-width: 1220px) {
    transform: translate(-400px, 60px);
  }
`;

export default CoursePage;
