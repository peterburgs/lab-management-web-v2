import React, { useState } from "react";
import styled from "styled-components";
import { styled as materialStyled } from "@material-ui/styles";
import Modal from "../common/Modal";
import { ModalProps } from "../../types/modal";
import { useForm } from "react-hook-form";
import { TextField } from "@material-ui/core";
import { unwrapResult } from "@reduxjs/toolkit";
import Button from "../common/Button";
import CheckboxList, { CheckboxItem } from "../common/CheckboxList";

// import models
import { User } from "../../types/react-app-env";
// import reducers
import { newUser } from "../../reducers/userSlice";
import {
  setShowErrorSnackBar,
  setShowSuccessSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
// import hooks
import { useAppDispatch } from "../../store";

const NewUserModal = (props: ModalProps) => {
  const { register, handleSubmit, errors } = useForm<User>();
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState("idle");
  const [selectedRoles, setSelectedRoles] = useState<CheckboxItem[]>(
    []
  );

  // handle new course submit
  const onSubmit = async (data: User) => {
    try {
      data.isHidden = false;

      setStatus("pending");
      const actionResult = await dispatch(newUser(data));
      unwrapResult(actionResult);

      dispatch(setSnackBarContent("New user created"));
      dispatch(setShowSuccessSnackBar(true));
    } catch (err) {
      console.log("Failed to create new user", err);
      if (err.response) {
        dispatch(setSnackBarContent(err.response.data.message));
      } else {
        dispatch(setSnackBarContent("Failed to create new user"));
      }
      dispatch(setShowErrorSnackBar(true));
    } finally {
      setStatus("idle");
      props.setShowModal(false);
    }
  };

  // handle select roles
  const handleSelectRoles = (value: CheckboxItem) => () => {
    const currentIndex = selectedRoles.findIndex(
      (role) => role._id === value._id
    );
    const newSelectedRoles = [...selectedRoles];

    if (currentIndex === -1) {
      newSelectedRoles.push(value);
    } else {
      newSelectedRoles.splice(currentIndex, 1);
    }
    setSelectedRoles(newSelectedRoles);
  };

  return (
    <Modal {...props}>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <StyledTextField
          label="User ID"
          inputRef={register({ required: true })}
          name="_id"
          error={Boolean(errors._id)}
          helperText={errors._id && "*This field is required"}
        />
        <StyledTextField
          label="Full name"
          inputRef={register({ required: true })}
          name="fullName"
          error={Boolean(errors.fullName)}
          helperText={errors.fullName && "*This field is required"}
        />
        <StyledTextField
          label="Email"
          inputRef={register({ required: true })}
          name="email"
          error={Boolean(errors.email)}
          helperText={errors.email && "*This field is required"}
        />

        <ModalText>Roles</ModalText>

        <CheckboxList
          selectedItems={selectedRoles}
          onSelectItem={handleSelectRoles}
          items={[
            { _id: "ADMIN", name: "Admin" },
            { _id: "LECTURER", name: "Lecturer" },
          ]}
        />

        <StyledButton
          disabled={status === "pending"}
          loading={status === "pending"}
          type="submit"
        >
          Submit
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

const ModalText = styled.div`
  font-size: 13px;
  margin-bottom: 1rem;
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

export default NewUserModal;
