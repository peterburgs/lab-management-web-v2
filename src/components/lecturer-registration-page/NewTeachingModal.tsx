import React, { useState } from "react";
import styled from "styled-components";
import { styled as materialStyled } from "@material-ui/core/styles";
import Modal from "../common/Modal";
import { ModalProps } from "../../../types/modal";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Skeleton,
} from "@material-ui/core";
import { unwrapResult } from "@reduxjs/toolkit";
import Button from "../common/Button";

// import models
import { Teaching, RegistrableCourse } from "../../react-app-env";
// import reducers
import { newTeaching } from "../../reducers/teachingSlice";
import {
  setShowErrorSnackBar,
  setShowSuccessSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
// import hooks
import { useAppDispatch, useAppSelector } from "../../store";
import useGetRegistrableCoursesByRegistration from "../../hooks/registrableCourse/useGetRegistrableCoursesByRegistration";

const NewTeachingModal = (props: ModalProps) => {
  const {
    register,
    handleSubmit,
    errors,
    control,
  } = useForm<Teaching>();

  const dispatch = useAppDispatch();
  const [status, setStatus] = useState("idle");

  // get opening registration
  const openRegistration = useAppSelector((state) =>
    state.registrations.registrations.find(
      (reg) => reg.isOpening === true
    )
  );
  // get verified user
  const verifiedUser = useAppSelector(
    (state) => state.auth.verifiedUser
  );

  // Fetch registrable courses
  const [
    registrableCourses,
    registrableCourseStatus,
  ] = useGetRegistrableCoursesByRegistration(openRegistration?._id);

  // handle new course submit
  const onSubmit = async (data: Teaching) => {
    if (registrableCourseStatus === "succeeded") {
      if (
        (registrableCourses as RegistrableCourse[]).find(
          (item) => item.course === data.course
        )
      ) {
        try {
          data.isHidden = false;
          data.registration = openRegistration!._id;
          data.user = verifiedUser!._id;
          setStatus("pending");
          const actionResult = await dispatch(newTeaching(data));
          unwrapResult(actionResult);

          dispatch(setSnackBarContent("New teaching created"));
          dispatch(setShowSuccessSnackBar(true));
        } catch (err) {
          console.log("Failed to create new teaching", err);
          if (err.response) {
            dispatch(setSnackBarContent(err.response.data.message));
          } else {
            dispatch(
              setSnackBarContent("Failed to create new teaching")
            );
          }
          dispatch(setShowErrorSnackBar(true));
        } finally {
          setStatus("idle");
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
  };

  // conditional renderer
  const renderForm = () => {
    if (registrableCourseStatus === "pending") {
      return (
        <SkeletonContainer>
          <Skeleton
            variant="rectangular"
            height={40}
            animation="wave"
          />
          <Skeleton
            variant="rectangular"
            height={40}
            animation="wave"
          />
          <Skeleton
            variant="rectangular"
            height={40}
            animation="wave"
          />
          <Skeleton
            variant="rectangular"
            height={40}
            animation="wave"
          />
        </SkeletonContainer>
      );
    }
    if (registrableCourseStatus === "succeeded") {
      return (
        <>
          <StyledTextField
            label="Course ID"
            inputRef={register({ required: true })}
            name="course"
            error={Boolean(errors.course)}
            helperText={errors.course && "*This field is required"}
          />
          <StyledTextField
            label="Group"
            inputRef={register({ required: true })}
            name="group"
            error={Boolean(errors.group)}
            type="number"
            helperText={errors.group && "*This field is required"}
          />
          <StyledTextField
            label="Number of students"
            inputRef={register({ required: true })}
            name="numberOfStudents"
            error={Boolean(errors.numberOfStudents)}
            type="number"
            helperText={
              errors.numberOfStudents && "*This field is required"
            }
          />
          <StyledTextField
            label="Theory room"
            inputRef={register({ required: true })}
            name="theoryRoom"
            error={Boolean(errors.theoryRoom)}
            helperText={
              errors.theoryRoom && "*This field is required"
            }
          />
          <StyledTextField
            label="Number of practical weeks"
            inputRef={register({ required: true })}
            name="numberOfPracticalWeeks"
            error={Boolean(errors.numberOfPracticalWeeks)}
            type="number"
            helperText={
              errors.numberOfPracticalWeeks &&
              "*This field is required"
            }
          />
          <Controller
            name="dayOfWeek"
            control={control}
            defaultValue={0}
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
            defaultValue={1}
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
            defaultValue={1}
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
          </StyledButton>
        </>
      );
    }
  };

  return (
    <Modal {...props}>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {renderForm()}
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

const SkeletonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-row-gap: 1rem;
`;

const StyledTextField = materialStyled(TextField)({
  marginBottom: "1rem",
  marginTop: "0.5rem",
});

const StyledFormControl = materialStyled(FormControl)({
  marginBottom: "1rem",
  marginTop: "0.5rem",
});

export default NewTeachingModal;
