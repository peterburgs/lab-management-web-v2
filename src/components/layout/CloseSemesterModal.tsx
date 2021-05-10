import React, { useState } from "react";
import styled from "styled-components";
import Modal from "../common/Modal";
import { ModalProps } from "../../types/modal";
import { useForm } from "react-hook-form";
import Button from "../common/Button";
import { unwrapResult } from "@reduxjs/toolkit";
import _ from "lodash";

// import model
import { Semester } from "../../types/model";
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

// component props
interface CloseSemesterModalProps extends ModalProps {
  setShowSemesterModal: (a: boolean) => void;
}

const CloseSemesterModal = (props: CloseSemesterModalProps) => {
  const [status, setStatus] = useState("idle");
  const semester = useAppSelector(
    (state) => state.semesters.semesters[0]
  );
  const dispatch = useAppDispatch();
  const { handleSubmit } = useForm<Semester>();

  // handle close semester submit
  const onSubmit = async () => {
    if (semester) {
      try {
        const clonedSemester = _.cloneDeep(semester);
        clonedSemester.isOpening = false;
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
        props.setShowSemesterModal(false);
      } catch (err) {
        console.log("Failed to close semester", err);
        if (err.response) {
          dispatch(setSnackBarContent(err.response.data.message));
        } else {
          dispatch(setSnackBarContent("Failed to close semester"));
        }
        dispatch(setShowErrorSnackBar(true));
        props.setShowModal(false);
        props.setShowSemesterModal(false);
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
