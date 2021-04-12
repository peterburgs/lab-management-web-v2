import React, { useState } from "react";
import styled from "styled-components";
import { styled as materialStyled } from "@material-ui/core/styles";
import Modal from "../common/Modal";
import { ModalProps } from "../../../types/modal";
import { useForm } from "react-hook-form";
import { TextField } from "@material-ui/core";
import { unwrapResult } from "@reduxjs/toolkit";
import Button from "../common/Button";

// import models
import { Course } from "../../react-app-env";
// import reducers
import { newCourse } from "../../reducers/courseSlice";
import {
  setShowErrorSnackBar,
  setShowSuccessSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
// import hooks
import { useAppDispatch } from "../../store";

const NewCourseModal = (props: ModalProps) => {
  const { register, handleSubmit, errors } = useForm<Course>();

  const dispatch = useAppDispatch();
  const [status, setStatus] = useState("idle");

  // handle new course submit
  const onSubmit = async (data: Course) => {
    try {
      data.isHidden = false;

      setStatus("pending");
      const actionResult = await dispatch(newCourse(data));
      unwrapResult(actionResult);

      dispatch(setSnackBarContent("New course created"));
      dispatch(setShowSuccessSnackBar(true));
    } catch (err) {
      console.log("Failed to create new course", err);
      if (err.response) {
        dispatch(setSnackBarContent(err.response.data.message));
      } else {
        dispatch(setSnackBarContent("Failed to create new course"));
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
          label="Course ID"
          inputRef={register({ required: true })}
          name="_id"
          error={Boolean(errors._id)}
          helperText={errors._id && "*This field is required"}
        />
        <StyledTextField
          label="Course name"
          inputRef={register({ required: true })}
          name="courseName"
          error={Boolean(errors.courseName)}
          helperText={errors.courseName && "*This field is required"}
        />

        <StyledTextField
          label="Number of credits"
          inputRef={register({ required: true })}
          name="numberOfCredits"
          error={Boolean(errors.numberOfCredits)}
          type="number"
          helperText={
            errors.numberOfCredits && "*This field is required"
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

export default NewCourseModal;