import React, { useState } from "react";
import styled from "styled-components";
import { styled as materialStyled } from "@material-ui/styles";
import Modal from "../common/Modal";
import { ModalProps } from "../../types/modal";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import Button from "../common/Button";
import { DateTimePicker } from "@material-ui/lab";
import _ from "lodash";
import { unwrapResult } from "@reduxjs/toolkit";
import moment from "moment";

// import models
import { Semester } from "../../types/model";
// import reducers
import { editSemester } from "../../reducers/semesterSlice";
import {
  setShowErrorSnackBar,
  setShowSuccessSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
// import hooks
import { useAppDispatch, useAppSelector } from "../../store";
import { useParams } from "react-router";

const EditSemesterModal = (props: ModalProps) => {
  const { register, handleSubmit, errors, control } =
    useForm<Semester>();

  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const semester = useAppSelector((state) =>
    state.semesters.semesters.find((item) => item._id === id)
  );
  const [status, setStatus] = useState("idle");
  const [
    isEditNumberOfWeeksAndStartPracticalWeek,
    setIsEditNumberOfWeeksAndStartPracticalWeek,
  ] = useState(false);

  const onSubmit = async (data: Semester) => {
    if (semester) {
      try {
        const clonedSemester = _.cloneDeep(semester);
        clonedSemester.semesterName = data.semesterName;
        clonedSemester.startDate = data.startDate;
        clonedSemester.numberOfWeeks = data.numberOfWeeks;
        setStatus("pending");
        const actionResult = await dispatch(
          editSemester(clonedSemester)
        );
        unwrapResult(actionResult);

        setStatus("idle");
        dispatch(setSnackBarContent("Edit semester successfully"));
        dispatch(setShowSuccessSnackBar(true));
        props.setShowModal(false);
      } catch (err) {
        if (err.message) {
          dispatch(setSnackBarContent(err.message));
        } else {
          dispatch(setSnackBarContent("Failed to edit semester"));
        }
        setStatus("idle");
        dispatch(setShowErrorSnackBar(true));
        props.setShowModal(false);
      }
    }
  };

  const disableDays = (date: Date) => {
    return date.getDay() !== 1;
  };

  return (
    <Modal {...props} style={{ overlay: { zIndex: 1000 } }}>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <StyledTextField
          label="Semester name"
          inputRef={register({ required: true })}
          name="semesterName"
          defaultValue={semester ? semester.semesterName : null}
          error={Boolean(errors.semesterName)}
          helperText={
            errors.semesterName && "*This field is required"
          }
        />
        <Controller
          name="startDate"
          control={control}
          rules={{ required: true }}
          defaultValue={
            semester
              ? semester.startDate
              : new Date().getDay() === 1
              ? new Date().setHours(7, 0, 0)
              : new Date().getDay() === 0
              ? moment(new Date().setHours(7, 0, 0)).add(1, "days")
              : moment(new Date().setHours(7, 0, 0)).add(
                  8 - new Date().getDay(),
                  "days"
                )
          }
          render={(props) => (
            <DateTimePicker
              label="Start date"
              inputFormat="dd/MM/yyyy hh:mm a"
              renderInput={(props) => (
                <StyledTextField {...props} helperText={null} />
              )}
              onChange={(value) => props.onChange(value)}
              value={props.value}
              shouldDisableDate={disableDays}
              disablePast={true}
            />
          )}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={isEditNumberOfWeeksAndStartPracticalWeek}
              onChange={(e) => {
                setIsEditNumberOfWeeksAndStartPracticalWeek(
                  e.target.checked
                );
              }}
            />
          }
          label="Change the number of Weeks and start practical week"
        />
        <StyledTextField
          label="Number of weeks"
          inputRef={register({ required: true })}
          name="numberOfWeeks"
          disabled={!isEditNumberOfWeeksAndStartPracticalWeek}
          defaultValue={semester ? semester.numberOfWeeks : null}
          error={Boolean(errors.numberOfWeeks)}
          type="number"
          helperText={
            errors.numberOfWeeks && "*This field is required"
          }
        />
        <StyledTextField
          label="Start practical week"
          inputRef={register({ required: true })}
          name="startPracticalWeek"
          disabled={!isEditNumberOfWeeksAndStartPracticalWeek}
          defaultValue={semester ? semester.startPracticalWeek : null}
          error={Boolean(errors.startPracticalWeek)}
          type="number"
          helperText={
            errors.startPracticalWeek && "*This field is required"
          }
        />
        {isEditNumberOfWeeksAndStartPracticalWeek ? (
          <Warning>
            The existing schedule will be removed due to this change!
          </Warning>
        ) : null}
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

const Warning = styled.div`
  color: ${({ theme }) => theme.red};
  font-size: 13px;
  margin-bottom: 1rem;
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

export default EditSemesterModal;
