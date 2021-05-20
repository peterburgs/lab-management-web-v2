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
import { ReactComponent as WarningImage } from "../../assets/images/warning.svg";

const StartSemesterModal = (props: ModalProps) => {
  const [status, setStatus] = useState("idle");
  const { id } = useParams<{ id: string }>();
  const semester = useAppSelector((state) =>
    state.semesters.semesters.find((item) => item._id === id)
  );
  const academicYears = useAppSelector(
    (state) => state.academicYears.academicYears
  );
  const semesters = useAppSelector(
    (state) => state.semesters.semesters
  );
  const dispatch = useAppDispatch();
  const { handleSubmit } = useForm<Semester>();

  // handle close semester submit
  const onSubmit = async () => {
    if (semester) {
      const academicYear = academicYears.find(
        (item) => item._id === semester.academicYear
      );
      const openSemester = semesters
        .filter((item) => item.academicYear === academicYear?._id)
        .find((item) => item.status === SEMESTER_STATUSES.OPENING);
      if (!openSemester) {
        if (semester.index > 1) {
          const previousSemester = semesters.find(
            (item) =>
              item.academicYear === academicYear?._id &&
              item.index === semester.index - 1
          );
          if (previousSemester) {
            if (
              previousSemester.status !== SEMESTER_STATUSES.CLOSED
            ) {
              dispatch(setShowErrorSnackBar(true));
              dispatch(
                setSnackBarContent(
                  `Semester ${semester.index - 1} must be closed`
                )
              );
              return;
            }
          }
        }

        try {
          const clonedSemester = _.cloneDeep(semester);
          clonedSemester.status = SEMESTER_STATUSES.OPENING;
          clonedSemester.startDate = new Date();
          setStatus("pending");
          const actionResult = await dispatch(
            editSemester(clonedSemester)
          );
          unwrapResult(actionResult);

          dispatch(resetRegistrationState());
          dispatch(resetTeachingState());
          dispatch(setSnackBarContent("Start semester successfully"));
          dispatch(setShowSuccessSnackBar(true));
          props.setShowModal(false);
        } catch (error) {
          console.log("Failed to start semester", error);
          if (error.response) {
            dispatch(setSnackBarContent(error.response.data.message));
          } else {
            dispatch(setSnackBarContent("Failed to start semester"));
          }
          dispatch(setShowErrorSnackBar(true));
          props.setShowModal(false);
        }
      } else {
        dispatch(setShowErrorSnackBar(true));
        dispatch(
          setSnackBarContent(
            "Close all semesters before starting new one"
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
  background-color: ${({ theme }) => theme.lightGreen};
  box-shadow: none;
  color: ${({ theme }) => theme.green};
  font-weight: 500;
  font-size: 18px;
  &:hover {
    background-color: ${({ theme }) => theme.green};
    color: white;
  }
  &:active {
    background-color: ${({ theme }) => theme.green};
    &:hover {
      background-color: ${({ theme }) => theme.green};
    }
  }
`;

export default StartSemesterModal;
