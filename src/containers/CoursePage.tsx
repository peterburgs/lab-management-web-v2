import React, { useState } from "react";
import styled from "styled-components";
import { Column } from "react-table";
import Table from "../components/common/Table";
import Button from "../components/common/Button";
import IconButton from "../components/common/IconButton";
import { Skeleton, Tooltip } from "@material-ui/core";
import NewCourseModal from "../components/course-page/NewCourseModal";
import AddIcon from "@material-ui/icons/Add";
import EditCourseModal from "../components/course-page/EditCourseModal";
import PrivateRoute from "./PrivateRoute";
import DeleteCourseModal from "../components/course-page/DeleteCourseModal";
import RefreshIcon from "@material-ui/icons/Refresh";

// import models
import { Course } from "../react-app-env";

// import reducers

// import hooks
import useGetAllCourses from "../hooks/course/useGetAllCourses";
import { useAppDispatch, useAppSelector } from "../store";
import { useHistory } from "react-router";
import { resetState as resetCourseState } from "../reducers/courseSlice";

type CourseTable = {
  rowId: string;
  id: string;
  name: string;
  numberOfCredits: number;
  createdAt: string;
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
        createdAt: new Date(course.createdAt).toDateString(),
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
  const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(
    false
  );
  const [courseIdToDelete, setCourseIdToDelete] = useState<string>(
    null!
  );

  // * Call API
  const [courses, courseStatus] = useGetAllCourses();

  // call hooks
  const courseSearchText = useAppSelector(
    (state) => state.search.courseSearchText
  );
  const role = useAppSelector((state) => state.auth.verifiedRole);
  const history = useHistory();
  const dispatch = useAppDispatch();

  // event handling

  const handleRefreshData = () => {
    dispatch(resetCourseState());
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
      },
      {
        Header: "Course Name",
        accessor: "name" as const,
      },
      {
        Header: "Number of credits",
        accessor: "numberOfCredits" as const,
      },
      {
        Header: "Created At",
        accessor: "createdAt" as const,
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
          isAllowEditDelete={role === "ADMIN"}
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
          isAllowEditDelete={role === "ADMIN"}
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
        roles={["ADMIN"]}
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
          <Action isAdmin={role === "ADMIN"}>
            <Tooltip title="Refresh table data">
              <IconButtonContainer>
                <IconButton
                  onClick={handleRefreshData}
                  icon={<RefreshIcon fontSize="small" />}
                />
              </IconButtonContainer>
            </Tooltip>
            {role === "ADMIN" && (
              <Button
                icon={<AddIcon />}
                onClick={() => setShowNewCourseModal(true)}
              >
                New course
              </Button>
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
  justify-content: flex-end;
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
    isAdmin ? "1fr 1fr" : "1fr"};
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

const IconButtonContainer = styled.div`
  display: flex;
  width: 40px;
  box-sizing: border-box;
  justify-self: end;
`;

export default CoursePage;
