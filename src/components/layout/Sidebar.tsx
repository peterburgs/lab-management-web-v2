import React from "react";

import NavItem from "./NavItem";
import { ReactComponent as DashboardIcon } from "../../assets/images/dashboard-icon.svg";
import { ReactComponent as CourseIcon } from "../../assets/images/course-icon.svg";
import { ReactComponent as ScheduleIcon } from "../../assets/images/schedule-icon.svg";
import { ReactComponent as LabIcon } from "../../assets/images/lab-icon.svg";
import { ReactComponent as RequestIcon } from "../../assets/images/request-icon.svg";
import { ReactComponent as UserIcon } from "../../assets/images/user-icon.svg";
import { ReactComponent as AcademicYearIcon } from "../../assets/images/academic-year-icon.svg";

import styled, { css } from "styled-components";
import Burger from "./Burger";
import { useAppSelector } from "../../store";
import { AcademicYear, ROLES, Semester, SEMESTER_STATUSES } from "../../types/model";
import { Skeleton } from "@material-ui/core";
import useGetAllSemester from "../../hooks/semester/useGetAllSemester";
import useGetAllAcademicYears from "../../hooks/academicYear/useGetAllAcademicYears";
import { useHistory } from "react-router";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const role = useAppSelector((state) => state.auth.verifiedRole);

  const history = useHistory();
  const [semesters, semesterStatus] = useGetAllSemester();
  const [academicYears, academicYearStatus] =
    useGetAllAcademicYears();

  // conditional renderer
  const renderBreadcrumbs = () => {
    if (
      semesterStatus === "pending" ||
      academicYearStatus === "pending"
    ) {
      return (
        <Breadcrumbs isCollapsed={isCollapsed}>
          <Skeleton
            variant="rectangular"
            animation="wave"
            width={200}
          />
        </Breadcrumbs>
      );
    }
    if (
      semesterStatus === "succeeded" &&
      academicYearStatus === "succeeded"
    ) {
      const openAcademicYear = (academicYears as AcademicYear[]).find(
        (item) => item.isOpening === true
      );
      const openSemester = (semesters as Semester[]).find(
        (item) => item.status === SEMESTER_STATUSES.OPENING
      );
      if (openAcademicYear && openSemester) {
        return (
          <Breadcrumbs isCollapsed={isCollapsed}>
            <span onClick={() => history.push("/academic-years")}>
              {(openAcademicYear as AcademicYear).name}
            </span>{" "}
            /{" "}
            <span
              onClick={() =>
                history.push(
                  `/academic-years/semesters/${
                    (openSemester as Semester)._id
                  }`
                )
              }
            >
              {(openSemester as Semester).semesterName}
            </span>
          </Breadcrumbs>
        );
      } else {
        <Breadcrumbs isCollapsed={isCollapsed}>
          <span>No opening semester</span>
        </Breadcrumbs>;
      }
    }
    return (
      <Breadcrumbs isCollapsed={isCollapsed}>
        <span>No opening semester</span>
      </Breadcrumbs>
    );
  };

  return (
    <StyledSidebar>
      <Header>
        <Burger isCollapsed={isCollapsed} onToggle={onToggle} />
        <Container isCollapsed={isCollapsed}>
          <AppName>Lab Management</AppName>
        </Container>
      </Header>
      {renderBreadcrumbs()}
      <NavItemContainer>
        {role === ROLES.ADMIN ? (
          <>
            <NavItem
              isCollapsed={isCollapsed}
              path="/academic-years"
              name="Academic years"
              icon={<AcademicYearIcon />}
            />
          </>
        ) : null}
        <NavItem
          isCollapsed={isCollapsed}
          path="/registration"
          name="Registration"
          icon={<DashboardIcon />}
        />
        <NavItem
          isCollapsed={isCollapsed}
          path="/courses"
          name="Courses"
          icon={<CourseIcon />}
        />
        <NavItem
          isCollapsed={isCollapsed}
          path="/labs"
          name="Labs"
          icon={<LabIcon />}
        />
        <NavItem
          isCollapsed={isCollapsed}
          path="/requests"
          name="Requests"
          icon={<RequestIcon />}
        />
        {role === ROLES.ADMIN ? (
          <>
            <NavItem
              isCollapsed={isCollapsed}
              path="/users"
              name="Users"
              icon={<UserIcon />}
            />
          </>
        ) : null}

        <NavItem
          isCollapsed={isCollapsed}
          path="/schedule"
          name="Schedule"
          icon={<ScheduleIcon />}
        />
      </NavItemContainer>
      <Footer>
        <Copyright isCollapsed={isCollapsed}>
          © Peter Burgs & Starea 2021
        </Copyright>
      </Footer>
    </StyledSidebar>
  );
};

// Styling
const StyledSidebar = styled.div`
  background: ${({ theme }) => theme.blue};
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 10px 10px 0px 10px;
  margin: 12px;
  display: flex;
  align-items: center;
`;

const Footer = styled.div`
  padding: 20px 10px;
  margin: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AppName = styled.span`
  color: white;
  font-size: 18px;
  font-weight: 500;
  margin-left: 15px;

  @media (max-width: 1220px) {
    margin-left: 15px;
  }
`;

interface ContainerProps {
  isCollapsed: boolean;
}

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;

  ${({ isCollapsed }) =>
    isCollapsed &&
    css`
      display: none;
    `}
`;

const Breadcrumbs = styled.div<ContainerProps>`
  display: flex;
  margin: 0px 12px 12px 12px;
  justify-content: center;
  align-items: center;
  color: white;
  & > span {
    text-decoration: underline;
    cursor: pointer;
    color: white;
    font-size: 12px;
    margin: 0 0.5rem;
  }
  ${({ isCollapsed }) =>
    isCollapsed &&
    css`
      display: none;
    `}
`;

const Copyright = styled.span<ContainerProps>`
  color: white;
  font-size: 14px;
  font-weight: 400;
  opacity: 0.7;

  ${({ isCollapsed }) =>
    isCollapsed &&
    css`
      display: none;
    `}
`;

const NavItemContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin: 0px 12px 12px 12px;
`;

export default Sidebar;
