import React, { ReactNode } from "react";
import ReactModal, { Styles } from "react-modal";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";

interface ModalProps {
  name: string;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  children: ReactNode;
  style?: Styles;
}

const Modal = ({
  showModal,
  setShowModal,
  name,
  children,
  style,
}: ModalProps) => {
  return (
    <StyledModal
      isOpen={showModal}
      style={{
        overlay: { zIndex: 5, overflowY: "auto", height: "100vh" },
        ...style,
      }}
    >
      <Header>{name}</Header>
      <CloseIconButton onClick={() => setShowModal(false)}>
        <CloseIcon />
      </CloseIconButton>
      <ChildrenContainer>{children}</ChildrenContainer>
    </StyledModal>
  );
};

const StyledModal = styled(ReactModal)`
  position: relative;
  max-width: 700px;
  width: 95%;
  margin: auto;
  top: 70px;
  border: none;
  background: #fff;
  --webkit-overflow-scrolling: touch;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.greyShadow};
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  outline: none;
`;

const Header = styled.div`
  padding: 0px 60px;
  height: 60px;
  box-sizing: border-box;
  font-weight: 500;
  font-size: 1.25rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CloseIconButton = styled.button`
  color: white;
  display: flex;
  align-items: center;
  height: auto;
  top: 12px;
  right: 16px;
  background: ${({ theme }) => theme.lightGrey};
  border-radius: 1rem;
  padding: 0.25rem;
  position: absolute;
  outline: none;
  border: none;
  cursor: pointer;
  &:active {
    transform: scale(0.98);
  }
  & > svg {
    fill: ${({ theme }) => theme.darkGrey};
  }
`;

const ChildrenContainer = styled.div`
  margin: 16px;
`;

export default Modal;
