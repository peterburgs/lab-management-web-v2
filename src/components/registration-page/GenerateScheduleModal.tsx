import React, { useState } from "react";
import styled from "styled-components";
import { styled as materialStyled } from "@material-ui/styles";
import Modal from "../common/Modal";
import { ModalProps } from "../../types/modal";
import { useForm, Controller } from "react-hook-form";
import {
  FormControl,
  MenuItem,
  InputLabel,
  Select,
} from "@material-ui/core";
import Button from "../common/Button";
import { unwrapResult } from "@reduxjs/toolkit";

// import reducers
import {
  setShowErrorSnackBar,
  setShowSuccessSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
import { generateSchedule } from "../../reducers/scheduleSlice";
// import hooks
import { useAppDispatch, useAppSelector } from "../../store";

const GenerateScheduleModal = (props: ModalProps) => {
  const { handleSubmit, control } =
    useForm<{
      registration: string;
    }>();

  const dispatch = useAppDispatch();
  const registrations = useAppSelector(
    (state) => state.registrations.registrations
  );

  const [status, setStatus] = useState("idle");

  const onSubmit = async (data: { registration: string }) => {
    if (registrations.length > 0) {
      try {
        setStatus("pending");
        const actionResult = await dispatch(generateSchedule(data));

        unwrapResult(actionResult);

        dispatch(
          setSnackBarContent("Generate schedule successfully")
        );
        dispatch(setShowSuccessSnackBar(true));
      } catch (err) {
        console.log("Failed to generate schedule", err);
        if (err.response) {
          dispatch(setSnackBarContent(err.response.data.message));
        } else {
          dispatch(setSnackBarContent("Failed to generate schedule"));
        }
        dispatch(setShowErrorSnackBar(true));
      } finally {
        setStatus("idle");
        props.setShowModal(false);
      }
    }
  };

  return (
    <Modal {...props}>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="registration"
          control={control}
          defaultValue={
            registrations.length > 0 ? registrations[0]._id : null
          }
          rules={{ required: true }}
          render={(props) => (
            <StyledFormControl variant="outlined">
              <InputLabel id="registration-label">
                Registration
              </InputLabel>
              <Select
                labelId="registration-label"
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
                label="Registration"
              >
                {registrations.map((reg) => (
                  <MenuItem
                    key={reg._id}
                    value={reg._id}
                  >{`Registration batch ${reg.batch}`}</MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          )}
        />
        <SubmitButton
          disabled={status === "pending"}
          loading={status === "pending"}
          type="submit"
        >
          Generate
        </SubmitButton>
      </StyledForm>
    </Modal>
  );
};

// Styling
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const SubmitButton = styled(Button)`
  background-color: ${({ disabled, theme }) =>
    disabled ? theme.grey : theme.veryLightBlue};
  box-shadow: none;
  color: ${({ disabled, theme }) =>
    disabled ? theme.darkGrey : theme.blue};
  font-weight: 500;
  font-size: 18px;
  margin-top: 1rem;
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

const StyledFormControl = materialStyled(FormControl)({
  marginBottom: "1rem",
  marginTop: "0.5rem",
});

export default GenerateScheduleModal;
