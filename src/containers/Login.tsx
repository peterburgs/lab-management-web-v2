import React, { useState } from "react";
import styled from "styled-components";
import { ReactComponent as GoogleIcon } from "../assets/images/google.svg";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";
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
import { ROLES } from "../types/model";
import backgroundVideo from "../assets/video/Computer-Lab.mp4";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: 300,
    "& .MuiOutlinedInput-input": {
      color: "white",
    },
    "& .MuiInputLabel-root": {
      color: "white",
    },
    "& .MuiSvgIcon-root": {
      color: "white",
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
    "&:hover .MuiOutlinedInput-input": {
      color: "white",
    },
    "&:hover .MuiInputLabel-root": {
      color: "white",
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
      color: "white",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "white",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
  },
}));

const Login = () => {
  const classes = useStyles();
  const [role, setRole] = useState(ROLES.LECTURER);
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

      dispatch(setShowSuccessSnackBar(true));
      dispatch(setSnackBarContent("Welcome back!"));
      history.replace("/academic-years");
    } catch (err) {
      setLoading(false);
      dispatch(setShowErrorSnackBar(true));
      dispatch(setSnackBarContent(err.message));
    }
  };

  const onFailure = (error: any) => {
    console.log(error);
    setLoading(false);
    dispatch(setShowErrorSnackBar(true));
    dispatch(setSnackBarContent(error.message));
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
        <FormControl className={classes.root} variant="outlined">
          <InputLabel id="role-label">Select role</InputLabel>
          <Select
            labelId="role-label"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            label="Select role"
          >
            <MenuItem value={ROLES.ADMIN}>Admin</MenuItem>
            <MenuItem value={ROLES.LECTURER}>Lecturer</MenuItem>
          </Select>
        </FormControl>
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
    <StyledLogin>
      <Overlay />
      <StyledVideo autoPlay muted loop>
        <source src={backgroundVideo} type="video/mp4" />
      </StyledVideo>
      <HeaderContainer>
        <Header>Lab Management</Header>
      </HeaderContainer>
      <Action>
        {transition((style, item) => {
          const AnimatedComp = animatedComponents[item];
          return <AnimatedComp style={style} />;
        })}
        {!loading && (
          <NavigateButton onClick={handleNavigate}>
            {index === 1 ? "Back" : "Next"}
          </NavigateButton>
        )}
      </Action>
    </StyledLogin>
  );
};

const StyledLogin = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Overlay = styled.div`
  background: black;
  opacity: 0.7;
  position: absolute;
  z-index: 1;
  text-align: center;
  margin: 0%;
  min-width: 100%;
  min-height: 100%;
`;

const StyledVideo = styled.video`
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
`;

const HeaderContainer = styled.div`
  position: fixed;
  top: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: auto;
  z-index: 2;
`;

const Header = styled.h1`
  font-size: 60px;
  line-height: 1.1;
  font-weight: 800;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
    "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  text-align: center;
  color: white;
`;

const Action = styled.div`
  z-index: 2;
  position: fixed;
  top: 300px;
  width: 100%;
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

  &:active {
    background-color: rgba(9, 30, 66, 0.02);
    transform: scale(0.98);
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

export default Login;
