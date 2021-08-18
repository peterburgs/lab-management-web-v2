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
import useGetAllTeaching from "../../hooks/teaching/useGetAllTeachings";
import { ReactComponent as WarningImage } from "../../assets/images/warning.svg";


// component props
interface DeleteCourseModalProps extends ModalProps {
  courseId: string | null;
}

const DeleteCourseModal = (props: DeleteCourseModalProps) => {
  const [status, setStatus] = useState("idle");
  const dispatch = useAppDispatch();
  const { handleSubmit } = useForm();

  const [teachings] = useGetAllTeaching();

  // handle delete submit
  const onSubmit = async () => {
    if (props.courseId) {
      if (
        teachings.filter(
          (teaching) => teaching.course === props.courseId
        ).length > 0
      ) {
        dispatch(setShowErrorSnackBar(true));
        dispatch(
          setSnackBarContent(
            "This course is being used in this semester. Cannot delete."
          )
        );
      } else {
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

export default DeleteCourseModal;
