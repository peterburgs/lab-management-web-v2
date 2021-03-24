import React from "react";
import styled from "styled-components";
import Avatar from "./Avatar";
import AvatarPanel from "./AvatarPanel";
import Notification from "./Notification";
import NotificationPanel from "./NotificationPanel";
import SearchBar from "./SearchBar";

interface TopNavBarProps {
  isShowNotifyPanel: boolean;
  setIsShowNotifyPanel: () => void;
  isShowAvatarPanel: boolean;
  setIsShowAvatarPanel: () => void;
  handleClosePanel: () => void;
}

const TopNavBar = ({
  isShowNotifyPanel,
  setIsShowNotifyPanel,
  isShowAvatarPanel,
  setIsShowAvatarPanel,
  handleClosePanel,
}: TopNavBarProps) => {
  return (
    <StyledTopNavBar>
      <SearchBarContainer onClick={handleClosePanel}>
        <SearchBar />
      </SearchBarContainer>
      <UserSectionContainer>
        <Notification onClick={setIsShowNotifyPanel} />

        {isShowNotifyPanel && (
          <NotificationPanelContainer>
            <NotificationPanel />
          </NotificationPanelContainer>
        )}
        <Avatar onClick={setIsShowAvatarPanel} />
        {isShowAvatarPanel && (
          <AvatarPanelContainer>
            <AvatarPanel />
          </AvatarPanelContainer>
        )}
      </UserSectionContainer>
    </StyledTopNavBar>
  );
};

// Styling
const StyledTopNavBar = styled.div`
  display: flex;
  align-items: center;
`;

const SearchBarContainer = styled.div`
  flex-basis: 520px;
  flex-grow: 1;
  flex-shrink: 1;
  margin-right: 1rem;
`;

const UserSectionContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1.5rem;
`;

const NotificationPanelContainer = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  transform: translate(-80px, 65px);
  z-index: 3;
`;

const AvatarPanelContainer = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  transform: translate(-20px, 65px);
  z-index: 3;
`;

export default TopNavBar;
