import React, { useState } from "react";
import styled from "styled-components";
import { styled as materialStyled } from "@material-ui/styles";
import Modal from "../common/Modal";
import { ModalProps } from "../../types/modal";
import {
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@material-ui/core";
import Button from "../common/Button";
import { unwrapResult } from "@reduxjs/toolkit";

// import models
import { Request, REQUEST_TYPES, REQUEST_STATUSES } from "../../types/model";
// import reducers
import { newRequest } from "../../reducers/requestSlice";
import {
  setShowErrorSnackBar,
  setShowSuccessSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
// import hooks
import { useAppDispatch, useAppSelector } from "../../store";
import { useForm, Controller } from "react-hook-form";
import useGetAllTeaching from "../../hooks/teaching/useGetAllTeachings";

interface ModifyLabUsageRequestModalProps extends ModalProps {
  semester: string;
}

const ModifyLabUsageRequestModal = (props: ModifyLabUsageRequestModalProps) => {
  // call hooks
  const { register, handleSubmit, errors, control } = useForm<Request>();
  const dispatch = useAppDispatch();
  const labs = useAppSelector((state) => state.labs.labs);
  const semester = useAppSelector((state) =>
    state.semesters.semesters.find((item) => item._id === props.semester)
  );
  const verifiedUser = useAppSelector((state) => state.auth.verifiedUser);
  const labUsages = useAppSelector((state) => state.schedule.labUsages);
  const [teachings] = useGetAllTeaching();

  // useState
  const [status, setStatus] = useState("idle");

  const checkPeriod = (
    startA: number,
    endA: number,
    startB: number,
    endB: number
  ) => {
    if (startB >= startA && endB <= endA) return true;
    if (startB >= startA && startB <= endA && endB >= endA) return true;
    if (startB <= startA && endB >= startA && endB <= endA) return true;
    return false;
  };

  const isValidLabUsage = (
    weekNo: number,
    dayOfWeek: number,
    startPeriod: number,
    endPeriod: number,
    labId: string
  ) => {
    if (labUsages.length > 0) {
      if (
        labUsages.filter(
          (item) =>
            item.weekNo === weekNo &&
            item.dayOfWeek === dayOfWeek &&
            checkPeriod(
              item.startPeriod,
              item.endPeriod,
              startPeriod,
              endPeriod
            ) &&
            item.lab === labId
        ).length === 0
      ) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  };

  // handle submit event
  const onSubmit = async (data: Request) => {
    if (teachings.length > 0) {
      if (
        teachings.filter((teaching) => teaching._id === data.teaching).length >
        0
      ) {
        if (
          labUsages.length > 0 &&
          labs.find((item) => item._id === data.lab)
        ) {
          if (
            isValidLabUsage(
              data.weekNo,
              data.dayOfWeek,
              data.startPeriod,
              data.endPeriod,
              data.lab as string
            )
          ) {
            try {
              data.isHidden = false;
              data.uId = verifiedUser!._id;
              data.status = REQUEST_STATUSES.PENDING;
              data.type = REQUEST_TYPES.ADD_EXTRA_CLASS;
              setStatus("pending");
              const actionResult = await dispatch(newRequest(data));
              unwrapResult(actionResult);
              setStatus("idle");
              dispatch(setSnackBarContent("Create new request successfully"));
              dispatch(setShowSuccessSnackBar(true));
              props.setShowModal(false);
            } catch (err) {
              if (err.message) {
                dispatch(setSnackBarContent(err.message));
              } else {
                dispatch(setSnackBarContent("Failed to create new request"));
              }
              setStatus("idle");
              dispatch(setShowErrorSnackBar(true));
              props.setShowModal(false);
            }
          } else {
            dispatch(
              setSnackBarContent(
                "The lab you choose is not idle at the present"
              )
            );
            dispatch(setShowErrorSnackBar(true));
          }
        } else {
          dispatch(setSnackBarContent("Lab name is not correct"));
          dispatch(setShowErrorSnackBar(true));
        }
      } else {
        dispatch(setSnackBarContent("Cannot find teaching"));
        dispatch(setShowErrorSnackBar(true));
      }
    }
  };

  return (
    <Modal {...props}>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {labs.length > 0 && semester && (
          <>
            <StyledTextField
              label="Teaching ID"
              inputRef={register({ required: true })}
              name="teaching"
              error={Boolean(errors.teaching)}
              helperText={errors.teaching && "*This field is required"}
            />
            <StyledTextField
              label="Title"
              inputRef={register({ required: true })}
              name="title"
              error={Boolean(errors.title)}
              helperText={errors.title && "*This field is required"}
            />
            <StyledTextField
              label="Description"
              inputRef={register({ required: false })}
              name="description"
              error={Boolean(errors.description)}
              helperText={errors.description && "*This field is required"}
            />
            <Controller
              name="lab"
              control={control}
              rules={{ required: true }}
              defaultValue={labs[0]._id}
              render={(props) => (
                <StyledFormControl variant="outlined">
                  <InputLabel id="lab-label">Lab</InputLabel>
                  <Select
                    labelId="lab-label"
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                    label="Lab"
                  >
                    {labs.map((lab, i) => (
                      <MenuItem value={lab._id} key={lab._id}>
                        {lab.labName}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              )}
            />
            <Controller
              name="weekNo"
              control={control}
              rules={{ required: true }}
              defaultValue={1}
              render={(props) => (
                <StyledFormControl variant="outlined">
                  <InputLabel id="weekno-label">Week</InputLabel>
                  <Select
                    labelId="weekno-label"
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                    label="Week"
                  >
                    {[...Array(semester.numberOfWeeks)].map((_, i) => (
                      <MenuItem value={i} key={"weekNo" + i}>
                        {i}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              )}
            />
            <Controller
              name="dayOfWeek"
              control={control}
              rules={{ required: true }}
              defaultValue={0}
              render={(props) => (
                <StyledFormControl variant="outlined">
                  <InputLabel id="dow-label">Day of week</InputLabel>
                  <Select
                    labelId="dow-label"
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
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
              )}
            />
            <Controller
              name="startPeriod"
              control={control}
              rules={{ required: true }}
              defaultValue={1}
              render={(props) => (
                <StyledFormControl variant="outlined">
                  <InputLabel id="start-label">Start period</InputLabel>
                  <Select
                    labelId="start-label"
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                    label="Start period"
                  >
                    {[...Array(15)].map((_, i) => (
                      <MenuItem value={i + 1} key={"startPeriod" + i}>
                        {i + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              )}
            />
            <Controller
              name="endPeriod"
              control={control}
              rules={{ required: true }}
              defaultValue={3}
              render={(props) => (
                <StyledFormControl variant="outlined">
                  <InputLabel id="end-label">End period</InputLabel>
                  <Select
                    labelId="end-label"
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                    label="End period"
                  >
                    {[...Array(15)].map((_, i) => (
                      <MenuItem value={i + 1} key={"endPeriod" + i}>
                        {i + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              )}
            />
            <StyledButton
              disabled={status === "pending"}
              loading={status === "pending"}
              type="submit"
            >
              Submit
            </StyledButton>
          </>
        )}
      </StyledForm>
    </Modal>
  );
};

// Styling
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const StyledButton = styled(Button)`
  background-color: ${({ theme }) => theme.veryLightBlue};
  box-shadow: none;
  color: ${({ theme }) => theme.blue};
  font-weight: 500;
  font-size: 18px;
  &:active {
    background-color: ${({ theme }) => theme.veryLightBlue};
    &:hover {
      background-color: ${({ theme }) => theme.veryLightBlue};
    }
  }

  &:hover {
    background-color: ${({ theme }) => theme.veryLightBlue};
  }
`;

const StyledTextField = materialStyled(TextField)({
  marginBottom: "1rem",
  marginTop: "0.5rem",
});

const StyledFormControl = materialStyled(FormControl)({
  marginBottom: "1rem",
  marginTop: "0.5rem",
});

export default ModifyLabUsageRequestModal;
