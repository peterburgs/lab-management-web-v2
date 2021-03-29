import React, { useState } from "react";
import styled from "styled-components";
import Modal from "../common/Modal";
import { ModalProps } from "../../../types/modal";
import { Semester } from "../../react-app-env";
import EditSemesterModal from "./EditSemesterModal";
import { ReactComponent as Speaker } from "../../assets/images/speaker.svg";

interface SemesterModalProps extends ModalProps {
  semester: Semester;
}

const SemesterModal = (props: SemesterModalProps) => {
  const [showEditSemesterModal, setShowEditSemesterModal] = useState(
    false
  );

  return (
    <>
      <EditSemesterModal
        name={"Edit Semester"}
        showModal={showEditSemesterModal}
        setShowModal={setShowEditSemesterModal}
      />
      <Modal {...props}>
        <SemesterInfo>
          <Header>Semester Info</Header>
          <span>
            Start date:{" "}
            {new Date(props.semester.startDate).toDateString()}
          </span>
          <span>Number of weeks: {props.semester.numberOfWeeks}</span>
          <EditButton onClick={() => setShowEditSemesterModal(true)}>
            Edit
          </EditButton>
        </SemesterInfo>
        {/* <CurrentOpenRegistration>
          <Image>
            <Speaker />
          </Image>
          Registration batch 1 will be closed in 1 day
          <CloseRegistrationButton>
            Close Now
          </CloseRegistrationButton>
        </CurrentOpenRegistration> */}
      </Modal>
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
  color: #1877f2;
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

// const CurrentOpenRegistration = styled.div`
//   height: 170px;
//   width: 100%;
//   border-radius: 7px;
//   padding: 12px;
//   font-size: 16px;
//   font-weight: 500;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   align-items: center;
//   text-align: center;
//   line-height: 1.25rem;
//   margin-top: 1rem;
//   background-color: #e7f3ff;
// `;

// const Image = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   svg {
//     width: 60px;
//   }
// `;

// const CloseRegistrationButton = styled.button`
//   background-color: transparent;
//   margin: 0;
//   padding: 0 2rem;
//   height: 2rem;
//   border-radius: 7px;
//   color: red;
//   align-items: center;
//   justify-content: center;
//   border: 1px solid red;
//   text-decoration: none;
//   cursor: pointer;
//   display: inline-flex;
//   position: relative;
//   outline: none;
//   font-size: 14px;
//   margin-top: 0.5rem;
//   transition: background 0.2s ease 0s, color 0.2s ease 0s;

//   &:hover {
//     background-color: red;
//     color: white;
//   }

//   &:active {
//     transform: scale(0.98);
//   }
// `;

export default SemesterModal;
