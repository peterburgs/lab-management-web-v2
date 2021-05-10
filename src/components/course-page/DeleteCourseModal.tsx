import React, { useState } from "react";
import styled from "styled-components";
import Modal from "../common/Modal";
import { ModalProps } from "../../types/modal";
import { useForm } from "react-hook-form";
import Button from "../common/Button";
import { unwrapResult } from "@reduxjs/toolkit";

// import reducers
import {
  setShowSuccessSnackBar,
  setShowErrorSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
import { deleteCourse } from "../../reducers/courseSlice";
// import hooks
import { useAppDispatch } from "../../store";

// component props
interface DeleteCourseModalProps extends ModalProps {
  courseId: string | null;
}

const DeleteCourseModal = (props: DeleteCourseModalProps) => {
  const [status, setStatus] = useState("idle");
  const dispatch = useAppDispatch();
  const { handleSubmit } = useForm();

  // handle delete submit
  const onSubmit = async () => {
    if (props.courseId) {
      try {
        setStatus("pending");
        const actionResult = await dispatch(
          deleteCourse(props.courseId)
        );
        unwrapResult(actionResult);

        dispatch(setSnackBarContent("Delete course successfully"));
        dispatch(setShowSuccessSnackBar(true));
        props.setShowModal(false);
      } catch (err) {
        console.log("Failed to delete course", err);
        if (err.response) {
          dispatch(setSnackBarContent(err.response.data.message));
        } else {
          dispatch(setSnackBarContent("Failed to delete course"));
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

export default DeleteCourseModal;
