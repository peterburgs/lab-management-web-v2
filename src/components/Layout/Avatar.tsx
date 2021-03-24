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
      <StyledAvatar
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
      >
        TD
      </StyledAvatar>
    </Tooltip>
  );
};

// Styling
const StyledAvatar = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  color: white;
  background: #2486fc;
  border: none;
  justify-content: center;
  cursor: pointer;
`;

export default Avatar;
