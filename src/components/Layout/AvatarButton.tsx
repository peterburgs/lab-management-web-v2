import { Tooltip } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

interface AvatarProps {
  onFocus?: () => void;
  onBlur?: () => void;
  onClick?: () => void;
}

const Avatar = ({ onFocus, onBlur, onClick }: AvatarProps) => {
  return (
    <Tooltip title="User menu">
      <StyledAvatarButton
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
      >
        <img
          src="https://lh3.googleusercontent.com/ogw/ADGmqu8ZheC6aMQHlzfcT3QuhG0ufB5hBxyNcbg1bLR_=s32-c-mo"
          alt="avatar"
        />
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
  }
`;

export default Avatar;
