import React, { useState } from "react";
import styled from "styled-components";
import AvatarButton from "./AvatarButton";
import AvatarPanel from "./AvatarPanel";
import NotificationButton from "./NotificationButton";
import NotificationPanel from "./NotificationPanel";
import SearchBar from "./SearchBar";
import { Hidden, Skeleton } from "@material-ui/core";
import { Semester, Registration } from "../../react-app-env";
import SemesterModal from "./SemesterModal";
import { useAppSelector } from "../../store";
import Countdown from "react-countdown";
import EditSemesterModal from "./EditSemesterModal";
import CloseSemesterModal from "./CloseSemesterModal";

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
  const [showEditSemesterModal, setShowEditSemesterModal] = useState(
    false
  );
  const [
    showCloseSemesterModal,
    setShowCloseSemesterModal,
  ] = useState(false);

  const semesterStatus = useAppSelector(
    (state) => state.semester.status
  );
  const semester = useAppSelector((state) => state.semester.semester);

  const registrations = useAppSelector(
    (state) => state.registrations.registrations
  );
  const registrationStatus = useAppSelector(
    (state) => state.registrations.status
  );

  const renderSemester = () => {
    if (semesterStatus === "pending") {
      return (
        <Skeleton
          variant="rectangular"
          animation="wave"
          width={200}
        />
      );
    }
    if (semesterStatus === "succeeded") {
      return (
        <SemesterLink onClick={() => setShowSemesterModal(true)}>
          {(semester as Semester).semesterName}
        </SemesterLink>
      );
    }
    return null;
  };

  const renderSemesterModal = () => {
    if (semesterStatus === "succeeded") {
      return (
        <>
          <CloseSemesterModal
            name={`Do you want you close ${
              (semester as Semester).semesterName
            }`}
            showModal={showCloseSemesterModal}
            setShowModal={setShowCloseSemesterModal}
            setShowSemesterModal={setShowSemesterModal}
          />
          <EditSemesterModal
            name={"Edit Semester"}
            showModal={showEditSemesterModal}
            setShowModal={setShowEditSemesterModal}
          />
          <SemesterModal
            showModal={showSemesterModal}
            setShowModal={setShowSemesterModal}
            name={(semester as Semester).semesterName}
            semester={semester as Semester}
            setShowEditSemesterModal={setShowEditSemesterModal}
            setShowCloseSemesterModal={setShowCloseSemesterModal}
          />
        </>
      );
    }
    return null;
  };

  const handleRegAutoClose = () => {
    console.log("Hello");
  };

  const renderCountdown = () => {
    if (registrationStatus === "succeeded") {
      const openingReg = (registrations as Registration[]).find(
        (reg) => reg.isOpening === true
      );
      if (openingReg) {
        return (
          <Hidden xsUp implementation="css">
            <Countdown
              date={openingReg.endDate}
              onComplete={handleRegAutoClose}
            />
          </Hidden>
        );
      }
      return null;
    }
    return null;
  };

  return (
    <>
      {renderCountdown()}
      {renderSemesterModal()}
      <StyledTopNavBar>
        <SemesterContainer>{renderSemester()}</SemesterContainer>
        <SearchBarContainer onClick={handleClosePanel}>
          {registrationStatus === "succeeded" ? <SearchBar /> : null}
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
  color: ${({ theme }) => theme.blue};
`;

const SemesterContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export default TopNavBar;
