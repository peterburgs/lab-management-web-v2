import React from "react";
import styled from "styled-components";
import Modal from "../common/Modal";
import { ModalProps } from "../../types/modal";
import { ROLES } from "../../types/model";
import { useAppSelector } from "../../store";
import { Redirect, useParams } from "react-router";

interface SemesterModalProps extends ModalProps {
  setShowEditSemesterModal: (a: boolean) => void;
  setShowCloseSemesterModal: (a: boolean) => void;
}

const SemesterModal = (props: SemesterModalProps) => {
  const role = useAppSelector((state) => state.auth.verifiedRole);

  const { id } = useParams<{ id: string }>();
  const semester = useAppSelector((state) =>
    state.semesters.semesters.find((item) => item._id === id)
  );

  return (
    <>
      {semester ? (
        <Modal {...props}>
          <SemesterInfo>
            <Header>Semester Info</Header>
            <span>
              Start date:{" "}
              {new Date(semester.startDate).toDateString()}
            </span>
            <span>Number of weeks: {semester.numberOfWeeks}</span>
            {role === ROLES.ADMIN ? (
              <EditButton
                onClick={() => props.setShowEditSemesterModal(true)}
              >
                Edit
              </EditButton>
            ) : null}
          </SemesterInfo>
          {role === ROLES.ADMIN && semester.isOpening === true ? (
            <CloseRegistrationButton
              onClick={() => props.setShowCloseSemesterModal(true)}
            >
              Close Semester
            </CloseRegistrationButton>
          ) : null}
        </Modal>
      ) : (
        <Redirect to="/academic-years" />
      )}
    </>
  );
};

const Header = styled.div`
  font-weight: 500;
  font-size: 18px;
  margin-bottom: 0.6rem;
`;

const SemesterInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 15px;
  position: relative;

  span {
    margin-bottom: 0.5rem;
  }
`;

const EditButton = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.blue};
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  cursor: pointer;

  &:hover {
    border-radius: 7px;
    background-color: #e7f3ff;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CloseRegistrationButton = styled.button`
  background-color: transparent;
  margin: 0;
  padding: 0 2.5rem;
  min-height: 2.5rem;
  border-radius: 7px;
  color: ${({ theme }) => theme.red};
  align-items: center;
  justify-content: center;
  border: ${({ theme }) => `1px solid ${theme.red}`};
  text-decoration: none;
  cursor: pointer;
  display: inline-flex;
  position: relative;
  outline: none;
  font-size: 14px;
  margin-top: 1rem;
  transition: background 0.2s ease 0s, color 0.2s ease 0s;
  width: 100%;

  &:hover {
    background-color: ${({ theme }) => theme.red};
    color: white;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default SemesterModal;