import React, { useState } from "react";
import styled from "styled-components";
import { styled as materialStyled } from "@material-ui/styles";
import Modal from "../common/Modal";
import { ModalProps } from "../../types/modal";
import { useForm, Controller } from "react-hook-form";
import { TextField } from "@material-ui/core";
import Button from "../common/Button";
import { DateTimePicker } from "@material-ui/lab";
import _ from "lodash";
import { unwrapResult } from "@reduxjs/toolkit";

// import models
import { AcademicYear } from "../../types/model";
// import reducers
import { editAcademicYear } from "../../reducers/academicYearSlice";
import {
  setShowErrorSnackBar,
  setShowSuccessSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
// import hooks
import { useAppDispatch, useAppSelector } from "../../store";
import { useParams } from "react-router";

const EditAcademicYearModal = (props: ModalProps) => {
  const { register, handleSubmit, errors, control } =
    useForm<AcademicYear>();

  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  const academicYear = useAppSelector(
    (state) =>
      state.academicYears.academicYears.filter(
        (academicYear) => academicYear._id === id
      )[0]
  );
  const [status, setStatus] = useState("idle");

  const onSubmit = async (data: AcademicYear) => {
    if (academicYear) {
      try {
        const clonedAcademicYear = _.cloneDeep(academicYear);
        clonedAcademicYear.name = data.name;
        clonedAcademicYear.startDate = data.startDate;
        clonedAcademicYear.numberOfWeeks = data.numberOfWeeks;
        setStatus("pending");
        const actionResult = await dispatch(
          editAcademicYear(clonedAcademicYear)
        );
        unwrapResult(actionResult);

        setStatus("idle");
        dispatch(
          setSnackBarContent("Edit academic year successfully")
        );
        dispatch(setShowSuccessSnackBar(true));
        props.setShowModal(false);
      } catch (err) {
        if (err.response) {
          dispatch(setSnackBarContent(err.response.data.message));
        } else {
          dispatch(
            setSnackBarContent("Failed to edit academic year")
          );
        }
        setStatus("idle");
        dispatch(setShowErrorSnackBar(true));
        props.setShowModal(false);
      }
    }
  };

  return (
    <Modal {...props} style={{ overlay: { zIndex: 1000 } }}>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <StyledTextField
          label="Name"
          inputRef={register({ required: true })}
          name="name"
          defaultValue={academicYear ? academicYear.name : null}
          error={Boolean(errors.name)}
          helperText={errors.name && "*This field is required"}
        />
        <Controller
          name="startDate"
          control={control}
          rules={{ required: true }}
          defaultValue={academicYear ? academicYear.startDate : null}
          render={(props) => (
            <DateTimePicker
              label="Start date"
              inputFormat="dd/MM/yyyy hh:mm a"
              renderInput={(props) => <StyledTextField {...props} helperText={null} />}
              onChange={(value) => props.onChange(value)}
              value={props.value}
            />
          )}
        />
        <StyledTextField
          label="Number of weeks"
          inputRef={register({ required: true })}
          name="numberOfWeeks"
          defaultValue={
            academicYear ? academicYear.numberOfWeeks : null
          }
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

export default EditAcademicYearModal;
