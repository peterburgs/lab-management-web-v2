import React, { ChangeEvent, FormEvent, useState } from "react";
import styled from "styled-components";
import Modal from "../common/Modal";
import { ModalProps } from "../../types/modal";
import { unwrapResult } from "@reduxjs/toolkit";
import Button from "../common/Button";
import * as XLSX from "xlsx";

// import models
import { Teaching, RegistrableCourse } from "../../types/model";
// import reducers
import {
  createBulkOfTeachings,
  newTeaching,
} from "../../reducers/teachingSlice";
import {
  setShowErrorSnackBar,
  setShowSuccessSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
// import hooks
import { useAppDispatch, useAppSelector } from "../../store";
import useGetRegistrableCoursesByRegistration from "../../hooks/registrableCourse/useGetRegistrableCoursesByRegistration";

const ImportTeachingModal = (props: ModalProps) => {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState("idle");
  const [fileSelected, setFileSelected] = useState<FileList>(null!);

  // get opening registration
  const openRegistration = useAppSelector((state) =>
    state.registrations.registrations.find(
      (reg) => reg.isOpening === true
    )
  );
  // get verified user
  const verifiedUser = useAppSelector(
    (state) => state.auth.verifiedUser
  );

  // Fetch registrable courses
  const [registrableCourses, registrableCourseStatus] =
    useGetRegistrableCoursesByRegistration(openRegistration?._id);

  // handle new course submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (registrableCourseStatus === "succeeded") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const teachings = [
          ...XLSX.utils.sheet_to_json(workbook.Sheets["data"]),
        ] as Teaching[];
        console.log(teachings);

        const attrs = [
          "course",
          "group",
          "dayOfWeek",
          "startPeriod",
          "endPeriod",
          "numberOfStudents",
          "theoryRoom",
          "numberOfPracticalWeeks",
        ];

        const attrsDataType = {
          course: "string",
          group: "number",
          dayOfWeek: "number",
          startPeriod: "number",
          endPeriod: "number",
          numberOfStudents: "number",
          theoryRoom: "string",
          numberOfPracticalWeeks: "number",
        } as { [index: string]: string };

        for (const teaching of teachings) {
          for (let [key, value] of Object.entries(teaching)) {
            // check if right format
            if (!attrs.find((attr) => attr === key)) {
              dispatch(
                setSnackBarContent(
                  "Failed to convert your file. Please check out the template again"
                )
              );
              dispatch(setShowErrorSnackBar(true));
              return;
            }

            // check if right data type
            if (key === "course") value = value.toString();
            if (typeof value !== attrsDataType[key]) {
              console.log(typeof value);
              dispatch(
                setSnackBarContent(
                  "Your data does not have correct type"
                )
              );
              dispatch(setShowErrorSnackBar(true));
              return;
            }

            // check if courses are in registrable courses
            if (key === "course") {
              if (
                !(registrableCourses as RegistrableCourse[]).find(
                  (item) => item.course === value
                )
              ) {
                dispatch(
                  setSnackBarContent(
                    `${value} is not in registrable courses`
                  )
                );
                dispatch(setShowErrorSnackBar(true));
                return;
              }
            }
          }
        }

        // send data to server
        setStatus("pending");
        try {
          const prepareData = teachings.map((teaching) => {
            teaching.course = teaching.course.toString();
            return {
              ...teaching,
              registration: openRegistration!._id,
              user: verifiedUser!._id,
              isHidden: false,
            };
          });

          console.log(prepareData);

          const actionResult = await dispatch(
            createBulkOfTeachings(prepareData)
          );
          unwrapResult(actionResult);

          dispatch(setSnackBarContent("All new teachings created"));
          dispatch(setShowSuccessSnackBar(true));
        } catch (err) {
          console.log("Failed to create all teachings", err);
          if (err.response) {
            dispatch(setSnackBarContent(err.response.data.message));
          } else {
            dispatch(
              setSnackBarContent("Failed to create all teachings")
            );
          }
          dispatch(setShowErrorSnackBar(true));
        } finally {
          setStatus("idle");
          props.setShowModal(false);
        }
      };
      reader.readAsArrayBuffer(fileSelected[0]);
    }
  };

  // handle chose file
  const handleFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    setFileSelected(e.target.files!);
  };

  // conditional renderer
  const renderForm = () => {
    if (registrableCourseStatus === "succeeded") {
      return (
        <>
          <ModalText>Choose excel file</ModalText>
          <ChooseFileContainer>
            <InputFile
              onChange={handleFileSelected}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              type="file"
              id="contained-button-file"
            />
            <label htmlFor="contained-button-file">
              <ChooseFileButton>Choose file</ChooseFileButton>
            </label>
            <FileSelectedName>
              {fileSelected && fileSelected[0].name}
            </FileSelectedName>
          </ChooseFileContainer>
          <SubmitButton
            disabled={status === "pending" || fileSelected === null}
            loading={status === "pending"}
            type="submit"
          >
            Submit
          </SubmitButton>
        </>
      );
    }
  };

  return (
    <Modal {...props}>
      <StyledForm onSubmit={handleSubmit}>{renderForm()}</StyledForm>
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

const InputFile = styled.input`
  display: none;
`;

const ChooseFileButton = styled.span`
  background-color: ${({ theme }) => theme.blue};
  box-shadow: ${({ theme }) => theme.blueShadow};
  margin: 0;
  padding: 0 2.5rem;
  min-height: 2.5rem;
  max-height: 40px;
  border-radius: 7px;
  color: white;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  display: inline-flex;
  position: relative;
  font-size: 14px;
  transition: background 0.2s ease 0s, color 0.2s ease 0s;

  &:active {
    background-color: ${({ theme }) => theme.blue};
    transform: scale(0.98);
    &:hover {
      background-color: ${({ theme }) => theme.blue};
    }
  }

  &:hover {
    background-color: ${({ theme }) => theme.lightBlue};
  }

  @media (max-width: 900px) {
    padding: 0 2rem;
  }
`;

const ChooseFileContainer = styled.div`
  white-space: nowrap;
`;

const FileSelectedName = styled.span`
  margin-left: 0.5rem;
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

export default ImportTeachingModal;
