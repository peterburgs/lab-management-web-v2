import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "../common/Modal";
import { ModalProps } from "../../types/modal";
import { useForm } from "react-hook-form";
import Button from "../common/Button";
import { unwrapResult } from "@reduxjs/toolkit";
import _ from "lodash";
import { ReactComponent as WarningImage } from "../../assets/images/warning.svg";
import { Checkbox, FormControlLabel } from "@material-ui/core";

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
import { Registration, User, ROLES } from "../../types/model";
import useGetAllUsers from "../../hooks/user/useGetAllUsers";
import { resetState as resetSemesterState } from "../../reducers/semesterSlice";
import { editRegistration } from "../../reducers/registrationSlice";

const GenerateScheduleModal = (props: ModalProps) => {
  const { handleSubmit } = useForm();

  const dispatch = useAppDispatch();

  const [enable, setEnable] = useState(false);

  const [latestRegistration, setLatestRegistration] =
    useState<Registration>(null!);

  const [teachings] = useGetAllTeachings();
  const [users] = useGetAllUsers();
  const registrations = useAppSelector(
    (state) => state.registrations.registrations
  );

  const [status, setStatus] = useState("idle");

  const onSubmit = async () => {
    if (latestRegistration) {
      if (latestRegistration.isGenerable) {
        if (!latestRegistration.isOpening) {
          if (
            teachings.filter(
              (teaching) =>
                teaching.registration === latestRegistration._id
            ).length > 0
          ) {
            try {
              setStatus("pending");
              const actionResult = await dispatch(
                generateSchedule({
                  registration: latestRegistration._id,
                })
              );

              latestRegistration.isGenerable = false;
              await dispatch(editRegistration(latestRegistration));

              unwrapResult(actionResult);

              dispatch(resetSemesterState());

              dispatch(
                setSnackBarContent("Generate schedule successfully")
              );
              dispatch(setShowSuccessSnackBar(true));
            } catch (err) {
              if (err.message) {
                dispatch(setSnackBarContent(err.message));
              } else {
                dispatch(
                  setSnackBarContent("Failed to generate schedule")
                );
              }
              dispatch(setShowErrorSnackBar(true));
            } finally {
              setStatus("idle");
              props.setShowModal(false);
            }
          } else {
            dispatch(setShowErrorSnackBar(true));
            dispatch(
              setSnackBarContent(
                "Cannot create schedule since no teachings found."
              )
            );
          }
        } else {
          dispatch(setShowErrorSnackBar(true));
          dispatch(
            setSnackBarContent(
              "A registration is opening. Cannot create schedule"
            )
          );
        }
      } else {
        dispatch(setShowErrorSnackBar(true));
        dispatch(
          setSnackBarContent(
            "This batch already generated a schedule"
          )
        );
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
            <Text>{`Number of teachings: ${
              teachings.filter(
                (teaching) =>
                  teaching.registration === latestRegistration._id
              ).length
            }`}</Text>
            <Text>{`Lecturers have submitted: ${
              (users as User[]).filter((user) => {
                if (
                  teachings
                    .filter(
                      (teaching) =>
                        teaching.registration ===
                        latestRegistration._id
                    )
                    .find((item) => item.user === user._id)
                ) {
                  return true;
                }
                return false;
              }).length
            }/${
              (users as User[]).filter((item) =>
                item.roles.includes(ROLES.LECTURER)
              ).length
            }`}</Text>
          </Label>
        )}
        <div
          style={{
            width: "100%",
            height: 1,
            background: "grey",
            marginTop: "1rem",
          }}
        ></div>
        <WarningImage height={150} />
        <div
          style={{
            color: "red",
            fontStyle: "italic",
            marginBottom: "1rem",
            fontSize: 12,
            textAlign: "center",
          }}
        >
          * You will not be able to edit lab status after generating
          schedule
        </div>
        <div
          style={{
            color: "red",
            fontStyle: "italic",
            marginBottom: "1rem",
            fontSize: 12,
            textAlign: "center",
          }}
        >
          * The labs that are added after this moment will not be used
          for creating schedule but they might be used for extra
          classes
        </div>
        <FormControlLabel
          control={
            <Checkbox
              checked={enable}
              onChange={() => setEnable((current) => !current)}
              name="checkedB"
              color="primary"
            />
          }
          label="I am sure to generate schedule."
        />
        <SubmitButton
          disabled={status === "pending" || !enable}
          loading={status === "pending"}
          type="submit"
        >
          Confirm
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
