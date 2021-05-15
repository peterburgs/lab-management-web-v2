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
import _ from "lodash";
import { unwrapResult } from "@reduxjs/toolkit";

// import models
import { LabUsage, Lab } from "../../types/model";
// import reducers
import { editLabUsage } from "../../reducers/scheduleSlice";
import {
  setShowErrorSnackBar,
  setShowSuccessSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
// import hooks
import { useAppDispatch, useAppSelector } from "../../store";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router";
import useGetAllLabs from "../../hooks/lab/useGetAllLabs";

const EditLabUsageModal = (props: ModalProps) => {
  // call hooks
  const { register, handleSubmit, errors, control } =
    useForm<LabUsage>();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const labUsage = useAppSelector((state) =>
    state.schedule.labUsages.find((item) => item._id === id)
  );

  const labs = useAppSelector((state) => state.labs.labs);
  const semester = useAppSelector(
    (state) => state.semesters.semesters[0]
  );

  // useState
  const [status, setStatus] = useState("idle");

  // handle submit event
  const onSubmit = async (data: LabUsage) => {
    if (labUsage) {
      if (labs.find((item) => item._id === data.lab)) {
        try {
          const clonedLabUsage = {
            ..._.cloneDeep(labUsage),
            ...data,
          } as LabUsage;

          setStatus("pending");
          const actionResult = await dispatch(
            editLabUsage(clonedLabUsage)
          );
          unwrapResult(actionResult);

          setStatus("idle");
          dispatch(setSnackBarContent("Edit lab usage successfully"));
          dispatch(setShowSuccessSnackBar(true));
          props.setShowModal(false);
        } catch (err) {
          console.log("Failed to edit lab usage", err);
          if (err.response) {
            dispatch(setSnackBarContent(err.response.data.message));
          } else {
            dispatch(setSnackBarContent("Failed to edit lab usage"));
          }
          setStatus("idle");
          dispatch(setShowErrorSnackBar(true));
          props.setShowModal(false);
        }
      } else {
        dispatch(setSnackBarContent("Lab name is not correct"));
        dispatch(setShowErrorSnackBar(true));
      }
    }
  };

  return (
    <Modal {...props}>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {labUsage && labs.length > 0 && semester && (
          <>
            <Controller
              name="lab"
              control={control}
              defaultValue={labUsage.lab}
              rules={{ required: true }}
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
              defaultValue={labUsage.weekNo}
              rules={{ required: true }}
              render={(props) => (
                <StyledFormControl variant="outlined">
                  <InputLabel id="weekno-label">Week</InputLabel>
                  <Select
                    labelId="weekno-label"
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                    label="Week"
                  >
                    {[...Array(semester.numberOfWeeks)].map(
                      (_, i) => (
                        <MenuItem value={i} key={"weekNo" + i}>
                          {i}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </StyledFormControl>
              )}
            />
            <Controller
              name="dayOfWeek"
              control={control}
              defaultValue={labUsage.dayOfWeek}
              rules={{ required: true }}
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
              defaultValue={labUsage.startPeriod}
              rules={{ required: true }}
              render={(props) => (
                <StyledFormControl variant="outlined">
                  <InputLabel id="start-label">
                    Start period
                  </InputLabel>
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
              defaultValue={labUsage.endPeriod}
              rules={{ required: true }}
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
            </StyledButton>{" "}
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

export default EditLabUsageModal;
