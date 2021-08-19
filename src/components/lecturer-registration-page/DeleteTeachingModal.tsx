import React, { useState } from "react";
import styled from "styled-components";
import Modal from "../common/Modal";
import { ModalProps } from "../../types/modal";
import { useForm } from "react-hook-form";
import Button from "../common/Button";
import { unwrapResult } from "@reduxjs/toolkit";
import { ReactComponent as WarningImage } from "../../assets/images/warning.svg";


// import reducers
import {
  setShowSuccessSnackBar,
  setShowErrorSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
import { deleteTeaching } from "../../reducers/teachingSlice";
// import hooks
import { useAppDispatch } from "../../store";

// component props
interface DeleteTeachingModalProps extends ModalProps {
  teachingId: string | null;
}

const DeleteTeachingModal = (props: DeleteTeachingModalProps) => {
  const [status, setStatus] = useState("idle");
  const dispatch = useAppDispatch();
  const { handleSubmit } = useForm();

  // handle delete teaching submit
  const onSubmit = async () => {
    if (props.teachingId) {
      try {
        setStatus("pending");
        const actionResult = await dispatch(
          deleteTeaching(props.teachingId)
        );
        unwrapResult(actionResult);

        dispatch(setSnackBarContent("Delete teaching successfully"));
        dispatch(setShowSuccessSnackBar(true));
        props.setShowModal(false);
      } catch (err) {
        if (err.message) {
          dispatch(setSnackBarContent(err.message));
        } else {
          dispatch(setSnackBarContent("Failed to delete teaching"));
        }
        dispatch(setShowErrorSnackBar(true));
        props.setShowModal(false);
      } finally {
        setStatus("idle");
      }
    }
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

export default DeleteTeachingModal;
