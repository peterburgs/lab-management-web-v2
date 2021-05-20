import React, { ChangeEvent, FormEvent, useState } from "react";
import styled from "styled-components";
import Modal from "../common/Modal";
import { ModalProps } from "../../types/modal";
import { unwrapResult } from "@reduxjs/toolkit";
import Button from "../common/Button";
import * as XLSX from "xlsx";
import { ReactComponent as WarningImage } from "../../assets/images/warning.svg";

// import models
import { Lab, SEMESTER_STATUSES } from "../../types/model";
// import reducers
import { newLab } from "../../reducers/labSlice";
import {
  setShowErrorSnackBar,
  setShowSuccessSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
// import hooks
import { useAppDispatch, useAppSelector } from "../../store";
import { red } from "@material-ui/core/colors";

const ImportLabModal = (props: ModalProps) => {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState("idle");
  const [fileSelected, setFileSelected] = useState<FileList>(null!);

  const semesters = useAppSelector(
    (state) => state.semesters.semesters
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const workbook = XLSX.read(e.target!.result, {
        type: "binary",
      });

      let labs: Lab[] = [];
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      let data = XLSX.utils.sheet_to_json(sheet);

      const attrs = ["STT", "Phòng thực hành", "Sức chứa"];

      data.forEach((item, i) => {
        // Convert to teaching model

        let isAvailableForCurrentUsing = true;

        const openSemester = semesters.find(
          (item) => item.status === SEMESTER_STATUSES.OPENING
        );

        if (openSemester) {
          isAvailableForCurrentUsing = false;
        }

        let lab: Lab = {
          labName: "",
          capacity: 0,
          isAvailableForCurrentUsing: isAvailableForCurrentUsing,
          isHidden: false,
        };
        for (let [key, value] of Object.entries(
          item as { [index: string]: string }
        )) {
          // check if right format
          if (!attrs.find((attr) => attr === key)) {
            dispatch(
              setSnackBarContent(
                "Incorrect format. Please refer template file."
              )
            );
            dispatch(setShowErrorSnackBar(true));
            return;
          }

          let strValue = value as string;

          if (strValue.length === 0) {
            dispatch(
              setSnackBarContent(
                `${key} at row ${i} is missing. This teaching will be skipped`
              )
            );
            dispatch(setShowErrorSnackBar(true));
            continue;
          }

          switch (key.toLowerCase()) {
            case "phòng thực hành":
              lab.labName = strValue;
              break;
            case "sức chứa":
              lab.capacity = Number(strValue);
              break;
          }
        }
        labs.push(lab);
      });

      console.log(labs);

      //send data to server
      setStatus("pending");
      try {
        for (let lab of labs) {
          const actionResult = await dispatch(newLab(lab));
          unwrapResult(actionResult);
        }

        dispatch(setSnackBarContent("All new labs created"));
        dispatch(setShowSuccessSnackBar(true));
      } catch (err) {
        console.log("Failed to create all labs", err);
        if (err.response) {
          dispatch(setSnackBarContent(err.response.data.message));
        } else {
          dispatch(setSnackBarContent("Failed to create all labs"));
        }
        dispatch(setShowErrorSnackBar(true));
      } finally {
        setStatus("idle");
        props.setShowModal(false);
      }
    };
    reader.readAsBinaryString(fileSelected[0]);
  };

  // handle chose file
  const handleFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    setFileSelected(e.target.files!);
  };

  // conditional renderer
  const renderForm = () => {
    return (
      <>
        {semesters.filter(
          (item) => item.status === SEMESTER_STATUSES.OPENING
        ).length > 0 && (
          <>
            <WarningImage height={150} />
            <div
              style={{
                color: "red",
                fontStyle: "italic",
                marginBottom: "1rem",
                fontSize: 12,
                textAlign: 'center'
              }}
            >
              * There is an opening semester. The new labs will not be
              used for generating schedule but still be able for extra
              classes.
            </div>
          </>
        )}
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

export default ImportLabModal;
