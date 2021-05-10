import React, { useState } from "react";
import styled from "styled-components";
import AvatarButton from "./AvatarButton";
import AvatarPanel from "./AvatarPanel";
import NotificationButton from "./NotificationButton";
import NotificationPanel from "./NotificationPanel";
import { Box, Skeleton} from "@material-ui/core";
import { Semester, Registration } from "../../types/react-app-env";
import SemesterModal from "./SemesterModal";
import Countdown from "react-countdown";
import EditSemesterModal from "./EditSemesterModal";
import CloseSemesterModal from "./CloseSemesterModal";
import { unwrapResult } from "@reduxjs/toolkit";
import _ from "lodash";

// import reducers
import {
  setShowSuccessSnackBar,
  setShowErrorSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
import { editRegistration } from "../../reducers/registrationSlice";
// import hooks
import useGetRegistrationBySemester from "../../hooks/registration/useGetRegistrationBySemester";
import useGetOpenSemester from "../../hooks/semester/useGetOpenSemester";
import { useAppDispatch } from "../../store";
import { useLocation } from "react-router";
import AppSearchBar from "./AppSearchBar";

// component props
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
  // useState
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [showEditSemesterModal, setShowEditSemesterModal] = useState(
    false
  );
  const [
    showCloseSemesterModal,
    setShowCloseSemesterModal,
  ] = useState(false);
  const [
    closeRegistrationStatus,
    setCloseRegistrationStatus,
  ] = useState("idle");
  const dispatch = useAppDispatch();

  // * Call hooks
  const [semester, semesterStatus] = useGetOpenSemester();
  const [
    registrations,
    registrationStatus,
  ] = useGetRegistrationBySemester((semester as Semester)?._id);
  const location = useLocation();

  // event handler

  // handle close registration automatically
  const handleRegAutoClose = async () => {
    const clonedRegistration = _.cloneDeep(
      (registrations as Registration[]).find(
        (reg) => reg.isOpening === true
      )
    );
    if (clonedRegistration) {
      try {
        clonedRegistration.isOpening = false;
        setCloseRegistrationStatus("pending");
        const actionResult = await dispatch(
          editRegistration(clonedRegistration)
        );
        unwrapResult(actionResult);
        dispatch(setSnackBarContent("Registration closed"));
        dispatch(setShowSuccessSnackBar(true));
      } catch (err) {
        console.log("Failed to close registration", err);
        if (err.response) {
          dispatch(setSnackBarContent(err.response.data.message));
        } else {
          dispatch(
            setSnackBarContent("Failed to close registration")
          );
        }
        dispatch(setShowErrorSnackBar(true));
      } finally {
        setCloseRegistrationStatus("idle");
      }
    }
  };

  // conditional renderer
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

  const renderCountdown = () => {
    if (registrationStatus === "succeeded") {
      const openingReg = (registrations as Registration[]).find(
        (reg) => reg.isOpening === true
      );
      if (openingReg) {
        return (
          <Box display="none">
            <Countdown
              date={openingReg.endDate}
              onComplete={handleRegAutoClose}
            />
          </Box>
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
          {location.pathname !== "/" ? (
            <AppSearchBar />
          ) : (
            registrations.length > 0 && semester && <AppSearchBar />
          )}
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
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5rem;

  @media (max-width: 500px) {
    margin: 0 0.5rem;
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
