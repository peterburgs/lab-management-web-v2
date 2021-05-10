import React, { useState } from "react";
import styled from "styled-components";
import { styled as materialStyled } from "@material-ui/styles";
import Modal from "../common/Modal";
import { ModalProps } from "../../types/modal";
import { useForm } from "react-hook-form";
import { TextField } from "@material-ui/core";
import { unwrapResult } from "@reduxjs/toolkit";
import Button from "../common/Button";

// import models
import { Lab } from "../../types/react-app-env";
// import reducers
import { newLab } from "../../reducers/labSlice";
import {
  setShowErrorSnackBar,
  setShowSuccessSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
// import hooks
import { useAppDispatch } from "../../store";

const NewLabModal = (props: ModalProps) => {
  const { register, handleSubmit, errors } = useForm<Lab>();

  const dispatch = useAppDispatch();
  const [status, setStatus] = useState("idle");

  // handle new course submit
  const onSubmit = async (data: Lab) => {
    try {
      data.isHidden = false;

      setStatus("pending");
      const actionResult = await dispatch(newLab(data));
      unwrapResult(actionResult);

      dispatch(setSnackBarContent("New lab created"));
      dispatch(setShowSuccessSnackBar(true));
    } catch (err) {
      console.log("Failed to create new lab", err);
      if (err.response) {
        dispatch(setSnackBarContent(err.response.data.message));
      } else {
        dispatch(setSnackBarContent("Failed to create new lab"));
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
          label="Lab name"
          inputRef={register({ required: true })}
          name="labName"
          error={Boolean(errors.labName)}
          helperText={errors.labName && "*This field is required"}
        />
        <StyledTextField
          label="Capacity"
          inputRef={register({ required: true })}
          name="capacity"
          error={Boolean(errors.capacity)}
          helperText={errors.capacity && "*This field is required"}
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

export default NewLabModal;
