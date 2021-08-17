import React from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../store";
import { ROLES } from "../../types/model";
import OccupiedImage from "../../assets/images/occupied.png";
import moment from "moment";
import {
  setShowSuccessSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
import { IconButton } from "@material-ui/core";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";

interface UsageProps {
  startPeriod: number;
  endPeriod: number;
  courseName: string;
  lecturerName: string;
  id: string;
  lecturerId: string;
  checkInAt?: Date;
  checkOutAt?: Date;
  teachingId: string;
  onEditLabUsage: (id: string) => void;
  onRequestModifyLabUsage: (id: string) => void;
}

const Usage = ({
  startPeriod,
  endPeriod,
  courseName,
  lecturerName,
  id,
  lecturerId,
  teachingId,
  onEditLabUsage,
  onRequestModifyLabUsage,
  checkInAt,
  checkOutAt,
}: UsageProps) => {
  const convertPeriodToShift = (startPeriod: number, endPeriod: number) => {
    if (startPeriod >= 1 && endPeriod <= 5) {
      return 1;
    } else if (startPeriod >= 6 && endPeriod <= 12) {
      return 2;
    } else {
      return 3;
    }
  };

  const role = useAppSelector((state) => state.auth.verifiedRole);
  const user = useAppSelector((state) => state.auth.verifiedUser);

  const dispatch = useAppDispatch();

  return (
    <StyledUsage shift={convertPeriodToShift(startPeriod, endPeriod)}>
      {role === ROLES.ADMIN ? (
        <>
          <CourseName>{courseName}</CourseName>
          <LecturerName>{lecturerName}</LecturerName>
          <LecturerName>{lecturerId}</LecturerName>
          <Period>{`Period: ${startPeriod} - ${endPeriod}`}</Period>
          <CheckIn>
            Check in:{" "}
            {checkInAt
              ? moment(new Date(checkInAt)).format("HH:mm:ss DD/MM/YYYY")
              : "pending"}
          </CheckIn>
          <CheckOut>
            Check out:{" "}
            {checkInAt
              ? checkOutAt
                ? moment(new Date(checkOutAt)).format("HH:mm:ss DD/MM/YYYY")
                : "pending"
              : "pending"}
          </CheckOut>
          <TeachingID>
            Teaching ID:{" "}
            <IconButton
              onClick={() => {
                navigator.clipboard.writeText(teachingId);
                dispatch(setShowSuccessSnackBar(true));
                dispatch(setSnackBarContent("Copied to clipboard"));
              }}
              component="span"
            >
              <FileCopyOutlinedIcon fontSize="small" htmlColor="#fff" />
            </IconButton>
          </TeachingID>
        </>
      ) : lecturerId === user?._id ? (
        <>
          <CourseName>{courseName}</CourseName>
          <LecturerName>{lecturerName}</LecturerName>
          <LecturerName>{lecturerId}</LecturerName>
          <Period>{`Period: ${startPeriod} - ${endPeriod}`}</Period>
          <CheckIn>
            Check in:{" "}
            {checkInAt
              ? moment(new Date(checkInAt)).format("HH:mm:ss DD/MM/YYYY")
              : "pending"}
          </CheckIn>
          <CheckOut>
            Check out:{" "}
            {checkInAt
              ? checkOutAt
                ? moment(new Date(checkOutAt)).format("HH:mm:ss DD/MM/YYYY")
                : "pending"
              : "pending"}
          </CheckOut>
          <TeachingID>
            Teaching ID:{" "}
            <IconButton
              onClick={() => {
                navigator.clipboard.writeText(teachingId);
                dispatch(setShowSuccessSnackBar(true));
                dispatch(setSnackBarContent("Copied to clipboard"));
              }}
              component="span"
            >
              <FileCopyOutlinedIcon fontSize="small" htmlColor="#fff" />
            </IconButton>
          </TeachingID>
        </>
      ) : (
        <Text>OCCUPIED</Text>
      )}
      {role === ROLES.LECTURER ? (
        <ActionButtonContainer>
          {lecturerId === user?._id ? (
            <>
              <ActionButton onClick={() => onRequestModifyLabUsage(id)}>
                Modify
              </ActionButton>
            </>
          ) : null}
        </ActionButtonContainer>
      ) : null}
    </StyledUsage>
  );
};

interface StyledUsageProps {
  shift: number;
}

const StyledUsage = styled.div<StyledUsageProps>`
  background: ${({ shift }) =>
    shift === 1 ? "#C70039" : shift === 2 ? "#16C79A" : "#0075F6"};
  border-left: ${({ shift }) =>
    shift === 1
      ? "3px solid #810000"
      : shift === 2
      ? "3px solid #02383C"
      : "3px solid #0900C3"};
  height: 250px;
  display: flex;
  flex-direction: column;
  width: max-content;
  min-width: 9rem;
  max-width: 13rem;
  border-radius: 4px;
  padding: 4px;
  margin-right: 0.5rem;
  position: relative;
`;

const CourseName = styled.span`
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 0.5rem;
  color: white;
`;

const LecturerName = styled.span`
  font-size: 13px;
  margin-bottom: 0.5rem;
  font-style: italic;
  color: white;
`;

const Period = styled.span`
  font-size: 12px;
  margin-bottom: 0.5rem;
  color: white;
`;

const ActionButtonContainer = styled.div`
  display: flex;
  position: absolute;
  bottom: 10px;
  left: 0px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const ActionButton = styled.button`
  outline: none;
  background: white;
  color: black;
  border-radius: 4px;
  border: 1px solid white;
  cursor: pointer;
  margin: 0 2px;

  &:active {
    background-color: white;
    transform: scale(0.98);
    &:hover {
      background-color: white;
    }
  }

  &:hover {
    background-color: white;
    color: black;
  }
`;

const Text = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: italic;
  font-size: 18px;
  color: white;
`;

const CheckIn = styled.div`
  font-size: 13px;
  margin-bottom: 0.5rem;
  font-style: italic;
  color: white;
`;

const CheckOut = styled.div`
  font-size: 13px;
  margin-bottom: 0.5rem;
  font-style: italic;
  color: white;
`;

const TeachingID = styled.div`
  font-size: 13px;
  margin-bottom: 0.5rem;
  font-style: italic;
  color: white;
`;

export default Usage;
