import React, { ReactNode } from "react";
import { NavLink } from "react-router-dom";

import styled from "styled-components";

interface NavItemProps {
  path: string;
  name: string;
  icon: ReactNode;
  isCollapsed: boolean;
  onClick: () => void;
}

const NavItem = ({ path, name, icon, isCollapsed, onClick }: NavItemProps) => {
  return (
    <StyledNavItem
      to={path}
      exact
      activeClassName="selected"
      replace={true}
      onClick={onClick}
    >
      <NavItemIcon>{icon}</NavItemIcon>
      <NavItemText isCollapsed={isCollapsed}>{name}</NavItemText>
    </StyledNavItem>
  );
};

// Styling
const StyledNavItem = styled(NavLink)`
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  padding: 12px 12px;
  display: flex;
  align-items: center;
  opacity: 0.85;
  &:hover {
    opacity: 1;
    background-color: rgba(255, 255, 255, 0.2);
  }

  &.selected {
    background-color: rgba(0, 0, 0, 0.2);
    opacity: 1;
  }
`;

const NavItemIcon = styled.span`
  color: white;
  display: flex;
  align-items: center;
  height: auto;
  margin-right: 15px;
  & > svg {
    fill: white;
    width: 20px;
    height: 20px;
  }
`;

interface NavItemTextProps {
  isCollapsed: boolean;
}
const NavItemText = styled.span<NavItemTextProps>`
  color: white;
  font-size: 14px;
  font-weight: 500;
  display: ${({ isCollapsed }) => (isCollapsed ? "none" : "block")};
`;

export default NavItem;
