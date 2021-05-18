import React, { useState } from "react";
import styled from "styled-components";
import Modal from "../common/Modal";
import { ModalProps } from "../../types/modal";
import { useForm } from "react-hook-form";
import Button from "../common/Button";
import { unwrapResult } from "@reduxjs/toolkit";
import _ from "lodash";

// import model
import { Registration } from "../../types/model";
// import reducers
import {
  setShowSuccessSnackBar,
  setShowErrorSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
import { editRegistration } from "../../reducers/registrationSlice";
// import hooks
import { useAppDispatch, useAppSelector } from "../../store";

// component props

const CloseRegistrationModal = (props: ModalProps) => {
  const [status, setStatus] = useState("idle");
  const registration = useAppSelector((state) =>
    state.registrations.registrations.find(
      (reg) => reg.isOpening === true
    )
  );
  const dispatch = useAppDispatch();
  const { handleSubmit } = useForm<Registration>();

  // handle close registration submit
  const onSubmit = async () => {
    if (registration) {
      try {
        const clonedRegistration = _.cloneDeep(registration);
        clonedRegistration.isOpening = false;
        setStatus("pending");
        const actionResult = await dispatch(
          editRegistration(clonedRegistration)
        );
        unwrapResult(actionResult);
        setStatus("idle");
        dispatch(
          setSnackBarContent("Close registration successfully")
        );
        dispatch(setShowSuccessSnackBar(true));
        props.setShowModal(false);
      } catch (err) {
        setStatus("idle");
        console.log("Failed to close registration", err);
        if (err.response) {
          dispatch(setSnackBarContent(err.response.data.message));
        } else {
          dispatch(setSnackBarContent("Failed to close registration"));
        }
        dispatch(setShowErrorSnackBar(true));
        props.setShowModal(false);
      }
    }
  };

  return (
    <Modal {...props}>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <StyledButton
          disabled={status === "pending"}
          loading={status === "pending"}
          type="submit"
        >
          Confirm
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
  background-color: ${({ theme }) => theme.lightRed};
  box-shadow: none;
  color: ${({ theme }) => theme.red};
  font-weight: 500;
  font-size: 18px;
  &:hover {
    background-color: ${({ theme }) => theme.red};
    color: white;
  }
  &:active {
    background-color: ${({ theme }) => theme.red};
    &:hover {
      background-color: ${({ theme }) => theme.red};
    }
  }
`;

export default CloseRegistrationModal;
