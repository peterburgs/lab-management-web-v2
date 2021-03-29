import React, { ReactNode } from "react";
import ReactModal, {Styles} from "react-modal";
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
    <StyledModal isOpen={showModal} style={style}>
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
  width: 100%;
  margin: auto;
  top: 70px;
  border: none;
  background: #fff;
  --webkit-overflow-scrolling: touch;
  border-radius: 8px;
  box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.2),
    0 2px 4px 0 rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  overflow-x: hidden;
  overflow-y: auto;
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
  background: #dddada;
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
    fill: #6b6a6a;
  }
`;

const ChildrenContainer = styled.div`
  margin: 16px;
`;

export default Modal;
