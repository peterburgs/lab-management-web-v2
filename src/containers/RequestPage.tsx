import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import {
  REQUEST_STATUSES,
  User,
  Request,
  ROLES,
} from "../types/model";
import HourglassEmptyOutlinedIcon from "@material-ui/icons/HourglassEmptyOutlined";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
} from "@material-ui/core";
import useGetAllUsers from "../hooks/user/useGetAllUsers";
import RequestCard from "../components/request-page/RequestCard";
import "simplebar/dist/simplebar.min.css";
import SimpleBar from "simplebar-react";
import useGetAllRequests from "../hooks/request/useGetAllRequests";
import { ReactComponent as NothingImage } from "../assets/images/nothing.svg";
import _ from "lodash";
import { useAppSelector } from "../store";
import useGetAllComments from "../hooks/comment/useGetAllComments";
import moment from "moment";

enum SORT_BY {
  NEWEST,
  OLDEST,
}

const RequestPage = () => {
  const [selectedStatus, setSelectedStatus] =
    useState<REQUEST_STATUSES>(REQUEST_STATUSES.PENDING);

  const [sortBy, setSortBy] = useState<SORT_BY>(null!);
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [filteredRequests, setFilterRequests] = useState<Request[]>(
    []
  );

  // call hooks
  const requestSearchText = useAppSelector(
    (state) => state.search.requestSearchText
  );
  const handleSelectStatus = (status: REQUEST_STATUSES) => {
    setSelectedStatus(status);
  };
  const [users, userStatus] = useGetAllUsers();
  const [requests, requestStatus] = useGetAllRequests();
  const [comments] = useGetAllComments();

  const role = useAppSelector((state) => state.auth.verifiedRole);
  const lecturer = useAppSelector(
    (state) => state.auth.verifiedUser?._id
  );

  // conditional renderer
  const conditionalRenderer = () => {
    if (requestStatus === "pending" || requestStatus === "idle") {
      return (
        <SkeletonContainer>
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
        </SkeletonContainer>
      );
    } else if (filteredRequests.length > 0 && users.length > 0) {
      return (
        <SimpleBar
          style={{
            maxHeight: "calc(100% - 70px)",
          }}
        >
          <RequestListContainer>
            {(filteredRequests as Request[]).map((request) => {
              if (request.status === REQUEST_STATUSES.PENDING) {
                return (
                  <RequestCard
                    key={request._id}
                    title={request.title}
                    type={request.type}
                    status={request.status}
                    pendingAt={request.updatedAt}
                    requestId={request._id}
                    user={
                      (users as User[]).find(
                        (user) => user._id === request.user
                      )!
                    }
                    numberOfComments={
                      comments.filter(
                        (item) => item.request === request._id
                      ).length
                    }
                  />
                );
              } else if (
                request.status === REQUEST_STATUSES.APPROVED
              ) {
                return (
                  <RequestCard
                    key={request._id}
                    title={request.title}
                    type={request.type}
                    status={request.status}
                    approvedAt={request.updatedAt}
                    requestId={request._id}
                    user={
                      (users as User[]).find(
                        (user) => user._id === request.user
                      )!
                    }
                    numberOfComments={
                      comments.filter(
                        (item) => item.request === request._id
                      ).length
                    }
                  />
                );
              }
              return (
                <RequestCard
                  key={request._id}
                  title={request.title}
                  type={request.type}
                  status={request.status}
                  deniedAt={request.updatedAt}
                  requestId={request._id}
                  user={
                    (users as User[]).find(
                      (user) => user._id === request.user
                    )!
                  }
                  numberOfComments={123}
                />
              );
            })}
          </RequestListContainer>
        </SimpleBar>
      );
    } else {
      return (
        <NotFoundContainer>
          <NothingImage />
          <span>There is no requests yet</span>
        </NotFoundContainer>
      );
    }
  };

  useEffect(() => {
    let filteredRequests = (requests as Request[]).filter(
      (request) =>
        request.status === selectedStatus &&
        request.title
          .toLowerCase()
          .includes(requestSearchText.toLowerCase())
    );

    if (sortBy === SORT_BY.NEWEST) {
      filteredRequests.sort((a, b) =>
        moment(b.updatedAt).diff(moment(a.updatedAt))
      );
    }

    if (sortBy === SORT_BY.OLDEST) {
      filteredRequests.sort((a, b) =>
        moment(a.updatedAt).diff(moment(b.updatedAt))
      );
    }

    if (selectedAuthor) {
      filteredRequests = filteredRequests.filter(
        (item) => item.user === selectedAuthor
      );
    }

    setFilterRequests(filteredRequests);
  }, [
    requests,
    selectedStatus,
    requestSearchText,
    sortBy,
    selectedAuthor,
  ]);

  useEffect(() => {
    if (lecturer && role) {
      if (role === ROLES.LECTURER) {
        setFilterRequests(
          _.cloneDeep(
            (requests as Request[]).filter(
              (request) =>
                request.user === lecturer &&
                request.status === selectedStatus &&
                request.title
                  .toLowerCase()
                  .includes(requestSearchText.toLowerCase())
            )
          )
        );
      }
    }
  }, [lecturer, role, requests, selectedStatus, requestSearchText]);

  return (
    <StyledRequestPage>
      {userStatus === "succeeded" && requestStatus === "succeeded" && (
        <Toolbar>
          <StatusContainer>
            <SelectStatusButton
              isSelected={selectedStatus === REQUEST_STATUSES.PENDING}
              onClick={() =>
                handleSelectStatus(REQUEST_STATUSES.PENDING)
              }
            >
              <HourglassEmptyOutlinedIcon fontSize="small" />
              <span>
                {`${
                  (requests as Request[]).filter(
                    (request) =>
                      request.status === REQUEST_STATUSES.PENDING
                  ).length
                } pending`}
              </span>
            </SelectStatusButton>
            <SelectStatusButton
              isSelected={
                selectedStatus === REQUEST_STATUSES.APPROVED
              }
              onClick={() =>
                handleSelectStatus(REQUEST_STATUSES.APPROVED)
              }
            >
              <CheckIcon fontSize="small" />
              <span>{`${
                (requests as Request[]).filter(
                  (request) =>
                    request.status === REQUEST_STATUSES.APPROVED
                ).length
              } approved`}</span>
            </SelectStatusButton>
            <SelectStatusButton
              isSelected={selectedStatus === REQUEST_STATUSES.DENIED}
              onClick={() =>
                handleSelectStatus(REQUEST_STATUSES.DENIED)
              }
            >
              <CloseIcon fontSize="small" />
              <span>{`${
                (requests as Request[]).filter(
                  (request) =>
                    request.status === REQUEST_STATUSES.DENIED
                ).length
              } denied`}</span>
            </SelectStatusButton>
          </StatusContainer>
          <Filter isAdmin={role === ROLES.ADMIN}>
            <FormControl variant="standard" style={{ minWidth: 120 }}>
              <InputLabel id="sort-by-label">Sort By</InputLabel>
              <Select
                margin="none"
                labelId="sort-by-label"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort by"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>

                <MenuItem value={SORT_BY.NEWEST}>Newest</MenuItem>
                <MenuItem value={SORT_BY.OLDEST}>Oldest</MenuItem>
              </Select>
            </FormControl>
            {role === ROLES.ADMIN && (
              <FormControl
                variant="standard"
                style={{ minWidth: 120 }}
              >
                <InputLabel id="author-label">Author</InputLabel>
                <Select
                  margin="none"
                  labelId="author-label"
                  value={selectedAuthor}
                  onChange={(e) => setSelectedAuthor(e.target.value)}
                  label="Author"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {(users as User[]).map((user) => (
                    <MenuItem value={user._id} key={user._id}>
                      {user.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Filter>
        </Toolbar>
      )}
      {conditionalRenderer()}
    </StyledRequestPage>
  );
};

const StyledRequestPage = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const RequestListContainer = styled.div`
  margin-top: 1rem;
  height: 100%;
  overflow: hidden;
`;

interface FilterProps {
  isAdmin: boolean;
}

const Filter = styled.div<FilterProps>`
  display: grid;
  grid-template-columns: ${({ isAdmin }) =>
    isAdmin ? "1fr 1fr" : "1fr"};
  justify-content: center;
  align-items: center;
  column-gap: 1rem;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  border-radius: 7px;
  background: #f6f8fa;
  padding: 0.5rem;
`;

const StatusContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

interface SelectStatusButtonProps {
  isSelected: boolean;
}

const SelectStatusButton = styled.button<SelectStatusButtonProps>`
  font-size: 16px;
  outline: none;
  background: none;
  cursor: pointer;
  margin: 0 0.1rem;
  border: none;
  opacity: 0.5;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  ${({ isSelected }) =>
    isSelected &&
    css`
      opacity: 1;
    `}

  & > span {
    margin-left: 0.2rem;
  }
`;

const SkeletonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-row-gap: 1rem;
`;

const NotFoundContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  height: 100%;
  flex-direction: column;
  margin-top: 1rem;
  svg {
    max-width: 550px;
    height: auto;
  }

  span {
    font-weight: 500;
    font-size: 25px;
    margin-top: 1rem;
  }

  @media (max-width: 600px) {
    svg {
      max-width: 300px;
      height: auto;
    }
  }
`;

export default RequestPage;
