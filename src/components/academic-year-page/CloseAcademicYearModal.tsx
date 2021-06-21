import React, { useState } from "react";
import styled from "styled-components";
import Modal from "../common/Modal";
import { ModalProps } from "../../types/modal";
import { useForm } from "react-hook-form";
import Button from "../common/Button";
import { unwrapResult } from "@reduxjs/toolkit";
import _ from "lodash";
import { ReactComponent as WarningImage } from "../../assets/images/warning.svg";

// import model
import { AcademicYear, SEMESTER_STATUSES } from "../../types/model";
// import reducers
import {
  setShowSuccessSnackBar,
  setShowErrorSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
import { editAcademicYear } from "../../reducers/academicYearSlice";
import { resetState as resetRegistrationState } from "../../reducers/registrationSlice";
import { resetState as resetTeachingState } from "../../reducers/teachingSlice";
// import hooks
import { useAppDispatch, useAppSelector } from "../../store";
import { useParams } from "react-router";

const CloseAcademicYearModal = (props: ModalProps) => {
  const [status, setStatus] = useState("idle");
  const { id } = useParams<{ id: string }>();
  const academicYear = useAppSelector((state) =>
    state.academicYears.academicYears.find((item) => item._id === id)
  );
  const semesters = useAppSelector((state) => state.semesters.semesters);
  const dispatch = useAppDispatch();
  const { handleSubmit } = useForm<AcademicYear>();

  // handle close semester submit
  const onSubmit = async () => {
    if (academicYear) {
      if (
        semesters.filter(
          (item) =>
            item.academicYear === academicYear._id &&
            item.status === SEMESTER_STATUSES.OPENING
        ).length === 0
      ) {
        try {
          const clonedAcademicYear = _.cloneDeep(academicYear);
          clonedAcademicYear.endDate = new Date();
          clonedAcademicYear.isOpening = false;
          setStatus("pending");
          const actionResult = await dispatch(
            editAcademicYear(clonedAcademicYear)
          );
          unwrapResult(actionResult);

          dispatch(resetRegistrationState());
          dispatch(resetTeachingState());
          dispatch(setSnackBarContent("Close academic year successfully"));
          dispatch(setShowSuccessSnackBar(true));
          props.setShowModal(false);
        } catch (error) {
          console.log("Close academic year failed", error);
          if (error.response) {
            dispatch(setSnackBarContent(error.response.data.message));
          } else {
            dispatch(setSnackBarContent("Close academic year failed"));
          }
          dispatch(setShowErrorSnackBar(true));
          props.setShowModal(false);
        }
      } else {
        dispatch(setShowErrorSnackBar(true));
        dispatch(
          setSnackBarContent(
            "All opening semesters must be closed before closing academic year"
          )
        );
      }
    }
  };

  return (
    <Modal {...props} style={{ overlay: { zIndex: 1000 } }}>
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

export default CloseAcademicYearModal;
