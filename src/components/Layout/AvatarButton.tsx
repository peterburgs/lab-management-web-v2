import { Tooltip } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { useAppSelector } from "../../store";

interface AvatarProps {
  onFocus?: () => void;
  onBlur?: () => void;
  onClick?: () => void;
}

const Avatar = ({ onFocus, onBlur, onClick }: AvatarProps) => {
  const avatarUrl = useAppSelector((state) => state.auth.avatarUrl)!;

  return (
    <Tooltip title="User menu">
      <StyledAvatarButton
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
      >
        <img src={avatarUrl} alt="avatar" />
      </StyledAvatarButton>
    </Tooltip>
  );
};

// Styling
const StyledAvatarButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  border: none;
  justify-content: center;
  cursor: pointer;

  img {
    border-radius: 1rem;
    width: 32px;
    height: 32px;
  }
`;

export default Avatar;
