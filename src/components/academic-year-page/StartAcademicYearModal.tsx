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
import { ReactComponent as WarningImage } from "../../assets/images/warning.svg";

// import models
import { AcademicYear, Semester, SEMESTER_STATUSES } from "../../types/model";
// import reducers
import { startAcademicYear } from "../../reducers/academicYearSlice";
import {
  setShowSuccessSnackBar,
  setShowErrorSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
// import hooks
import { useAppDispatch } from "../../store";
import moment from "moment";
import { startSemester } from "../../reducers/semesterSlice";

const StartAcademicYearModal = (props: ModalProps) => {
  const [status, setStatus] = useState("idle");
  const dispatch = useAppDispatch();
  const { register, handleSubmit, errors, control } = useForm<AcademicYear>();

  const onSubmit = async (data: AcademicYear) => {
    try {
      data.isOpening = true;
      data.isHidden = false;
      setStatus("pending");
      const actionResult = await dispatch(startAcademicYear(data));

      const res = unwrapResult(actionResult);

      for (let i = 0; i < 3; i++) {
        let semester: Semester = {
          semesterName: `Semester ${i + 1}`,
          index: i + 1,
          startDate: i === 0 ? data.startDate : undefined,
          numberOfWeeks: i === 2 ? 8 : 17,
          status:
            i === 0 ? SEMESTER_STATUSES.OPENING : SEMESTER_STATUSES.FUTURE,
          academicYear: res.academicYear!._id,

          startPracticalWeek: 2,
          isHidden: false,
        };
        const savedSemesterResult = await dispatch(startSemester(semester));
        unwrapResult(savedSemesterResult);
      }
      dispatch(setSnackBarContent("Start academic year successfully"));
      dispatch(setShowSuccessSnackBar(true));
      props.setShowModal(false);
    } catch (err) {
      if (err.message) {
        dispatch(setSnackBarContent(err.message));
      } else {
        dispatch(setSnackBarContent("Failed to start academic year"));
      }
      dispatch(setShowErrorSnackBar(true));
    } finally {
      setStatus("idle");
      props.setShowModal(false);
    }
  };

  const disableDays = (date: Date) => {
    return date.getDay() !== 1;
  };

  return (
    <Modal {...props}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <WarningImage style={{ height: "100px" }} />
      </div>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <StyledTextField
          label="Academic year"
          inputRef={register({ required: true })}
          name="name"
          defaultValue={`${moment(new Date()).year()} - ${
            Number(moment(new Date()).year()) + 1
          }`}
          error={Boolean(errors.name)}
          helperText={errors.name ? "*This field is required" : "Format: [start year] - [end year]"}
        />
        <Controller
          name="startDate"
          control={control}
          rules={{ required: true }}
          defaultValue={
            new Date().getDay() === 1
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
              // TODO: Enable when production
              // disablePast={true}
            />
          )}
        />
        <StyledTextField
          label="Number of weeks (estimate)"
          inputRef={register({ required: true })}
          name="numberOfWeeks"
          defaultValue={42}
          error={Boolean(errors.numberOfWeeks)}
          type="number"
          helperText={errors.numberOfWeeks && "*This field is required"}
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

export default StartAcademicYearModal;
