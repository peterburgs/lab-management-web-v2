import React from "react";
import styled from "styled-components";

const AvatarPanel = () => {
  return (
    <StyledAvatarPanel>
      <AvatarContainer>
        <img
          src="https://lh3.googleusercontent.com/ogw/ADGmqu8ZheC6aMQHlzfcT3QuhG0ufB5hBxyNcbg1bLR_=s83-c-mo"
          alt="avatar"
        />
      </AvatarContainer>
      <Username>Le Duc Thinh</Username>
      <Email>thinhle2199@gmail.com</Email>
      <LogoutButton>Logout</LogoutButton>
    </StyledAvatarPanel>
  );
};

const StyledAvatarPanel = styled.div`
  box-shadow: 0 4px 12px 0 rgb(0 0 0 / 10%);
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  opacity: 1;
  padding: 1.5rem;
  width: 150px;
  background: white;
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 300px;
`;

const LogoutButton = styled.button`
  border: 1px solid black;
  outline: none;
  color: black;
  text-decoration: none;
  border-radius: 4px;
  padding: 7px;
  display: flex;
  align-items: center;
  opacity: 0.85;
  background: transparent;
  font-size: 14px;
  cursor: pointer;
  justify-content: center;
  width: 130px;
  margin-top: 1rem;
  &:hover {
    background: #c0bdbd;
  }
  &:active {
    transform: scale(0.98);
  }
`;

const AvatarContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  color: white;
  background: #2486fc;
  border: none;
  justify-content: center;

  img {
    border-radius: 3rem;
  }
`;

const Username = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-top: 10px;
`;

const Email = styled.div`
  font-size: 14px;
  font-weight: 400;
  margin-top: 5px;
  color: #a4a1a1;
`;

export default AvatarPanel;
