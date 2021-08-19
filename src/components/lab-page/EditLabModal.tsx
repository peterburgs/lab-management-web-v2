import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { styled as materialStyled } from "@material-ui/styles";
import Modal from "../common/Modal";
import { ModalProps } from "../../types/modal";
import {
  TextField,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import Button from "../common/Button";
import _ from "lodash";
import { unwrapResult } from "@reduxjs/toolkit";

// import models
import { Lab, SEMESTER_STATUSES } from "../../types/model";
// import reducers
import { editLab } from "../../reducers/labSlice";
import {
  setShowErrorSnackBar,
  setShowSuccessSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
// import hooks
import { useAppDispatch, useAppSelector } from "../../store";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";

const EditLabModal = (props: ModalProps) => {
  // call hooks
  const { register, handleSubmit, errors } = useForm<Lab>();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const [isAvailableForCurrentUsing, setIsAvailableForCurrentUsing] =
    useState(false);

  const lab = useAppSelector((state) =>
    state.labs.labs.find((item) => item._id === id)
  );

  const openSemester = useAppSelector((state) =>
    state.semesters.semesters.find(
      (item) => item.status === SEMESTER_STATUSES.OPENING
    )
  );

  // useState
  const [status, setStatus] = useState("idle");

  // handle submit event
  const onSubmit = async (data: Lab) => {
    if (lab) {
      try {
        const clonedLab = {
          ..._.cloneDeep(lab),
          ...data,
        };

        clonedLab.isAvailableForCurrentUsing =
          isAvailableForCurrentUsing;

        setStatus("pending");
        const actionResult = await dispatch(editLab(clonedLab));
        unwrapResult(actionResult);

        setStatus("idle");
        dispatch(setSnackBarContent("Edit lab successfully"));
        dispatch(setShowSuccessSnackBar(true));
        props.setShowModal(false);
      } catch (err) {
        if (err.message) {
          dispatch(setSnackBarContent(err.message));
        } else {
          dispatch(setSnackBarContent("Failed to edit lab"));
        }
        setStatus("idle");
        dispatch(setShowErrorSnackBar(true));
        props.setShowModal(false);
      }
    }
  };

  useEffect(() => {
    if (lab) {
      setIsAvailableForCurrentUsing(lab.isAvailableForCurrentUsing);
    }
  }, [lab]);

  return (
    <Modal {...props}>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {lab && (
          <>
            <StyledTextField
              label="Lab name"
              inputRef={register({ required: true })}
              defaultValue={lab.labName}
              name="labName"
              error={Boolean(errors.labName)}
              helperText={errors.labName && "*This field is required"}
            />

            <StyledTextField
              label="Capacity"
              inputRef={register({ required: true })}
              defaultValue={lab.capacity}
              name="capacity"
              error={Boolean(errors.capacity)}
              helperText={
                errors.capacity && "*This field is required"
              }
            />

            <StyledTextField
              label="Description"
              inputRef={register({ required: false })}
              defaultValue={lab.description}
              name="description"
              error={Boolean(errors.description)}
              helperText={
                errors.description && "*This field is required"
              }
            />

            <FormControlLabel
              control={
                <Checkbox
                  disabled={
                    openSemester
                      ? openSemester.labSchedule!.length > 0
                        ? true
                        : false
                      : false
                  }
                  checked={isAvailableForCurrentUsing}
                  onChange={() =>
                    setIsAvailableForCurrentUsing(
                      (current) => !current
                    )
                  }
                  name="checkedB"
                  color="primary"
                />
              }
              label="Allow to use this lab"
            />
            <StyledButton
              disabled={status === "pending"}
              loading={status === "pending"}
              type="submit"
            >
              Submit
            </StyledButton>
          </>
        )}
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

export default EditLabModal;
