import React, { useState } from "react";
import styled from "styled-components";
import Modal from "../common/Modal";
import { ModalProps } from "../../types/modal";
import { useForm } from "react-hook-form";
import Button from "../common/Button";
import { unwrapResult } from "@reduxjs/toolkit";
import _ from "lodash";
import { ReactComponent as WarningImage } from "../../assets/images/warning.svg";


// import reducers
import {
  setShowSuccessSnackBar,
  setShowErrorSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
import { deleteFaceID } from "../../reducers/userSlice";
// import hooks
import { useAppDispatch, useAppSelector } from "../../store";

// component props
interface DeleteFaceIDModalProps extends ModalProps {
  userId: string | null;
}

const DeleteFaceIDModal = (props: DeleteFaceIDModalProps) => {
  const [status, setStatus] = useState("idle");
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) =>
    state.users.users.find((user) => user._id === props.userId)
  );
  const { handleSubmit } = useForm();

  // handle delete submit
  const onSubmit = async () => {
    if (user) {
      if (user.isFaceIdVerified) {
        try {
          setStatus("pending");
          const clonedUser = _.cloneDeep(user);
          clonedUser.isFaceIdVerified = false;
          const actionResult = await dispatch(
            deleteFaceID(clonedUser)
          );
          unwrapResult(actionResult);

          dispatch(setSnackBarContent("Delete faceID successfully"));
          dispatch(setShowSuccessSnackBar(true));
          props.setShowModal(false);
        } catch (err) {
          if (err.message) {
            dispatch(setSnackBarContent(err.message));
          } else {
            dispatch(setSnackBarContent("Failed to delete faceID"));
          }
          dispatch(setShowErrorSnackBar(true));
          props.setShowModal(false);
        } finally {
          setStatus("idle");
        }
      } else {
        dispatch(setSnackBarContent("Face ID has not verified yet"));
        dispatch(setShowErrorSnackBar(true));
        props.setShowModal(false);
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

export default DeleteFaceIDModal;
