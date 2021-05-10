import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { styled as materialStyled } from "@material-ui/styles";
import Modal from "../common/Modal";
import { ModalProps } from "../../types/modal";
import { TextField } from "@material-ui/core";
import Button from "../common/Button";
import _ from "lodash";
import { unwrapResult } from "@reduxjs/toolkit";
import CheckboxList, { CheckboxItem } from "../common/CheckboxList";

// import models
import { ROLES, User } from "../../types/model";
// import reducers
import { editUser } from "../../reducers/userSlice";
import {
  setShowErrorSnackBar,
  setShowSuccessSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
// import hooks
import { useAppDispatch, useAppSelector } from "../../store";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";

const EditUserModal = (props: ModalProps) => {
  // call hooks
  const { register, handleSubmit, errors } = useForm<User>();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) =>
    state.users.users.find((item) => item._id === id)
  );

  // useState
  const [status, setStatus] = useState("idle");
  const [selectedRoles, setSelectedRoles] = useState<CheckboxItem[]>(
    []
  );

  // handle submit event
  const onSubmit = async (data: User) => {
    if (user) {
      try {
        data.roles = selectedRoles.map((role) => {
          return role._id === "0" ? ROLES.ADMIN : ROLES.LECTURER;
        });
        const clonedUser = {
          ..._.cloneDeep(user),
          ...data,
        };
        console.log(clonedUser);

        setStatus("pending");
        const actionResult = await dispatch(editUser(clonedUser));
        unwrapResult(actionResult);

        setStatus("idle");
        dispatch(setSnackBarContent("Edit user successfully"));
        dispatch(setShowSuccessSnackBar(true));
        props.setShowModal(false);
      } catch (err) {
        console.log("Failed to edit user", err);
        if (err.response) {
          dispatch(setSnackBarContent(err.response.data.message));
        } else {
          dispatch(setSnackBarContent("Failed to edit user"));
        }
        setStatus("idle");
        dispatch(setShowErrorSnackBar(true));
        props.setShowModal(false);
      }
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

  // useEffect
  useEffect(() => {
    if (user) {
      setSelectedRoles(
        user.roles.map((role) => {
          return {
            _id: role === ROLES.ADMIN ? "0" : "1",
            name: role === ROLES.ADMIN ? "Admin" : "Lecturer",
          };
        })
      );
    }
  }, [user]);

  return (
    <Modal {...props}>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {user && (
          <>
            <StyledTextField
              label="User ID"
              inputRef={register({ required: true })}
              defaultValue={user._id}
              InputProps={{ readOnly: true }}
              name="_id"
              error={Boolean(errors._id)}
              helperText={errors._id && "*This field is required"}
            />
            <StyledTextField
              label="Full name"
              inputRef={register({ required: true })}
              defaultValue={user.fullName}
              name="fullName"
              error={Boolean(errors.fullName)}
              helperText={
                errors.fullName && "*This field is required"
              }
            />
            <StyledTextField
              label="Email"
              inputRef={register({ required: true })}
              defaultValue={user.email}
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

const ModalText = styled.div`
  font-size: 13px;
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

export default EditUserModal;
