import React from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../store";
import { refreshState } from "../../reducers/authSlice";
import {
  setShowErrorSnackBar,
  setShowSuccessSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
import { useGoogleLogout } from "react-google-login";

const AvatarPanel = () => {
  const avatarUrl = useAppSelector((state) => state.auth.avatarUrl)!;
  const verifiedUser = useAppSelector(
    (state) => state.auth.verifiedUser
  )!;

  const dispatch = useAppDispatch();

  const onLogoutSuccess = () => {
    dispatch(refreshState());
    dispatch(setShowSuccessSnackBar(true));
    dispatch(setSnackBarContent("You are logged out"));
  };

  const onFailure = () => {
    dispatch(setShowErrorSnackBar(true));
    dispatch(setSnackBarContent("Something went wrong"));
  };

  const { signOut } = useGoogleLogout({
    clientId: process.env.REACT_APP_CLIENT_ID!,
    onLogoutSuccess,
    onFailure,
  });

  return (
    <StyledAvatarPanel>
      <AvatarContainer>
        <img src={avatarUrl} alt="avatar" />
      </AvatarContainer>
      <Username>{verifiedUser.fullName}</Username>
      <Email>{verifiedUser.email}</Email>
      <LogoutButton onClick={signOut}>Logout</LogoutButton>
    </StyledAvatarPanel>
  );
};

// Styling
const StyledAvatarPanel = styled.div`
  box-shadow: ${({ theme }) => theme.greyShadow};
  border-radius: 8px;
  border: ${({ theme }) => `1px solid ${theme.lightGrey}`};
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
    background: ${({ theme }) => theme.grey};
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
  border: none;
  justify-content: center;

  img {
    border-radius: 3rem;
    width: 80px;
    height: 80px;
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
  color: ${({ theme }) => theme.grey};
`;

export default AvatarPanel;
