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
  box-shadow: 0 4px 12px 0 rgb(0 0 0 / 10%);
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  opacity: 1;
  padding: 1rem;
  width: 400px;
  height: 400px;
  background: white;
  display: flex;
  flex-direction: column;
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
