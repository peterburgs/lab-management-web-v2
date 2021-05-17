import React, { useState } from "react";
import styled from "styled-components";
import {
  Lab,
  REQUEST_STATUSES,
  REQUEST_TYPES,
  ROLES,
  Teaching,
} from "../types/model";
import SimpleBar from "simplebar-react";
import Button from "../components/common/Button";
import Comment from "../components/request-detail-page/Comment";
import "simplebar/dist/simplebar.min.css";
import AddComment from "../components/request-detail-page/AddComment";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../store";
import { editRequest } from "../reducers/requestSlice";
import { editLabUsage } from "../reducers/scheduleSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  setShowErrorSnackBar,
  setShowSuccessSnackBar,
  setSnackBarContent,
} from "../reducers/notificationSlice";
import useGetAllLabUsages from "../hooks/schedule/useGetAllLabUsages";
import UsageInfo from "../components/request-detail-page/UsageInfo";
import useGetAllTeaching from "../hooks/teaching/useGetAllTeachings";
import useGetAllLabs from "../hooks/lab/useGetAllLabs";
import _ from "lodash";

const RequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const request = useAppSelector((state) =>
    state.requests.requests.find((item) => item._id === id)
  );
  const role = useAppSelector((state) => state.auth.verifiedRole);
  const users = useAppSelector((state) => state.users.users);
  const courses = useAppSelector((state) => state.courses.courses);
  const [labUsages] = useGetAllLabUsages();
  const [teachings] = useGetAllTeaching();
  const [labs] = useGetAllLabs();

  const [approveStatus, setApproveStatus] = useState("idle");
  const [denyStatus, setDenyStatus] = useState("idle");
  const dispatch = useAppDispatch();

  const handleApprove = async () => {
    if (request) {
      try {
        const clonedRequest = _.cloneDeep(request);
        clonedRequest.status = REQUEST_STATUSES.APPROVED;
        setApproveStatus("pending");
        const actionResult = await dispatch(
          editRequest(clonedRequest)
        );
        unwrapResult(actionResult);

        // TODO: IF TYPE == MODIFY: UPDATE LAB USAGE
        if (request.type === REQUEST_TYPES.MODIFY_LAB_USAGE) {
          if (labUsages.length > 0) {
            const labUsage = labUsages.filter(
              (item) => item._id === request.labUsage
            )[0];
            if (labUsage) {
              labUsage.lab = request.lab;
              labUsage.weekNo = request.weekNo;
              labUsage.dayOfWeek = request.dayOfWeek;
              labUsage.startPeriod = request.startPeriod;
              labUsage.endPeriod = request.endPeriod;

              const actionResult = await dispatch(
                editLabUsage(labUsage)
              );
              unwrapResult(actionResult);
            }
          }
        }

        // TODO: IF TYPE == ADD: CREATE LAB USAGE

        dispatch(setSnackBarContent("Approve request successfully"));
        dispatch(setShowSuccessSnackBar(true));
      } catch (err) {
        console.log("Failed to approve request", err);
        if (err.response) {
          dispatch(setSnackBarContent(err.response.data.message));
        } else {
          dispatch(setSnackBarContent("Failed to approve request"));
        }
        dispatch(setShowErrorSnackBar(true));
      }
    }
  };

  const handleDeny = async () => {
    if (request) {
      try {
        const clonedRequest = _.cloneDeep(request);
        clonedRequest.status = REQUEST_STATUSES.DENIED;
        setDenyStatus("pending");
        const actionResult = await dispatch(
          editRequest(clonedRequest)
        );
        unwrapResult(actionResult);

        dispatch(setSnackBarContent("Deny request successfully"));
        dispatch(setShowSuccessSnackBar(true));
      } catch (err) {
        console.log("Failed to deny request", err);
        if (err.response) {
          dispatch(setSnackBarContent(err.response.data.message));
        } else {
          dispatch(setSnackBarContent("Failed to deny request"));
        }
        dispatch(setShowErrorSnackBar(true));
      }
    }
  };

  const renderOldUsage = () => {
    if (request && labUsages.length > 0 && courses.length > 0) {
      const labUsage = labUsages.find(
        (item) => item._id === request.labUsage
      );
      if (labUsage) {
        const teaching = teachings.find(
          (item) => item._id === labUsage.teaching
        );
        if (teaching) {
          const course = courses.find(
            (item) => item._id === teaching.course
          );
          const lab = (labs as Lab[]).find(
            (item) => item._id === labUsage.lab
          );
          return (
            <UsageInfo
              courseName={course!.courseName}
              startPeriod={labUsage.startPeriod}
              endPeriod={labUsage.endPeriod}
              labName={lab!.labName}
              weekNo={labUsage.weekNo}
              dayOfWeek={labUsage.dayOfWeek}
            />
          );
        }
      }
    }
  };

  const renderNewUsage = () => {
    let teaching: Teaching | undefined;
    if (request && labUsages.length > 0 && courses.length > 0) {
      if (request.type === REQUEST_TYPES.MODIFY_LAB_USAGE) {
        const labUsage = labUsages.find(
          (item) => item._id === request.labUsage
        );
        if (labUsage) {
          teaching = teachings.find(
            (item) => item._id === labUsage.teaching
          );
        }
      }
      if (request.type === REQUEST_TYPES.ADD_EXTRA_CLASS) {
        teaching = teachings.find(
          (item) => item._id === request.teaching
        );
      }
      if (teaching) {
        const course = courses.find(
          (item) => item._id === teaching!.course
        );
        const lab = (labs as Lab[]).find(
          (item) => item._id === request.lab
        );
        return (
          <UsageInfo
            courseName={course!.courseName}
            startPeriod={request.startPeriod}
            endPeriod={request.endPeriod}
            labName={lab!.labName}
            weekNo={request.weekNo}
            dayOfWeek={request.dayOfWeek}
          />
        );
      }
    }
  };

  return (
    <SimpleBar
      style={{
        maxHeight: "calc(100% - 20px)",
      }}
    >
      <StyledRequestDetailPage>
        {request && users.length > 0 && labUsages.length > 0 && (
          <>
            <Header>
              <RequestInfo>
                <RequestTitle>{request.title}</RequestTitle>
                <Info>
                  <TypeBadge>{request.type}</TypeBadge>
                  <StatusBadge status={request.status}>
                    {request.status}
                  </StatusBadge>
                  <span>
                    {new Date(
                      request.updatedAt!.toString()
                    ).toDateString() +
                      " " +
                      new Date(
                        request.updatedAt!.toString()
                      ).getHours() +
                      ":" +
                      new Date(
                        request.updatedAt!.toString()
                      ).getMinutes() +
                      ":" +
                      new Date(
                        request.updatedAt!.toString()
                      ).getSeconds() +
                      " " +
                      `by ${
                        users.find(
                          (user) => user._id === request.user
                        )!.fullName
                      } ${
                        users.find(
                          (user) => user._id === request.user
                        )!.email
                      }`}
                  </span>
                </Info>
                <RequestDescription>
                  {request.description}
                </RequestDescription>
                {request.type === REQUEST_TYPES.MODIFY_LAB_USAGE && (
                  <>
                    <SmallText>Old usage:</SmallText>
                    {renderOldUsage()}
                  </>
                )}

                <SmallText>New usage:</SmallText>
                {renderNewUsage()}
              </RequestInfo>
              <Action>
                {request.status === REQUEST_STATUSES.PENDING &&
                  role === ROLES.ADMIN && (
                    <>
                      <ActionButton
                        loading={approveStatus === "pending"}
                        action="approve"
                        onClick={handleApprove}
                      >
                        Approve
                      </ActionButton>
                      <ActionButton
                        loading={denyStatus === "pending"}
                        action="deny"
                        onClick={handleDeny}
                      >
                        Deny
                      </ActionButton>
                    </>
                  )}
              </Action>
            </Header>

            <CommentListContainer>
              <Comment />
              <Comment />
            </CommentListContainer>
            <AddComment />
          </>
        )}
      </StyledRequestDetailPage>
    </SimpleBar>
  );
};

const StyledRequestDetailPage = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eaecef;
`;

const RequestInfo = styled.div`
  display: flex;
  flex-direction: column;

  & > * {
    margin-bottom: 0.5rem;
  }
`;

const RequestTitle = styled.div`
  font-size: 27px;
  font-weight: 400;
  display: flex;
  margin-bottom: 0.5rem;
`;

const Action = styled.div`
  display: flex;
  & > * {
    margin-left: 0.7rem;
  }
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${({ theme }) => theme.grey};
`;

const RequestDescription = styled.div`
  font-style: italic;
  line-height: 1.5;
  font-size: 15px;
`;

const TypeBadge = styled.div`
  background-color: #eae6ff;
  color: #403294;
  font-size: 12px;
  padding: 0.3rem;
  font-weight: 600;
  margin-right: 0.7rem;
  height: 24px;
`;

interface StatusBadgeProps {
  status: REQUEST_STATUSES;
}

const StatusBadge = styled.div<StatusBadgeProps>`
  background-color: ${({ status, theme }) =>
    status === REQUEST_STATUSES.PENDING
      ? theme.veryLightBlue
      : status === REQUEST_STATUSES.APPROVED
      ? theme.lightGreen
      : theme.lightRed};
  color: ${({ status, theme }) =>
    status === REQUEST_STATUSES.PENDING
      ? theme.blue
      : status === REQUEST_STATUSES.APPROVED
      ? theme.green
      : theme.red};
  font-size: 12px;
  padding: 0.3rem;
  font-weight: 600;
  margin-right: 0.7rem;
  height: 24px;
`;

interface ActionButtonProps {
  action: "approve" | "deny";
}

const ActionButton = styled(Button)<ActionButtonProps>`
  background-color: ${({ theme, action }) =>
    action === "approve" ? theme.lightGreen : theme.lightRed};
  box-shadow: none;
  color: ${({ theme, action }) =>
    action === "approve" ? theme.green : theme.red};
  font-weight: 500;
  font-size: 15px;
  padding: 0 0.7rem;
  border: 1px solid
    ${({ theme, action }) =>
      action === "approve" ? theme.green : theme.red};
  &:active {
    background-color: ${({ theme, action }) =>
      action === "approve" ? theme.lightGreen : theme.lightRed};
    &:hover {
      background-color: ${({ theme, action }) =>
        action === "approve" ? theme.lightGreen : theme.lightRed};
    }
  }

  &:hover {
    background-color: ${({ theme, action }) =>
      action === "approve" ? theme.lightGreen : theme.lightRed};
  }
`;

const CommentListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid #eaecef;
`;

const SmallText = styled.div`
  font-size: 12px;
`;

export default RequestDetailPage;
