import React from "react";
import styled from "styled-components";
import { styled as materialStyled } from "@material-ui/core/styles";
import Modal from "../common/Modal";
import { ModalProps } from "../../../types/modal";
import { useForm, Controller } from "react-hook-form";
import { TextField } from "@material-ui/core";
import Button from "../common/Button";
import { DateTimePicker } from "@material-ui/lab";
import { Semester } from "../../react-app-env";

const EditSemesterModal = (props: ModalProps) => {
  const {
    register,
    handleSubmit,
    errors,
    control,
  } = useForm<Semester>();

  const onSubmit = (data: Semester) => console.log(data);

  return (
    <Modal {...props} style={{ overlay: { zIndex: 1000 } }}>
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
        <Controller
          name="startDate"
          control={control}
          rules={{ required: true }}
          render={(props) => (
            <DateTimePicker
              label="Start date"
              inputFormat="dd/MM/yyyy hh:mm a"
              renderInput={(props) => <StyledTextField {...props} />}
              onChange={(value) => props.onChange(value)}
              value={props.value}
            />
          )}
        />
        <StyledTextField
          label="Number of weeks"
          inputRef={register({ required: true })}
          name="numberOfWeeks"
          error={Boolean(errors.numberOfWeeks)}
          type="number"
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
