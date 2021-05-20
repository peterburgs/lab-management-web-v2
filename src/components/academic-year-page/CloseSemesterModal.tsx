import React, { useState } from "react";
import styled from "styled-components";
import Modal from "../common/Modal";
import { ModalProps } from "../../types/modal";
import { useForm } from "react-hook-form";
import Button from "../common/Button";
import { unwrapResult } from "@reduxjs/toolkit";
import _ from "lodash";

// import model
import { Semester, SEMESTER_STATUSES } from "../../types/model";
// import reducers
import {
  setShowSuccessSnackBar,
  setShowErrorSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
import { editSemester } from "../../reducers/semesterSlice";
import { resetState as resetRegistrationState } from "../../reducers/registrationSlice";
import { resetState as resetTeachingState } from "../../reducers/teachingSlice";
// import hooks
import { useAppDispatch, useAppSelector } from "../../store";
import { useParams } from "react-router";

const CloseSemesterModal = (props: ModalProps) => {
  const [status, setStatus] = useState("idle");
  const { id } = useParams<{ id: string }>();
  const semester = useAppSelector((state) =>
    state.semesters.semesters.find((item) => item._id === id)
  );
  const openRegistration = useAppSelector((state) =>
    state.registrations.registrations.find(
      (item) => item.isOpening === true
    )
  );
  const dispatch = useAppDispatch();
  const { handleSubmit } = useForm<Semester>();

  // handle close semester submit
  const onSubmit = async () => {
    if (semester) {
      if (!openRegistration) {
        try {
          const clonedSemester = _.cloneDeep(semester);
          clonedSemester.status = SEMESTER_STATUSES.CLOSED;
          setStatus("pending");
          const actionResult = await dispatch(
            editSemester(clonedSemester)
          );
          unwrapResult(actionResult);

          dispatch(resetRegistrationState());
          dispatch(resetTeachingState());
          dispatch(setSnackBarContent("Close semester successfully"));
          dispatch(setShowSuccessSnackBar(true));
          props.setShowModal(false);
        } catch (error) {
          console.log("Failed to close semester", error);
          if (error.response) {
            dispatch(setSnackBarContent(error.response.data.message));
          } else {
            dispatch(setSnackBarContent("Failed to close semester"));
          }
          dispatch(setShowErrorSnackBar(true));
          props.setShowModal(false);
        }
      } else {
        dispatch(setShowErrorSnackBar(true));
        dispatch(
          setSnackBarContent(
            "Close all registrations before closing semester"
          )
        );
      }
    }
  };

  return (
    <Modal {...props} style={{ overlay: { zIndex: 1000 } }}>
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

export default CloseSemesterModal;
