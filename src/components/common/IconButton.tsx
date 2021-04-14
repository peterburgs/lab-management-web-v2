import React, { ReactNode } from "react";
import styled from "styled-components";

interface ButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon: ReactNode;
}

const Button = ({ onClick, icon }: ButtonProps) => {
  return (
    <StyledButton onClick={onClick}>
      <Icon>{icon}</Icon>
    </StyledButton>
  );
};

const StyledButton = styled.button`
  background-color: ${({ theme }) => theme.blue};
  box-shadow: ${({ theme }) => theme.blueShadow};
  margin: 0;
  width: 40px;
  min-height: 2.5rem;
  max-height: 40px;
  border-radius: 7px;
  color: white;
  align-items: center;
  justify-content: center;
  border: none;
  text-decoration: none;
  cursor: pointer;
  display: flex;
  position: relative;
  outline: none;
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
`;

const Icon = styled.span`
  color: white;
  display: flex;
  align-items: center;
  height: auto;
  & > svg {
    fill: white;
    width: 20px;
    height: 20px;
  }
`;

export default Button;
