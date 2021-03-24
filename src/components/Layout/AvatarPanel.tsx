import React from "react";
import styled from "styled-components";

const AvatarPanel = () => {
  return (
    <StyledAvatarPanel>
      <Action>Logout</Action>
    </StyledAvatarPanel>
  );
};

const StyledAvatarPanel = styled.div`
  box-shadow: 0 4px 12px 0 rgb(0 0 0 / 10%);
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  opacity: 1;
  padding: 1rem;
  width: 150px;
  background: white;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
`;

const Action = styled.button`
  border: none;
  outline: none;
  color: black;
  text-decoration: none;
  border-radius: 0.5rem;
  padding: 7px;
  display: flex;
  align-items: center;
  opacity: 0.85;
  background: transparent;
  font-size: 14px;
  cursor: pointer;
  justify-content: center;
  &:hover {
    background: #c0bdbd;
  }
  &:active {
    transform: scale(0.98);
  }
`;

export default AvatarPanel;
