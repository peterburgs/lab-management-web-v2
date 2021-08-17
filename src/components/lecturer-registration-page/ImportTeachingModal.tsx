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
    state.registrations.registrations.find((reg) => reg.isOpening === true)
  );
  // get verified user
  const verifiedUser = useAppSelector((state) => state.auth.verifiedUser);

  // Fetch registrable courses
  const [registrableCourses, registrableCourseStatus] =
    useGetRegistrableCoursesByRegistration(openRegistration?._id);

  // handle new course submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (registrableCourseStatus === "succeeded") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const workbook = XLSX.read(e.target!.result, {
          type: "binary",
        });

        let teachings: Teaching[] = [];
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        let data = XLSX.utils.sheet_to_json(sheet);

        const attrs = [
          "#",
          "class code",
          "course name",
          "credits",
          "course type",
          "class",
          "number of students",
          "day of week",
          "periods",
          "theory room",
          "number of practical weeks",
          "start practical week",
        ];

        let isTeachingValid = true;

        for (let index = 0; index < data.length; index++) {
          const item = data[index];

          let teaching: Teaching = {
            code: "",
            uId: "",
            user: "",
            course: "",
            group: 0,
            dayOfWeek: 0,
            startPeriod: 0,
            endPeriod: 0,
            numberOfStudents: 0,
            numberOfPracticalWeeks: 0,
            startPracticalWeek: 0,
            registration: "",
            theoryRoom: "",
            isHidden: false,
            class: "",
          };

          // check if right format
          if (
            attrs.length !==
            Object.keys(item as { [index: string]: string }).length
          ) {
            dispatch(
              setSnackBarContent(
                `${index}/${data.length} teachings are ACCEPTED. ${
                  data.length - index
                }/${data.length} are invalid and will be dropped.`
              )
            );
            dispatch(setShowSuccessSnackBar(true));
            break;
          }

          for (let [key, value] of Object.entries(
            item as { [index: string]: string }
          )) {
            let strValue = value as string;

            switch (key.toLowerCase()) {
              case "class code":
                teaching.code = strValue;
                teaching.course = strValue.split("_")[0];
                teaching.group = Number(strValue.split("_")[1]);
                teaching.registration = openRegistration!._id;
                break;
              case "class":
                teaching.class = strValue;
                break;
              case "number of students":
                teaching.numberOfStudents = Number(strValue);
                break;
              case "theory room":
                teaching.theoryRoom = strValue;
                break;
              case "day of week":
                switch (strValue.toLowerCase()) {
                  case "monday":
                    teaching.dayOfWeek = 0;
                    break;
                  case "tuesday":
                    teaching.dayOfWeek = 1;
                    break;
                  case "wednesday":
                    teaching.dayOfWeek = 2;
                    break;
                  case "thursday":
                    teaching.dayOfWeek = 3;
                    break;
                  case "friday":
                    teaching.dayOfWeek = 4;
                    break;
                  case "saturday":
                    teaching.dayOfWeek = 5;
                    break;
                  case "sunday":
                    teaching.dayOfWeek = 6;
                    break;
                }
                break;
              case "periods":
                teaching.startPeriod = Number(strValue.split("-")[0]);
                teaching.endPeriod = Number(strValue.split("-")[1]);
                break;
              case "number of practical weeks":
                teaching.numberOfPracticalWeeks = Number(strValue);
                break;
              case "start practical week":
                teaching.startPracticalWeek = Number(strValue);
                break;
            }

            // check if courses are in registrable courses
            if (key.toLowerCase() === "class code") {
              if (
                !(registrableCourses as RegistrableCourse[]).find(
                  (item) => item.course === teaching.course
                )
              ) {
                dispatch(
                  setSnackBarContent(
                    `${index}/${data.length} teachings are ACCEPTED. ${
                      data.length - index
                    }/${
                      data.length
                    } are not allowed to register and will be dropped.`
                  )
                );
                dispatch(setShowErrorSnackBar(true));
                isTeachingValid = false;
                break;
              }
            }
          }

          if (isTeachingValid) {
            teachings.push(teaching);
          } else {
            break;
          }
        }

        console.log(teachings);

        if (teachings.length > 0) {
          setStatus("pending");
          try {
            const prepareData = teachings.map((teaching) => {
              teaching.course = teaching.course.toString();
              return {
                ...teaching,
                registration: openRegistration!._id,
                user: verifiedUser!._id,
                uId: verifiedUser!._id,
                isHidden: false,
              };
            });

            console.log(prepareData);

            const actionResult = await dispatch(
              createBulkOfTeachings(prepareData)
            );
            unwrapResult(actionResult);
            dispatch(setShowErrorSnackBar(false));
            dispatch(setSnackBarContent("New teachings created"));
            dispatch(setShowSuccessSnackBar(true));
          } catch (err) {
            console.log("Failed to create teachings", err);
            if (err.response) {
              dispatch(setSnackBarContent(err.response.data.message));
            } else {
              dispatch(setSnackBarContent("Failed to create teachings"));
            }
            dispatch(setShowErrorSnackBar(true));
          } finally {
            setStatus("idle");
            props.setShowModal(false);
          }
        }
      };
      reader.readAsBinaryString(fileSelected[0]);
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
          <ChooseFileContainer>
            <InputFile
              onChange={handleFileSelected}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              type="file"
              id="contained-button-file"
            />
            <label htmlFor="contained-button-file">
              <ChooseFileButton>Choose excel file</ChooseFileButton>
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
  color: ${({ disabled, theme }) => (disabled ? theme.darkGrey : theme.blue)};
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
