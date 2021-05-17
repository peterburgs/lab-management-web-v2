import React from "react";

import NavItem from "./NavItem";
import { ReactComponent as DashboardIcon } from "../../assets/images/dashboard-icon.svg";
import { ReactComponent as CourseIcon } from "../../assets/images/course-icon.svg";
import { ReactComponent as ScheduleIcon } from "../../assets/images/schedule-icon.svg";
import { ReactComponent as LabIcon } from "../../assets/images/lab-icon.svg";
import { ReactComponent as RequestIcon } from "../../assets/images/request-icon.svg";
import { ReactComponent as UserIcon } from "../../assets/images/user-icon.svg";

import styled, { css } from "styled-components";
import Burger from "./Burger";
import { useAppSelector } from "../../store";
import { ROLES } from "../../types/model";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const role = useAppSelector((state) => state.auth.verifiedRole);

  return (
    <StyledSidebar>
      <Header>
        <Burger isCollapsed={isCollapsed} onToggle={onToggle} />
        <AppName isCollapsed={isCollapsed}>Lab Management</AppName>
      </Header>
      <NavItemContainer>
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
          <NavItem
            isCollapsed={isCollapsed}
            path="/users"
            name="Users"
            icon={<UserIcon />}
          />
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
  padding: 20px 10px;
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

interface AppNameProps {
  isCollapsed: boolean;
}
const AppName = styled.span<AppNameProps>`
  color: white;
  font-size: 20px;
  font-weight: 500;
  margin-left: 15px;

  @media (max-width: 1220px) {
    margin-left: 15px;
  }

  ${({ isCollapsed }) =>
    isCollapsed &&
    css`
      display: none;
    `}
`;

const Copyright = styled.span<AppNameProps>`
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
