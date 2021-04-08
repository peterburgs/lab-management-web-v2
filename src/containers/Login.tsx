import React, { useState } from "react";
import styled from "styled-components";
import { ReactComponent as GoogleIcon } from "../assets/images/google.svg";
import LeftBackground from "../assets/images/login-background-left.svg";
import RightBackground from "../assets/images/login-background-right.svg";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { styled as materialStyled } from "@material-ui/styles";
import { useTransition, animated } from "@react-spring/web";
import { SpringValue } from "@react-spring/core";
import {
  useGoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { ClipLoader } from "react-spinners";
import { verify } from "../reducers/authSlice";
import { useAppDispatch } from "../store";
import { unwrapResult } from "@reduxjs/toolkit";
import { useHistory } from "react-router";
import {
  setShowErrorSnackBar,
  setShowSuccessSnackBar,
  setSnackBarContent,
} from "../reducers/notificationSlice";

const Login = () => {
  const [role, setRole] = useState("LECTURER");
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const history = useHistory();

  const handleNavigate = () => {
    setIndex((currentIndex) =>
      currentIndex === 1 ? (currentIndex -= 1) : (currentIndex += 1)
    );
  };

  const onSuccess = async (
    res: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    try {
      const expirationDate = new Date(
        new Date().getTime() +
          (res as GoogleLoginResponse).tokenObj.expires_in * 1000
      );
      const verifyResult = await dispatch(
        verify({
          token: (res as GoogleLoginResponse).tokenObj.id_token,
          role,
          expirationDate: expirationDate.getTime().toString(),
        })
      );
      unwrapResult(verifyResult);
      setLoading(false);
      dispatch(setShowSuccessSnackBar(true));
      dispatch(setSnackBarContent("Welcome back!"));
      history.replace("/");
    } catch (err) {
      setLoading(false);
      dispatch(setShowErrorSnackBar(true));
      dispatch(setSnackBarContent("Permission denied"));
    }
  };

  const onFailure = (error: any) => {
    console.log(error);
    setLoading(false);
    dispatch(setShowErrorSnackBar(true));
    dispatch(setSnackBarContent("Please try again"));
  };

  const onRequest = () => {
    setLoading(true);
  };

  const { signIn } = useGoogleLogin({
    clientId: process.env.REACT_APP_CLIENT_ID!,
    onSuccess,
    onFailure,
    onRequest,
    cookiePolicy: "single_host_origin",
  });

  const transition = useTransition(index, {
    from: { opacity: 0, transform: "translate3d(100%,0,0)" },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
    leave: { opacity: 0, transform: "translate3d(-50%,0,0)" },
  });

  const animatedComponents: Array<
    (props: {
      style: {
        opacity: SpringValue<number>;
        transform: SpringValue<string>;
      };
    }) => JSX.Element
  > = [
    ({ style }) => (
      <animated.div style={{ ...style }}>
        <StyledFormControl variant="outlined">
          <InputLabel id="role-label">Select role</InputLabel>
          <Select
            labelId="role-label"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            label="Select role"
          >
            <MenuItem value={"ADMIN"}>Admin</MenuItem>
            <MenuItem value={"LECTURER"}>Lecturer</MenuItem>
          </Select>
        </StyledFormControl>
      </animated.div>
    ),
    ({ style }) => (
      <animated.div style={{ ...style }}>
        <LoginButton onClick={signIn} disabled={loading}>
          {loading ? (
            <ClipLoader color="black" loading={loading} size={20} />
          ) : (
            <>
              <Icon>
                <GoogleIcon />
              </Icon>
              Login with Google
            </>
          )}
        </LoginButton>
      </animated.div>
    ),
  ];

  return (
    <StyledLogin
      leftBackground={LeftBackground}
      rightBackground={RightBackground}
    >
      <HeaderContainer>
        <Header>Laboratory usages management</Header>
      </HeaderContainer>
      <Action>
        {transition((style, item) => {
          const AnimatedComp = animatedComponents[item];
          return <AnimatedComp style={style} />;
        })}
        <NavigateButton onClick={handleNavigate}>
          {index === 1 ? "Back" : "Next"}
        </NavigateButton>
      </Action>
    </StyledLogin>
  );
};

interface StyledLogonProps {
  leftBackground: string;
  rightBackground: string;
}

const StyledLogin = styled.div<StyledLogonProps>`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-color: rgb(250, 251, 252);
  background-image: ${({ leftBackground, rightBackground }) =>
    `url(${leftBackground}), url(${rightBackground})`};

  background-repeat: no-repeat, no-repeat;
  background-attachment: fixed, fixed;
  background-size: 450px, 450px;
  background-position: left bottom, right bottom;

  @media (max-width: 1000px) {
    background-size: 300px, 300px;
  }
  @media (max-width: 600px) {
    background-size: 200px, 200px;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  margin: 1rem auto;
  margin-top: 6rem;
`;

const Header = styled.h1`
  font-size: 60px;
  line-height: 1.1;
  font-weight: 800;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans",
    "Droid Sans", "Helvetica Neue", sans-serif;
  text-align: center;
  color: black;
`;

const Action = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  & > div {
    will-change: transform, opacity;
    position: absolute;
  }
`;

const NavigateButton = styled.button`
  background-color: white;
  box-shadow: rgb(0 0 0 / 20%) 1px 1px 5px 0px;
  min-height: 53px;
  border-radius: 4px;
  color: rgb(66, 82, 110);
  font-weight: 700;
  align-items: center;
  justify-content: center;
  border: none;
  text-decoration: none;
  cursor: pointer;
  display: inline-flex;
  position: relative;
  outline: none;
  font-size: 16px;
  transition: background 0.2s ease 0s, color 0.2s ease 0s;
  margin-top: 76px;
  min-width: 150px;

  &:hover {
    background-color: rgba(9, 30, 66, 0.02);
  }

  &:active {
    background-color: rgba(9, 30, 66, 0.02);
    transform: scale(0.98);
    &:hover {
      background-color: rgba(9, 30, 66, 0.02);
    }
  }
`;

const LoginButton = styled(NavigateButton)`
  margin-top: 0;
  min-width: 300px;
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

const StyledFormControl = materialStyled(FormControl)({
  marginBottom: "1rem",
  width: "300px",
});

export default Login;
