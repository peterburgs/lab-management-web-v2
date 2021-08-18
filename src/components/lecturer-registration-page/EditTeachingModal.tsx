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
import { Teaching, RegistrableCourse } from "../../types/model";
// import reducers
import { editTeaching } from "../../reducers/teachingSlice";
import {
  setShowErrorSnackBar,
  setShowSuccessSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
// import hooks
import { useAppDispatch, useAppSelector } from "../../store";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router";
import useGetRegistrableCoursesByRegistration from "../../hooks/registrableCourse/useGetRegistrableCoursesByRegistration";

const EditTeachingModal = (props: ModalProps) => {
  // call hooks
  const { register, handleSubmit, errors, control } = useForm<Teaching>();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const teaching = useAppSelector((state) =>
    state.teachings.teachings.find((item) => item._id === id)
  );
  // get opening registration
  const openRegistration = useAppSelector((state) =>
    state.registrations.registrations.find((reg) => reg.isOpening === true)
  );
  // Fetch registrable courses
  const [registrableCourses, registrableCourseStatus] =
    useGetRegistrableCoursesByRegistration(openRegistration?._id);

  // useState
  const [status, setStatus] = useState("idle");

  // handle submit event
  const onSubmit = async (data: Teaching) => {
    if (teaching) {
      if (registrableCourseStatus === "succeeded") {
        if (
          (registrableCourses as RegistrableCourse[]).find(
            (item) => item.course === data.course
          )
        ) {
          try {
            const clonedTeaching = {
              ..._.cloneDeep(teaching),
              ...data,
            } as Teaching;

            clonedTeaching.uId = clonedTeaching.user as string;


            setStatus("pending");
            const actionResult = await dispatch(editTeaching(clonedTeaching));
            unwrapResult(actionResult);

            setStatus("idle");
            dispatch(setSnackBarContent("Edit teaching successfully"));
            dispatch(setShowSuccessSnackBar(true));
            props.setShowModal(false);
          } catch (err) {
            if (err.response) {
              dispatch(setSnackBarContent(err.response.data.message));
            } else {
              dispatch(setSnackBarContent("Failed to edit teaching"));
            }
            setStatus("idle");
            dispatch(setShowErrorSnackBar(true));
            props.setShowModal(false);
          }
        } else {
          dispatch(
            setSnackBarContent(
              "The course is not allowed to register to this registration"
            )
          );
          dispatch(setShowErrorSnackBar(true));
        }
      }
    }
  };

  return (
    <Modal {...props}>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {teaching && (
          <>
            <StyledTextField
              label="Course ID"
              inputRef={register({ required: true })}
              defaultValue={teaching.course}
              name="course"
              error={Boolean(errors.course)}
              helperText={errors.course && "*This field is required"}
            />
            <StyledTextField
              label="Group"
              inputRef={register({ required: true })}
              defaultValue={teaching.group}
              name="group"
              error={Boolean(errors.group)}
              type="number"
              helperText={errors.group && "*This field is required"}
            />
            <StyledTextField
              label="Number of students"
              inputRef={register({ required: true })}
              defaultValue={teaching.numberOfStudents}
              name="numberOfStudents"
              error={Boolean(errors.numberOfStudents)}
              type="number"
              helperText={errors.numberOfStudents && "*This field is required"}
            />
            <StyledTextField
              label="Theory room"
              inputRef={register({ required: true })}
              defaultValue={teaching.theoryRoom}
              name="theoryRoom"
              error={Boolean(errors.theoryRoom)}
              helperText={errors.theoryRoom && "*This field is required"}
            />
            <StyledTextField
              label="Number of practical weeks"
              inputRef={register({ required: true, min: 1 })}
              defaultValue={teaching.numberOfPracticalWeeks}
              name="numberOfPracticalWeeks"
              error={Boolean(errors.numberOfPracticalWeeks)}
              type="number"
              helperText={
                errors.numberOfPracticalWeeks && "*This field is required"
              }
            />
            <StyledTextField
              label="Start from week"
              inputRef={register({ required: true })}
              defaultValue={teaching.startPracticalWeek}
              name="startPracticalWeek"
              error={Boolean(errors.startPracticalWeek)}
              type="number"
              helperText={
                errors.startPracticalWeek && "*This field is required"
              }
            />
            <Controller
              name="dayOfWeek"
              control={control}
              defaultValue={teaching.dayOfWeek}
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
                  </Select>
                </StyledFormControl>
              )}
            />
            <Controller
              name="startPeriod"
              control={control}
              defaultValue={teaching.startPeriod}
              rules={{ required: true }}
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
              defaultValue={teaching.endPeriod}
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

export default EditTeachingModal;
