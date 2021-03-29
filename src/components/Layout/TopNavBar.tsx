import React, { useState } from "react";
import styled from "styled-components";
import AvatarButton from "./AvatarButton";
import AvatarPanel from "./AvatarPanel";
import NotificationButton from "./NotificationButton";
import NotificationPanel from "./NotificationPanel";
import SearchBar from "./SearchBar";
import { Skeleton } from "@material-ui/core";
import useFetchSemester from "../../hooks/useFetchSemester";
import { Semester } from "../../react-app-env";
import SemesterModal from "./SemesterModal";

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
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [semester, semesterStatus] = useFetchSemester();

  const renderSemester = () => {
    if (semesterStatus === "succeeded" && !semester) {
      return null;
    }
    if (semesterStatus === "loading") {
      return (
        <Skeleton
          variant="rectangular"
          animation="wave"
          width={200}
        />
      );
    }
    if (semesterStatus === "succeeded" && semester) {
      return (
        <SemesterLink onClick={() => setShowSemesterModal(true)}>
          {(semester as Semester).semesterName}
        </SemesterLink>
      );
    }
  };

  const renderSemesterModal = () => {
    if (semesterStatus === "succeeded" && !semester) {
      return null;
    }
    if (semesterStatus === "succeeded" && semester) {
      return (
        <SemesterModal
          showModal={showSemesterModal}
          setShowModal={setShowSemesterModal}
          name={(semester as Semester).semesterName}
          semester={semester as Semester}
        />
      );
    }
  };

  return (
    <>
      {renderSemesterModal()}
      <StyledTopNavBar>
        <SemesterContainer>{renderSemester()}</SemesterContainer>
        <SearchBarContainer onClick={handleClosePanel}>
          {semester ? <SearchBar /> : null}
        </SearchBarContainer>

        <UserSectionContainer>
          <NotificationButton onClick={setIsShowNotifyPanel} />

          {isShowNotifyPanel && (
            <NotificationPanelContainer>
              <NotificationPanel />
            </NotificationPanelContainer>
          )}
          <AvatarButton onClick={setIsShowAvatarPanel} />
          {isShowAvatarPanel && (
            <AvatarPanelContainer>
              <AvatarPanel />
            </AvatarPanelContainer>
          )}
        </UserSectionContainer>
      </StyledTopNavBar>
    </>
  );
};

// Styling
const StyledTopNavBar = styled.div`
  display: flex;
`;

const SearchBarContainer = styled.div`
  flex-grow: 1;
  margin: 0 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 500px) {
    margin-left: 0px;
  }
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

const SemesterLink = styled.a`
  font-size: 18px;
  font-weight: 500;
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: underline;
  color: #0070f3;
`;

const SemesterContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export default TopNavBar;
