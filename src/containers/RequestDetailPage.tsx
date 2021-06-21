import React, { useState } from "react";
import styled from "styled-components";
import {
  Comment,
  Course,
  Lab,
  REQUEST_STATUSES,
  REQUEST_TYPES,
  ROLES,
  Semester,
  Teaching,
  User,
} from "../types/model";
import {
  Skeleton,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@material-ui/core";
import { styled as materialStyled } from "@material-ui/styles";
import SimpleBar from "simplebar-react";
import Button from "../components/common/Button";
import CommentComponent from "../components/request-detail-page/Comment";
import "simplebar/dist/simplebar.min.css";
import AddComment from "../components/request-detail-page/AddComment";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../store";
import { editRequest } from "../reducers/requestSlice";
import { editLabUsage, newLabUsage } from "../reducers/scheduleSlice";
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
import useGetCommentsByRequest from "../hooks/comment/useGetCommentsByRequest";
import useGetAllRequests from "../hooks/request/useGetAllRequests";
import useGetAllUsers from "../hooks/user/useGetAllUsers";
import useGetAllCourses from "../hooks/course/useGetAllCourses";
import useGetAllRegistrations from "../hooks/registration/useGetAllRegistrations";

const RequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  useGetAllRequests();

  const request = useAppSelector((state) =>
    state.requests.requests.find((item) => item._id === id)
  );

  const role = useAppSelector((state) => state.auth.verifiedRole);
  const semesters = useAppSelector((state) => state.semesters.semesters);
  const [users] = useGetAllUsers();
  const [courses] = useGetAllCourses();
  const [labUsages] = useGetAllLabUsages();
  const [teachings] = useGetAllTeaching();
  const [registrations] = useGetAllRegistrations();
  const [comments, commentStatus] = useGetCommentsByRequest(request);
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
        const actionResult = await dispatch(editRequest(clonedRequest));
        unwrapResult(actionResult);

        // UPDATE LAB USAGE
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

              const actionResult = await dispatch(editLabUsage(labUsage));
              unwrapResult(actionResult);
            }
          }
        }

        // CREATE LAB USAGE
        if (request.type === REQUEST_TYPES.ADD_EXTRA_CLASS) {
          const teaching = teachings.find(
            (item) => item._id === request.teaching
          );
          const reg = registrations.find(
            (item) => item._id === teaching?.registration
          );
          if (teaching && reg) {
            const semester = semesters.find(
              (item) => item._id === reg.semester
            );
            if (semester) {
              const labUsage = {
                lab: request.lab,
                teaching: teaching._id!,
                weekNo: request.weekNo,
                dayOfWeek: request.dayOfWeek,
                startPeriod: request.startPeriod,
                endPeriod: request.endPeriod,
                semester: semester._id!,
                isHidden: false,
              };

              const actionResult = await dispatch(newLabUsage(labUsage));
              unwrapResult(actionResult);
            } else {
              dispatch(setSnackBarContent("Cannot find semester"));
              return;
            }
          }
        }

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
        const actionResult = await dispatch(editRequest(clonedRequest));
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
      const labUsage = labUsages.find((item) => item._id === request.labUsage);
      if (labUsage) {
        const teaching = teachings.find(
          (item) => item._id === labUsage.teaching
        );
        const semester = semesters.find(
          (item) => item._id === labUsage.semester
        );
        if (teaching && semester) {
          const course = (courses as Course[]).find(
            (item) => item._id === teaching.course
          );
          const lab = (labs as Lab[]).find(
            (item) => item._id === request.oldLab
          );
          if (lab && course) {
            return (
              <CurrentUsage>
                <CurrentUsageHeader>Current Usage</CurrentUsageHeader>
                <StyledFormControl
                  variant="outlined"
                  style={{ color: "black" }}
                >
                  <InputLabel id="oldcourse-label">Course</InputLabel>
                  <Select
                    value={course._id}
                    label="Course"
                    inputProps={{ "aria-readonly": true }}
                  >
                    {(courses as Course[]).map((course, i) => (
                      <MenuItem value={course._id} key={course._id}>
                        {course.courseName}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
                <StyledFormControl
                  variant="outlined"
                  style={{ color: "black" }}
                >
                  <InputLabel id="oldlab-label">Lab</InputLabel>
                  <Select
                    value={lab._id}
                    label="Lab"
                    inputProps={{ "aria-readonly": true }}
                  >
                    {(labs as Lab[]).map((lab, i) => (
                      <MenuItem value={lab._id} key={lab._id}>
                        {lab.labName}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
                <StyledFormControl
                  variant="outlined"
                  style={{ color: "black" }}
                >
                  <InputLabel id="oldweekno-label">Week</InputLabel>
                  <Select
                    inputProps={{ "aria-readonly": true }}
                    labelId="oldweekno-label"
                    value={request.oldWeekNo}
                    label="Week"
                  >
                    {[...Array(semester.numberOfWeeks)].map((_, i) => (
                      <MenuItem value={i} key={"weekNo" + i}>
                        {i}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
                <StyledFormControl
                  variant="outlined"
                  style={{ color: "black" }}
                >
                  <InputLabel id="olddow-label">Day of week</InputLabel>
                  <Select
                    inputProps={{ "aria-readonly": true }}
                    labelId="olddow-label"
                    value={request.oldDayOfWeek}
                    label="Day of week"
                  >
                    <MenuItem value={0}>Monday</MenuItem>
                    <MenuItem value={1}>Tuesday</MenuItem>
                    <MenuItem value={2}>Wednesday</MenuItem>
                    <MenuItem value={3}>Thursday</MenuItem>
                    <MenuItem value={4}>Friday</MenuItem>
                    <MenuItem value={5}>Saturday</MenuItem>
                    <MenuItem value={6}>Sunday</MenuItem>
                  </Select>
                </StyledFormControl>
                <StyledFormControl
                  variant="outlined"
                  style={{ color: "black" }}
                >
                  <InputLabel id="oldstart-label">Start period</InputLabel>
                  <Select
                    inputProps={{ "aria-readonly": true }}
                    labelId="oldstart-label"
                    value={request.oldStartPeriod}
                    label="Start period"
                  >
                    {[...Array(15)].map((_, i) => (
                      <MenuItem value={i + 1} key={"startPeriod" + i}>
                        {i + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
                <StyledFormControl
                  variant="outlined"
                  style={{ color: "black" }}
                >
                  <InputLabel id="oldend-label">End period</InputLabel>
                  <Select
                    inputProps={{ "aria-readonly": true }}
                    labelId="oldend-label"
                    value={request.oldEndPeriod}
                    label="End period"
                  >
                    {[...Array(15)].map((_, i) => (
                      <MenuItem value={i + 1} key={"endPeriod" + i}>
                        {i + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </CurrentUsage>
            );
          }
        }
      }
    }
  };

  const renderNewUsage = () => {
    let teaching: Teaching | undefined;
    if (request && courses.length > 0) {
      if (request.type === REQUEST_TYPES.MODIFY_LAB_USAGE) {
        if (labUsages.length > 0) {
        }
        const labUsage = labUsages.find(
          (item) => item._id === request.labUsage
        );
        if (labUsage) {
          teaching = teachings.find((item) => item._id === labUsage.teaching);
        }
      }
      if (request.type === REQUEST_TYPES.ADD_EXTRA_CLASS) {
        teaching = teachings.find((item) => item._id === request.teaching);
      }
      if (teaching) {
        const course = (courses as Course[]).find(
          (item) => item._id === teaching!.course
        );
        const lab = (labs as Lab[]).find((item) => item._id === request.lab);
        if (lab && course) {
          return (
            <NewUsage>
              <NewUsageHeader>New Usage</NewUsageHeader>
              <StyledFormControl variant="outlined" style={{ color: "black" }}>
                <InputLabel id="oldcourse-label">Course</InputLabel>
                <Select
                  inputProps={{ "aria-readonly": true }}
                  value={course._id}
                  label="Course"
                >
                  {(courses as Course[]).map((course, i) => (
                    <MenuItem value={course._id} key={course._id}>
                      {course.courseName}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
              <StyledFormControl variant="outlined" style={{ color: "black" }}>
                <InputLabel id="oldlab-label">Lab</InputLabel>
                <Select
                  inputProps={{ "aria-readonly": true }}
                  value={lab._id}
                  label="Lab"
                >
                  {(labs as Lab[]).map((lab, i) => (
                    <MenuItem value={lab._id} key={lab._id}>
                      {lab.labName}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
              <StyledFormControl variant="outlined" style={{ color: "black" }}>
                <InputLabel id="oldweekno-label">Week</InputLabel>
                <Select
                  inputProps={{ "aria-readonly": true }}
                  labelId="oldweekno-label"
                  value={request.weekNo}
                  label="Week"
                >
                  <MenuItem value={request.weekNo}>{request.weekNo}</MenuItem>
                </Select>
              </StyledFormControl>
              <StyledFormControl variant="outlined" style={{ color: "black" }}>
                <InputLabel id="olddow-label">Day of week</InputLabel>
                <Select
                  inputProps={{ "aria-readonly": true }}
                  labelId="olddow-label"
                  value={request.dayOfWeek}
                  label="Day of week"
                >
                  <MenuItem value={0}>Monday</MenuItem>
                  <MenuItem value={1}>Tuesday</MenuItem>
                  <MenuItem value={2}>Wednesday</MenuItem>
                  <MenuItem value={3}>Thursday</MenuItem>
                  <MenuItem value={4}>Friday</MenuItem>
                  <MenuItem value={5}>Saturday</MenuItem>
                  <MenuItem value={6}>Sunday</MenuItem>
                </Select>
              </StyledFormControl>
              <StyledFormControl variant="outlined" style={{ color: "black" }}>
                <InputLabel id="oldstart-label">Start period</InputLabel>
                <Select
                  inputProps={{ "aria-readonly": true }}
                  labelId="oldstart-label"
                  value={request.startPeriod}
                  label="Start period"
                >
                  {[...Array(15)].map((_, i) => (
                    <MenuItem value={i + 1} key={"startPeriod" + i}>
                      {i + 1}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
              <StyledFormControl variant="outlined" style={{ color: "black" }}>
                <InputLabel id="oldend-label">End period</InputLabel>
                <Select
                  inputProps={{ "aria-readonly": true }}
                  labelId="oldend-label"
                  value={request.endPeriod}
                  label="End period"
                >
                  {[...Array(15)].map((_, i) => (
                    <MenuItem value={i + 1} key={"endPeriod" + i}>
                      {i + 1}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
            </NewUsage>
          );
        }
      }
    }
  };

  return (
    <StyledRequestDetailPage>
      {request &&
      users.length > 0 &&
      labUsages.length > 0 &&
      courses.length > 0 &&
      labs.length > 0 ? (
        <ScrollArea>
          <>
            <Header>
              <RequestInfo>
                <RequestTitle>{request.title}</RequestTitle>
                <Info>
                  <TypeBadge>
                    {request.type === REQUEST_TYPES.MODIFY_LAB_USAGE
                      ? "MODIFY LAB USAGE"
                      : "ADD EXTRA CLASS"}
                  </TypeBadge>
                  <StatusBadge status={request.status}>
                    {request.status === REQUEST_STATUSES.PENDING
                      ? "PENDING"
                      : request.status === REQUEST_STATUSES.APPROVED
                      ? "APPROVED"
                      : "DENIED"}
                  </StatusBadge>
                  <span>
                    {"Created at " +
                      new Date(request.updatedAt!.toString()).toDateString() +
                      " " +
                      new Date(request.updatedAt!.toString()).getHours() +
                      ":" +
                      new Date(request.updatedAt!.toString()).getMinutes() +
                      ":" +
                      new Date(request.updatedAt!.toString()).getSeconds() +
                      " " +
                      `by ${
                        (users as User[]).find(
                          (user) => user._id === request.user
                        )!.fullName
                      } ${
                        (users as User[]).find(
                          (user) => user._id === request.user
                        )!.email
                      }`}
                  </span>
                </Info>
                <RequestDescription>
                  {request.description ? request.description : "No description"}
                </RequestDescription>
                <UsageContainer>
                  {request.type === REQUEST_TYPES.MODIFY_LAB_USAGE && (
                    <>{renderOldUsage()}</>
                  )}

                  {renderNewUsage()}
                </UsageContainer>
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
            {commentStatus === "pending" ? (
              <SkeletonContainer>
                <Skeleton variant="rectangular" height={40} animation="wave" />
                <Skeleton variant="rectangular" height={40} animation="wave" />
                <Skeleton variant="rectangular" height={40} animation="wave" />
                <Skeleton variant="rectangular" height={40} animation="wave" />
              </SkeletonContainer>
            ) : commentStatus === "succeeded" ? (
              <CommentListContainer>
                {(comments as Comment[]).map((comment) => (
                  <CommentComponent
                    key={comment._id}
                    avatarUrl={
                      (users as User[]).find(
                        (user) => user._id === comment.user
                      )!.avatarUrl
                    }
                    createdAt={comment.createdAt!}
                    text={comment.text}
                  />
                ))}
              </CommentListContainer>
            ) : (
              <CommentListContainer>No comments yet</CommentListContainer>
            )}

            <AddComment request={request._id} />
          </>
        </ScrollArea>
      ) : (
        <PageSkeletonContainer>
          <Skeleton variant="rectangular" height={80} animation="wave" />
          <Skeleton variant="rectangular" height={250} animation="wave" />
          <Skeleton variant="rectangular" height={40} animation="wave" />
        </PageSkeletonContainer>
      )}
    </StyledRequestDetailPage>
  );
};

const StyledRequestDetailPage = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const ScrollArea = styled.div`
  overflow: auto;
  margin-bottom: 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.blue};
`;

const RequestInfo = styled.div`
  display: flex;
  width: 100%;
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
    ${({ theme, action }) => (action === "approve" ? theme.green : theme.red)};
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
  border-bottom: 1px solid ${({ theme }) => theme.blue};
`;

const SmallText = styled.div`
  font-size: 12px;
`;

const SkeletonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-row-gap: 1rem;
`;
const PageSkeletonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 2fr 4fr 1fr;
  grid-row-gap: 1rem;
`;
const CurrentUsage = styled.div`
  border-radius: 7px;
  box-shadow: ${({ theme }) => theme.greyShadow};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const NewUsage = styled.div`
  border-radius: 7px;
  box-shadow: ${({ theme }) => theme.greyShadow};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const CurrentUsageHeader = styled.div`
  font-size: 18px;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.blue};
`;

const NewUsageHeader = styled.div`
  font-size: 18px;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.red};
`;

const UsageContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 1rem;
  column-gap: 1rem;
  width: 100%;
  padding: 1rem;
`;

const StyledFormControl = materialStyled(FormControl)({
  marginBottom: "1rem",
  marginTop: "0.5rem",
});

export default RequestDetailPage;
