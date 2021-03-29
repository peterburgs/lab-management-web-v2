import React from "react";
import styled from "styled-components";

const RequestPage = () => {
  return (
    <StyledRequestPage>
      <Toolbar>
        <StatusContainer></StatusContainer>
        <Filter></Filter>
      </Toolbar>
    </StyledRequestPage>
  );
};

const StyledRequestPage = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Filter = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

const StatusContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;

export default RequestPage;
