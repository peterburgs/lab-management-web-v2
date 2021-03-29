import React, { ReactNode } from "react";
import styled from "styled-components";

interface ButtonProps {
  children: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
}

const Button = ({
  children,
  onClick,
  icon,
  className,
  type,
}: ButtonProps) => {
  return (
    <StyledButton onClick={onClick} className={className} type={type}>
      {icon ? <Icon>{icon}</Icon> : null}
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  background-color: #0070f3;
  box-shadow: 0 4px 14px 0 rgb(0 118 255 / 39%);
  margin: 0;
  padding: 0 2.5rem;
  min-height: 2.5rem;
  border-radius: 7px;
  color: white;
  align-items: center;
  justify-content: center;
  border: none;
  text-decoration: none;
  cursor: pointer;
  display: inline-flex;
  position: relative;
  outline: none;
  font-size: 14px;
  transition: background 0.2s ease 0s, color 0.2s ease 0s;

  &:active {
    background-color: #0070f3;
    transform: scale(0.98);
    &:hover {
      background-color: #0070f3;
    }
  }

  &:hover {
    background-color: #3e96e9;
  }

  &:focus {
    outline: 1px solid blue;
  }

  @media (max-width: 900px) {
    padding: 0 2rem;
  }
`;

const Icon = styled.span`
  color: white;
  display: flex;
  align-items: center;
  height: auto;
  margin-right: 15px;
  & > svg {
    fill: white;
    width: 20px;
    height: 20px;
  }
`;

export default Button;
