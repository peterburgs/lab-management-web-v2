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
import { Course, COURSE_TYPES } from "../../types/model";
// import reducers
import { editCourse } from "../../reducers/courseSlice";
import {
  setShowErrorSnackBar,
  setShowSuccessSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
// import hooks
import { useAppDispatch, useAppSelector } from "../../store";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router";

const EditCourseModal = (props: ModalProps) => {
  // call hooks
  const { register, handleSubmit, errors, control } =
    useForm<Course>();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const course = useAppSelector((state) =>
    state.courses.courses.find((item) => item._id === id)
  );

  // useState
  const [status, setStatus] = useState("idle");

  // handle submit event
  const onSubmit = async (data: Course) => {
    if (course) {
      try {
        const clonedCourse = {
          ..._.cloneDeep(course),
          ...data,
        };

        setStatus("pending");
        const actionResult = await dispatch(editCourse(clonedCourse));
        unwrapResult(actionResult);

        setStatus("idle");
        dispatch(setSnackBarContent("Edit course successfully"));
        dispatch(setShowSuccessSnackBar(true));
        props.setShowModal(false);
      } catch (err) {
        if (err.response) {
          dispatch(setSnackBarContent(err.response.data.message));
        } else {
          dispatch(setSnackBarContent("Failed to edit course"));
        }
        setStatus("idle");
        dispatch(setShowErrorSnackBar(true));
        props.setShowModal(false);
      }
    }
  };

  return (
    <Modal {...props}>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {course && (
          <>
            <StyledTextField
              label="Course ID"
              inputRef={register({ required: true })}
              defaultValue={course._id}
              InputProps={{ readOnly: true }}
              name="_id"
              error={Boolean(errors._id)}
              helperText={errors._id && "*This field is required"}
            />
            <StyledTextField
              label="Course name"
              inputRef={register({ required: true })}
              defaultValue={course.courseName}
              name="courseName"
              error={Boolean(errors.courseName)}
              helperText={
                errors.courseName && "*This field is required"
              }
            />
            <StyledTextField
              label="Number of credits"
              inputRef={register({ required: true })}
              defaultValue={course.numberOfCredits}
              name="numberOfCredits"
              error={Boolean(errors.numberOfCredits)}
              type="number"
              helperText={
                errors.numberOfCredits && "*This field is required"
              }
            />
            <Controller
              name="type"
              control={control}
              defaultValue={course.type}
              rules={{ required: true }}
              render={(props) => (
                <StyledFormControl variant="outlined">
                  <InputLabel id="type-label">Type</InputLabel>
                  <Select
                    labelId="type-label"
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                    label="Type"
                  >
                    <MenuItem value={COURSE_TYPES.PRACTICAL}>
                      Practical
                    </MenuItem>
                    <MenuItem value={COURSE_TYPES.THEORY}>
                      Theory
                    </MenuItem>
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

export default EditCourseModal;
