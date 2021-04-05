import React from "react";
import styled from "styled-components";
import { ReactComponent as Image } from "../../assets/images/notify.svg";

const NotificationPanel = () => {
  return (
    <StyledNotificationPanel>
      <Header>Notifications</Header>
      <NotificationItemContainer>
        <NotificationImage>
          <Image />
        </NotificationImage>
      </NotificationItemContainer>
    </StyledNotificationPanel>
  );
};

const StyledNotificationPanel = styled.div`
  box-shadow: ${({ theme }) => theme.greyShadow};
  border-radius: 8px;
  border: ${({ theme }) => `1px solid ${theme.lightGrey}`};
  opacity: 1;
  padding: 1rem;
  width: 400px;
  height: 400px;
  background: white;
  display: flex;
  flex-direction: column;
  z-index: 5;

  @media (max-width: 600px) {
    width: 300px;
    height: 300px;
  }
`;

const Header = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.5);
`;

const NotificationItemContainer = styled.div`
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const NotificationImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  svg {
    width: 100%;
    height: 100%;
  }
  &:hover {
    svg {
      fill: black;
    }
  }
`;

export default NotificationPanel;
