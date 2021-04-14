import React, { ReactNode } from "react";
import styled from "styled-components";
import { ClipLoader } from "react-spinners";

interface ButtonProps {
  children: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  loading?: boolean;
}

const Button = ({
  children,
  onClick,
  icon,
  className,
  type,
  disabled,
  loading,
}: ButtonProps) => {
  return (
    <StyledButton
      onClick={onClick}
      className={className}
      type={type}
      disabled={disabled}
    >
      {loading ? (
        <ClipLoader color="#fff" loading={loading} size={20} />
      ) : (
        <>
          {icon ? <Icon>{icon}</Icon> : null}
          {children}
        </>
      )}
    </StyledButton>
  );
};

interface StyledButtonProps {
  disabled?: boolean;
}

const StyledButton = styled.button<StyledButtonProps>`
  background-color: ${({ disabled, theme }) =>
    disabled ? theme.grey : theme.blue};
  box-shadow: ${({ disabled, theme }) =>
    !disabled && theme.blueShadow};
  margin: 0;
  padding: 0 2.5rem;
  min-height: 2.5rem;
  max-height: 40px;
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
    background-color: ${({ theme }) => theme.blue};
    transform: scale(0.98);
    &:hover {
      background-color: ${({ theme }) => theme.blue};
    }
  }

  &:hover {
    background-color: ${({ theme }) => theme.lightBlue};
  }

  /* &:focus {
    outline: 1px solid blue;
  } */

  @media (max-width: 900px) {
    padding: 0 2rem;
  }
`;

const Icon = styled.span`
  color: white;
  display: flex;
  align-items: center;
  height: auto;
  margin-right: 7px;
  & > svg {
    fill: white;
    width: 20px;
    height: 20px;
  }
`;

export default Button;
