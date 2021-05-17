import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "../common/Modal";
import { ModalProps } from "../../types/modal";
import { useForm } from "react-hook-form";
import Button from "../common/Button";
import { unwrapResult } from "@reduxjs/toolkit";
import _ from "lodash";

// import reducers
import {
  setShowErrorSnackBar,
  setShowSuccessSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
import { generateSchedule } from "../../reducers/scheduleSlice";
// import hooks
import { useAppDispatch, useAppSelector } from "../../store";
import useGetAllTeachings from "../../hooks/teaching/useGetAllTeachings";
import { Teaching, Registration } from "../../types/model";

const GenerateScheduleModal = (props: ModalProps) => {
  const { handleSubmit } = useForm();

  const dispatch = useAppDispatch();

  const [latestRegistration, setLatestRegistration] =
    useState<Registration>(null!);

  const [teachings] = useGetAllTeachings();
  const registrations = useAppSelector(
    (state) => state.registrations.registrations
  );

  const [status, setStatus] = useState("idle");

  const onSubmit = async () => {
    if (latestRegistration) {
      try {
        setStatus("pending");
        const actionResult = await dispatch(
          generateSchedule({ registration: latestRegistration._id })
        );

        unwrapResult(actionResult);

        dispatch(
          setSnackBarContent("Generate schedule successfully")
        );
        dispatch(setShowSuccessSnackBar(true));
      } catch (err) {
        console.log("Failed to generate schedule", err);
        if (err.response) {
          dispatch(setSnackBarContent(err.response.data.message));
        } else {
          dispatch(setSnackBarContent("Failed to generate schedule"));
        }
        dispatch(setShowErrorSnackBar(true));
      } finally {
        setStatus("idle");
        props.setShowModal(false);
      }
    }
  };

  useEffect(() => {
    if (registrations.length > 0) {
      let reg: Registration;
      if (registrations.length === 1) {
        reg = _.cloneDeep(registrations[0]);
        setLatestRegistration(reg);
      } else {
        const newRegs = _.cloneDeep(registrations);
        reg = _.cloneDeep(
          newRegs.sort((a, b) => b.batch - a.batch)
        )[0];
        setLatestRegistration(reg);
      }
    }
  }, [registrations]);

  return (
    <Modal {...props}>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {latestRegistration && (
          <Label>
            <Header>{`Registration batch ${latestRegistration.batch}`}</Header>
            <Text>{`The number of teachings: ${
              teachings.filter(
                (teaching) =>
                  teaching.registration === latestRegistration._id
              ).length
            }`}</Text>
          </Label>
        )}
        <SubmitButton
          disabled={status === "pending"}
          loading={status === "pending"}
          type="submit"
        >
          Generate
        </SubmitButton>
      </StyledForm>
    </Modal>
  );
};

// Styling
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const SubmitButton = styled(Button)`
  background-color: ${({ disabled, theme }) =>
    disabled ? theme.grey : theme.veryLightBlue};
  box-shadow: none;
  color: ${({ disabled, theme }) =>
    disabled ? theme.darkGrey : theme.blue};
  font-weight: 500;
  font-size: 18px;
  margin-top: 1rem;
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

const Label = styled.div`
  margin-bottom: "1rem";
  margin-left: "0.5rem";
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  font-size: 20px;
  font-weight: 500;
`;

const Text = styled.div`
  margin-top: 1rem;
  font-size: 16px;
  font-weight: 400;
`;

export default GenerateScheduleModal;
