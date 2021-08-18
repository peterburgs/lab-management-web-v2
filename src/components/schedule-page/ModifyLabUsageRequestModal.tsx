import React, { useState } from "react";
import styled from "styled-components";
import { styled as materialStyled } from "@material-ui/styles";
import Modal from "../common/Modal";
import { ModalProps } from "../../types/modal";
import {
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@material-ui/core";
import Button from "../common/Button";
import { unwrapResult } from "@reduxjs/toolkit";

// import models
import {
  Request,
  REQUEST_TYPES,
  REQUEST_STATUSES,
} from "../../types/model";
// import reducers
import { newRequest } from "../../reducers/requestSlice";
import {
  setShowErrorSnackBar,
  setShowSuccessSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
// import hooks
import { useAppDispatch, useAppSelector } from "../../store";
import { useForm, Controller } from "react-hook-form";

interface ModifyLabUsageRequestProps extends ModalProps {
  labUsageId: string;
  semester: string;
}

const ModifyLabUsageRequestModal = (
  props: ModifyLabUsageRequestProps
) => {
  // call hooks
  const { register, handleSubmit, errors, control } =
    useForm<Request>();
  const dispatch = useAppDispatch();
  const labs = useAppSelector((state) => state.labs.labs);
  // TODO: NOT OPEN SEMESTER
  const semester = useAppSelector((state) =>
    state.semesters.semesters.find(
      (item) => item._id === props.semester
    )
  );
  const verifiedUser = useAppSelector(
    (state) => state.auth.verifiedUser
  );
  const labUsage = useAppSelector((state) =>
    state.schedule.labUsages.find(
      (item) => item._id === props.labUsageId
    )
  );
  const labUsages = useAppSelector(
    (state) => state.schedule.labUsages
  );

  // useState
  const [status, setStatus] = useState("idle");

  const checkPeriod = (
    startA: number,
    endA: number,
    startB: number,
    endB: number
  ) => {
    if (startB >= startA && endB <= endA) return true;
    if (startB >= startA && startB <= endA && endB >= endA)
      return true;
    if (startB <= startA && endB >= startA && endB <= endA)
      return true;
    return false;
  };

  const isValidLabUsage = (
    weekNo: number,
    dayOfWeek: number,
    startPeriod: number,
    endPeriod: number,
    labId: string
  ) => {
    if (labUsage && labUsages.length > 0) {
      if (
        labUsages.filter(
          (item) =>
            item.weekNo === weekNo &&
            item.dayOfWeek === dayOfWeek &&
            checkPeriod(
              item.startPeriod,
              item.endPeriod,
              startPeriod,
              endPeriod
            ) &&
            item.lab === labId
        ).length === 0
      ) {
        return true;
      }
    }
    return false;
  };

  // handle submit event
  const onSubmit = async (data: Request) => {
    if (
      labUsages.length > 0 &&
      labUsage &&
      labs.find((item) => item._id === data.lab)
    ) {
      if (
        isValidLabUsage(
          data.weekNo,
          data.dayOfWeek,
          data.startPeriod,
          data.endPeriod,
          data.lab as string
        )
      ) {
        try {
          data.isHidden = false;
          data.uId = verifiedUser!._id;
          data.status = REQUEST_STATUSES.PENDING;
          data.labUsage = labUsage._id;
          data.oldLab = labUsage.lab as string;
          data.oldWeekNo = labUsage.weekNo;
          data.oldDayOfWeek = labUsage.dayOfWeek;
          data.oldStartPeriod = labUsage.startPeriod;
          data.oldEndPeriod = labUsage.endPeriod;
          data.type = REQUEST_TYPES.MODIFY_LAB_USAGE;
          setStatus("pending");
          const actionResult = await dispatch(newRequest(data));
          unwrapResult(actionResult);
          setStatus("idle");
          dispatch(
            setSnackBarContent("Create new request successfully")
          );
          dispatch(setShowSuccessSnackBar(true));
          props.setShowModal(false);
        } catch (err) {
          if (err.response) {
            dispatch(setSnackBarContent(err.response.data.message));
          } else {
            dispatch(
              setSnackBarContent("Failed to create new request")
            );
          }
          setStatus("idle");
          dispatch(setShowErrorSnackBar(true));
          props.setShowModal(false);
        }
      } else {
        dispatch(
          setSnackBarContent(
            "The lab you choose is not idle at the present"
          )
        );
        dispatch(setShowErrorSnackBar(true));
      }
    } else {
      dispatch(setSnackBarContent("Lab name is not correct"));
      dispatch(setShowErrorSnackBar(true));
    }
  };

  return (
    <Modal {...props}>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {labUsages.length > 0 &&
          labUsage &&
          labs.length > 0 &&
          semester && (
            <>
              <StyledTextField
                label="Title"
                inputRef={register({ required: true })}
                name="title"
                error={Boolean(errors.title)}
                helperText={errors.title && "*This field is required"}
              />
              <StyledTextField
                label="Description"
                inputRef={register({ required: false })}
                name="description"
                error={Boolean(errors.description)}
                helperText={
                  errors.description && "*This field is required"
                }
              />
              <ContentContainer>
                <CurrentUsage>
                  <CurrentUsageHeader>
                    Current Usage
                  </CurrentUsageHeader>
                  <StyledFormControl variant="outlined">
                    <InputLabel id="oldlab-label">Lab</InputLabel>
                    <Select disabled value={labUsage.lab} label="Lab">
                      {labs.map((lab, i) => (
                        <MenuItem value={lab._id} key={lab._id}>
                          {lab.labName}
                        </MenuItem>
                      ))}
                    </Select>
                  </StyledFormControl>

                  <StyledFormControl variant="outlined">
                    <InputLabel id="oldweekno-label">Week</InputLabel>
                    <Select
                      disabled
                      labelId="oldweekno-label"
                      value={labUsage.weekNo}
                      label="Week"
                    >
                      {[...Array(semester.numberOfWeeks)].map(
                        (_, i) => (
                          <MenuItem value={i} key={"weekNo" + i}>
                            {i}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </StyledFormControl>

                  <StyledFormControl variant="outlined">
                    <InputLabel id="olddow-label">
                      Day of week
                    </InputLabel>
                    <Select
                      disabled
                      labelId="olddow-label"
                      value={labUsage.dayOfWeek}
                      label="Day of week"
                    >
                      <MenuItem value={0}>Monday</MenuItem>
                      <MenuItem value={1}>Tuesday</MenuItem>
                      <MenuItem value={2}>Wednesday</MenuItem>
                      <MenuItem value={3}>Thursday</MenuItem>
                      <MenuItem value={4}>Friday</MenuItem>
                      <MenuItem value={5}>Saturday</MenuItem>
                      <MenuItem value={6}>Sunday</MenuItem>
                    </Select>
                  </StyledFormControl>

                  <StyledFormControl variant="outlined">
                    <InputLabel id="oldstart-label">
                      Start period
                    </InputLabel>
                    <Select
                      disabled
                      labelId="oldstart-label"
                      value={labUsage.startPeriod}
                      label="Start period"
                    >
                      {[...Array(15)].map((_, i) => (
                        <MenuItem
                          value={i + 1}
                          key={"startPeriod" + i}
                        >
                          {i + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </StyledFormControl>

                  <StyledFormControl variant="outlined">
                    <InputLabel id="oldend-label">
                      End period
                    </InputLabel>
                    <Select
                      disabled
                      labelId="oldend-label"
                      value={labUsage.endPeriod}
                      label="End period"
                    >
                      {[...Array(15)].map((_, i) => (
                        <MenuItem value={i + 1} key={"endPeriod" + i}>
                          {i + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </StyledFormControl>
                </CurrentUsage>
                <NewUsage>
                  <NewUsageHeader>New Usage</NewUsageHeader>
                  <Controller
                    name="lab"
                    control={control}
                    defaultValue={labUsage.lab}
                    rules={{ required: true }}
                    render={(props) => (
                      <StyledFormControl variant="outlined">
                        <InputLabel id="lab-label">Lab</InputLabel>
                        <Select
                          labelId="lab-label"
                          value={props.value}
                          onChange={(e) =>
                            props.onChange(e.target.value)
                          }
                          label="Lab"
                        >
                          {labs.map((lab, i) => (
                            <MenuItem value={lab._id} key={lab._id}>
                              {lab.labName}
                            </MenuItem>
                          ))}
                        </Select>
                      </StyledFormControl>
                    )}
                  />
                  <Controller
                    name="weekNo"
                    control={control}
                    defaultValue={labUsage.weekNo}
                    rules={{ required: true }}
                    render={(props) => (
                      <StyledFormControl variant="outlined">
                        <InputLabel id="weekno-label">
                          Week
                        </InputLabel>
                        <Select
                          labelId="weekno-label"
                          value={props.value}
                          onChange={(e) =>
                            props.onChange(e.target.value)
                          }
                          label="Week"
                        >
                          {[...Array(semester.numberOfWeeks)].map(
                            (_, i) => (
                              <MenuItem value={i} key={"weekNo" + i}>
                                {i}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      </StyledFormControl>
                    )}
                  />
                  <Controller
                    name="dayOfWeek"
                    control={control}
                    defaultValue={labUsage.dayOfWeek}
                    rules={{ required: true }}
                    render={(props) => (
                      <StyledFormControl variant="outlined">
                        <InputLabel id="dow-label">
                          Day of week
                        </InputLabel>
                        <Select
                          labelId="dow-label"
                          value={props.value}
                          onChange={(e) =>
                            props.onChange(e.target.value)
                          }
                          label="Day of week"
                        >
                          <MenuItem value={0}>Monday</MenuItem>
                          <MenuItem value={1}>Tuesday</MenuItem>
                          <MenuItem value={2}>Wednesday</MenuItem>
                          <MenuItem value={3}>Thursday</MenuItem>
                          <MenuItem value={4}>Friday</MenuItem>
                          <MenuItem value={5}>Saturday</MenuItem>
                          <MenuItem value={6}>Sunday</MenuItem>
                        </Select>
                      </StyledFormControl>
                    )}
                  />
                  <Controller
                    name="startPeriod"
                    control={control}
                    defaultValue={labUsage.startPeriod}
                    rules={{ required: true }}
                    render={(props) => (
                      <StyledFormControl variant="outlined">
                        <InputLabel id="start-label">
                          Start period
                        </InputLabel>
                        <Select
                          labelId="start-label"
                          value={props.value}
                          onChange={(e) =>
                            props.onChange(e.target.value)
                          }
                          label="Start period"
                        >
                          {[...Array(15)].map((_, i) => (
                            <MenuItem
                              value={i + 1}
                              key={"startPeriod" + i}
                            >
                              {i + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </StyledFormControl>
                    )}
                  />
                  <Controller
                    name="endPeriod"
                    control={control}
                    defaultValue={labUsage.endPeriod}
                    rules={{ required: true }}
                    render={(props) => (
                      <StyledFormControl variant="outlined">
                        <InputLabel id="end-label">
                          End period
                        </InputLabel>
                        <Select
                          labelId="end-label"
                          value={props.value}
                          onChange={(e) =>
                            props.onChange(e.target.value)
                          }
                          label="End period"
                        >
                          {[...Array(15)].map((_, i) => (
                            <MenuItem
                              value={i + 1}
                              key={"endPeriod" + i}
                            >
                              {i + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </StyledFormControl>
                    )}
                  />
                </NewUsage>
              </ContentContainer>
              <StyledButton
                disabled={status === "pending"}
                loading={status === "pending"}
                type="submit"
              >
                Submit
              </StyledButton>{" "}
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

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 1rem;
  column-gap: 1rem;
  width: 100%;
`;

const CurrentUsage = styled.div`
  border-radius: 7px;
  box-shadow: ${({ theme }) => theme.greyShadow};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const NewUsage = styled.div`
  border-radius: 7px;
  box-shadow: ${({ theme }) => theme.greyShadow};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const CurrentUsageHeader = styled.div`
  font-size: 18px;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.blue};
`;

const NewUsageHeader = styled.div`
  font-size: 18px;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.red};
`;

const StyledTextField = materialStyled(TextField)({
  marginBottom: "1rem",
  marginTop: "0.5rem",
});

const StyledFormControl = materialStyled(FormControl)({
  marginBottom: "1rem",
  marginTop: "0.5rem",
});

export default ModifyLabUsageRequestModal;
