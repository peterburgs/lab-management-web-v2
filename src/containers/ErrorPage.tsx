import React from "react";
import styled from "styled-components";
import { ReactComponent as Error } from "../assets/images/error.svg";

const ErrorPage = () => {
  return (
    <StyledErrorPage>
      <ImageContainer>
        <Error />
      </ImageContainer>
      <Text>Something went wrong!</Text>
    </StyledErrorPage>
  );
};

const StyledErrorPage = styled.div`
  width: 95%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 2rem;
`;

const ImageContainer = styled.div`
  width: 50%;
`;

const Text = styled.h1`
  font-family: "Roboto";
`;

export default ErrorPage;
