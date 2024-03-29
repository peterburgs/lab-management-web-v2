import { Tooltip } from "@material-ui/core";
import React from "react";
import styled, { css } from "styled-components";
import { ReactComponent as Icon } from "../../assets/images/notification-icon.svg";

interface NotificationButtonProps {
  onFocus?: () => void;
  onBlur?: () => void;
  onClick?: () => void;
}

const NotificationButton = ({
  onFocus,
  onBlur,
  onClick,
}: NotificationButtonProps) => {
  return (
    <Tooltip title="Notification">
      <StyledNotification
        badge={"1"}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
      >
        <NotificationIcon>
          <Icon />
        </NotificationIcon>
      </StyledNotification>
    </Tooltip>
  );
};

// Styling

interface StyledNotificationProps {
  badge?: string;
}

const StyledNotification = styled.button<StyledNotificationProps>`
  border: none;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  background: transparent;
  display: inline-block;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  ${({ badge }) =>
    badge &&
    css`
      position: relative;
      &:after {
        position: absolute;
        right: -5px;
        top: -4px;
        min-width: ${badge.length === 1 ? "22px" : "10px"};
        min-height: 10px;
        line-height: 10px;
        padding: 5px;
        color: white;
        background-color: ${({ theme }) => theme.red};
        font-size: 10px;
        border-radius: 20px;
        content: "${badge}";
      }
    `}
`;

const NotificationIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: auto;
  svg {
    fill: black;
    width: 22px;
  }
  &:hover {
    svg {
      fill: ${({ theme }) => theme.blue};
    }
  }
`;

export default NotificationButton;
