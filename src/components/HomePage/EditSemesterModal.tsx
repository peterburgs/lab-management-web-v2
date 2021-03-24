import React from "react";
import styled from "styled-components";
import { styled as materialStyled } from "@material-ui/core/styles";
import Modal from "../common/Modal";
import { ModalProps } from "../../../types/modal";
import { useForm } from "react-hook-form";
import { TextField } from "@material-ui/core";
import Button from "../common/Button";

interface Semester {
  semesterName: string;
  startDate: Date;
  numberOfWeeks: number;
}

const EditSemesterModal = (props: ModalProps) => {
  const { register, handleSubmit, errors } = useForm<Semester>();

  const onSubmit = (data: Semester) => console.log(data);

  return (
    <Modal {...props}>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <StyledTextField
          label="Semester name"
          inputRef={register({ required: true })}
          name="semesterName"
          error={Boolean(errors.semesterName)}
          helperText={
            errors.semesterName && "*This field is required"
          }
        />
        <StyledTextField
          label="Number of weeks"
          inputRef={register({ required: true })}
          name="numberOfWeeks"
          error={Boolean(errors.numberOfWeeks)}
          helperText={
            errors.numberOfWeeks && "*This field is required"
          }
        />
        <StyledButton type="submit">Submit</StyledButton>
      </StyledForm>
    </Modal>
  );
};

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const StyledButton = styled(Button)`
  background-color: #e7f3ff;
  box-shadow: none;
  color: #1877f2;
  font-weight: 500;
  font-size: 18px;
  &:hover {
    background-color: #dbe7f2;
  }
  &:active {
    background-color: #e7f3ff;
    &:hover {
      background-color: #e7f3ff;
    }
  }

`;

const StyledTextField = materialStyled(TextField)({
  marginBottom: "1rem",
});

export default EditSemesterModal;
