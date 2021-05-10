import React, { useState } from "react";
import styled from "styled-components";
import { styled as materialStyled } from "@material-ui/styles";
import Modal from "../common/Modal";
import { ModalProps } from "../../types/modal";
import { useForm, Controller } from "react-hook-form";
import { TextField } from "@material-ui/core";
import Button from "../common/Button";
import { DateTimePicker } from "@material-ui/lab";
import { unwrapResult } from "@reduxjs/toolkit";

// import models
import { Semester } from "../../types/react-app-env";
// import reducers
import { startSemester } from "../../reducers/semesterSlice";
import {
  setShowSuccessSnackBar,
  setShowErrorSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
// import hooks
import { useAppDispatch } from "../../store";

const StartSemesterModal = (props: ModalProps) => {
  const [status, setStatus] = useState("idle");
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    errors,
    control,
  } = useForm<Semester>();

  const onSubmit = async (data: Semester) => {
    try {
      data.isOpening = true;
      data.isHidden = false;
      setStatus("pending");
      const actionResult = await dispatch(startSemester(data));
      unwrapResult(actionResult);
      dispatch(setSnackBarContent("Start semester successfully"));
      dispatch(setShowSuccessSnackBar(true));
      props.setShowModal(false);
    } catch (err) {
      console.log("Failed to start semester", err);
      if (err.response) {
        dispatch(setSnackBarContent(err.response.data.message));
      } else {
        dispatch(setSnackBarContent("Failed to start semester"));
      }
      dispatch(setShowErrorSnackBar(true));
    } finally {
      setStatus("idle");
      props.setShowModal(false);
    }
  };

  return (
    <Modal {...props}>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <StyledTextField
          label="Semester name"
          inputRef={register({ required: true })}
          name="semesterName"
          error={Boolean(errors.semesterName)}
          helperText={
            errors.semesterName && "*This field is required"
          }
        />
        <Controller
          name="startDate"
          control={control}
          rules={{ required: true }}
          defaultValue={new Date()}
          render={(props) => (
            <DateTimePicker
              label="Start date"
              inputFormat="dd/MM/yyyy hh:mm a"
              renderInput={(props) => <StyledTextField {...props} />}
              onChange={(value) => props.onChange(value)}
              value={props.value}
            />
          )}
        />
        <StyledTextField
          label="Number of weeks"
          inputRef={register({ required: true })}
          name="numberOfWeeks"
          error={Boolean(errors.numberOfWeeks)}
          type="number"
          helperText={
            errors.numberOfWeeks && "*This field is required"
          }
        />
        <StyledButton
          disabled={status === "pending"}
          loading={status === "pending"}
          type="submit"
        >
          Submit
        </StyledButton>
      </StyledForm>
    </Modal>
  );
};

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const StyledButton = styled(Button)`
  background-color: #e7f3ff;
  box-shadow: none;
  color: #1877f2;
  font-weight: 500;
  font-size: 18px;
  &:hover {
    background-color: #dbe7f2;
  }
  &:active {
    background-color: #e7f3ff;
    &:hover {
      background-color: #e7f3ff;
    }
  }
`;

const StyledTextField = materialStyled(TextField)({
  marginBottom: "1rem",
});

export default StartSemesterModal;
