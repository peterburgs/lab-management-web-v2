import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AvatarButton from "./AvatarButton";
import AvatarPanel from "./AvatarPanel";
import NotificationButton from "./NotificationButton";
import NotificationPanel from "./NotificationPanel";
import { Box } from "@material-ui/core";
import { Semester, Registration, SEMESTER_STATUSES } from "../../types/model";
import Countdown from "react-countdown";
import { unwrapResult } from "@reduxjs/toolkit";
import _ from "lodash";
import Clock from "react-live-clock";

// import reducers
import {
  setShowSuccessSnackBar,
  setShowErrorSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
import { editRegistration } from "../../reducers/registrationSlice";
// import hooks
import useGetRegistrationBySemester from "../../hooks/registration/useGetRegistrationBySemester";
import { useAppDispatch, useAppSelector } from "../../store";
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
  const dispatch = useAppDispatch();
  // * Call hooks

  const openSemester = useAppSelector((state) =>
    state.semesters.semesters.find(
      (item) => item.status === SEMESTER_STATUSES.OPENING
    )
  );

  const [registrations, registrationStatus] = useGetRegistrationBySemester(
    openSemester?._id
  );
  const location = useLocation();

  // event handler

  // handle close registration automatically
  const handleRegAutoClose = async () => {
    const clonedRegistration = _.cloneDeep(
      (registrations as Registration[]).find((reg) => reg.isOpening === true)
    );
    if (clonedRegistration) {
      try {
        clonedRegistration.isOpening = false;
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
          dispatch(setSnackBarContent("Failed to close registration"));
        }
        dispatch(setShowErrorSnackBar(true));
      }
    }
  };
  // useEffect to verify end date of registration
  useEffect(() => {
    const clonedRegistration = _.cloneDeep(
      (registrations as Registration[]).find((reg) => reg.isOpening === true)
    );
    if (clonedRegistration) {
      if (
        new Date(clonedRegistration.endDate).getTime() <= new Date().getTime()
      ) {
        (async () => {
          handleRegAutoClose();
        })();
      }
    }
  }, [registrations]);
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
      <StyledTopNavBar>
        <SearchBarContainer onClick={handleClosePanel}>
          {location.pathname !== "/schedule" &&
          location.pathname !== "/attendances" ? (
            location.pathname !== "/registration" ? (
              <AppSearchBar />
            ) : (
              registrations.length > 0 && openSemester && <AppSearchBar />
            )
          ) : null}
        </SearchBarContainer>

        <UserSectionContainer>
          {/* <NotificationButton onClick={setIsShowNotifyPanel} /> */}

          {/* {isShowNotifyPanel && (
            <NotificationPanelContainer>
              <NotificationPanel />
            </NotificationPanelContainer>
          )} */}
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
  margin-right: 10rem;

  @media (max-width: 500px) {
    margin-right: 1rem;
  }
`;

const UserSectionContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
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

const ClockContainer = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-right: calc(100% - 30%);
  border-radius: 3px;
  color: white;
  background-color: ${({ theme }) => theme.blue};
  padding-left: 0.5rem;

  @media (max-width: 500px) {
    margin-right: 1rem;
  }
`;

export default TopNavBar;
