import React, { useState } from "react";
import styled, { css } from "styled-components";
import { REQUEST_TYPES, STATUSES, User } from "../types/model";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import Request from "../components/request-page/RequestCard";
import SimpleBar from "simplebar-react";
import MobileDateTimePicker from "@material-ui/lab/MobileDateTimePicker";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { styled as materialStyled } from "@material-ui/styles";
import useGetAllUsers from "../hooks/user/useGetAllUsers";

const RequestPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<STATUSES>(
    null!
  );

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedAuthor, setSelectedAuthor] = useState<string>(null!);

  // call hooks

  const handleSelectStatus = (status: STATUSES) => {
    setSelectedStatus(status);
  };
  const [users, userStatus] = useGetAllUsers();

  return (
    <StyledRequestPage>
      {userStatus === "succeeded" && (
        <Toolbar>
          <StatusContainer>
            <SelectStatusButton
              isSelected={selectedStatus === STATUSES.PENDING}
              onClick={() => handleSelectStatus(STATUSES.PENDING)}
            >
              <AddCircleOutlineIcon fontSize="small" />
              <span>100 pending</span>
            </SelectStatusButton>
            <SelectStatusButton
              isSelected={selectedStatus === STATUSES.APPROVED}
              onClick={() => handleSelectStatus(STATUSES.APPROVED)}
            >
              <CheckIcon fontSize="small" />
              <span>100 approved</span>
            </SelectStatusButton>
            <SelectStatusButton
              isSelected={selectedStatus === STATUSES.DENIED}
              onClick={() => handleSelectStatus(STATUSES.DENIED)}
            >
              <CloseIcon fontSize="small" />
              <span>100 denied</span>
            </SelectStatusButton>
          </StatusContainer>
          <Filter>
            <MobileDateTimePicker
              label="Start date"
              value={startDate}
              onChange={(newValue) => {
                setStartDate(newValue!);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="none"
                  variant="standard"
                />
              )}
            />
            <MobileDateTimePicker
              label="End date"
              value={endDate}
              onChange={(newValue) => {
                setEndDate(newValue!);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="none"
                  variant="standard"
                />
              )}
            />
            <FormControl variant="standard" style={{ minWidth: 120 }}>
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
                    {user.fullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Filter>
        </Toolbar>
      )}

      <SimpleBar
        style={{
          maxHeight: "calc(100% - 70px)",
        }}
      >
        <RequestListContainer>
          <Request
            title="Change to lab 1"
            type={REQUEST_TYPES.MODIFY_LAB_USAGE}
            status={STATUSES.PENDING}
            pendingAt={new Date()}
            authorName="Starea"
            numberOfComments={123}
          />
          <Request
            title="Change to lab 1"
            type={REQUEST_TYPES.MODIFY_LAB_USAGE}
            status={STATUSES.PENDING}
            pendingAt={new Date()}
            authorName="Starea"
            numberOfComments={123}
          />
        </RequestListContainer>
      </SimpleBar>
    </StyledRequestPage>
  );
};

const StyledRequestPage = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Filter = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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

const RequestListContainer = styled.div`
  margin-top: 1rem;
  overflow: hidden;
`;

export default RequestPage;
