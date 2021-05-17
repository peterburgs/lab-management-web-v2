import React, { useState } from "react";
import styled from "styled-components";
import Button from "../components/common/Button";
import EditIcon from "@material-ui/icons/Edit";
import { IconButton, Collapse } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

const AcademicYear = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <StyledAcademicYear>
      <AcademicYearContainer>
        <AcademicYearCard>
          <MainContent>
            <InfoContainer>
              <Header>Academic year: 2020 - 2021</Header>
              <Text>Start date: {new Date().toDateString()}</Text>
              <Text>Number of weeks: 45</Text>
              <Text>Number of semesters: 2</Text>
            </InfoContainer>
            <ActionContainer>
              <ActionButton>Close academic year</ActionButton>
            </ActionContainer>
          </MainContent>
          <CollapseButtonContainer>
            <IconButton
              onClick={() => setIsExpanded((current) => !current)}
              style={{ background: "#e7f3ff" }}
              color="primary"
              component="span"
            >
              {isExpanded ? (
                <ExpandLessIcon fontSize="large" />
              ) : (
                <ExpandMoreIcon fontSize="large" />
              )}
            </IconButton>
          </CollapseButtonContainer>
        </AcademicYearCard>
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <SemesterCard>
            <InfoContainer>
              <Header>
                <span>Semester 1</span>
                <IconButton color="primary" component="span">
                  <EditIcon />
                </IconButton>
              </Header>
              <Text>Start date: {new Date().toDateString()}</Text>
              <Text>Number of weeks: 15</Text>
            </InfoContainer>
            <ActionContainer>
              <ActionButton>Close semester</ActionButton>
            </ActionContainer>
          </SemesterCard>
          <SemesterCard>
            <InfoContainer>
              <Header>
                <span>Semester 1</span>
                <IconButton color="primary" component="span">
                  <EditIcon />
                </IconButton>
              </Header>
              <Text>Start date: {new Date().toDateString()}</Text>
              <Text>Number of weeks: 15</Text>
            </InfoContainer>
            <ActionContainer>
              <ActionButton>Close semester</ActionButton>
            </ActionContainer>
          </SemesterCard>
        </Collapse>
      </AcademicYearContainer>
      <AcademicYearContainer>
        <AcademicYearCard>
          <MainContent>
            <InfoContainer>
              <Header>Academic year: 2020 - 2021</Header>
              <Text>Start date: {new Date().toDateString()}</Text>
              <Text>Number of weeks: 45</Text>
              <Text>Number of semesters: 2</Text>
            </InfoContainer>
            <ActionContainer>
              <ActionButton>Close academic year</ActionButton>
            </ActionContainer>
          </MainContent>
          <CollapseButtonContainer>
            <IconButton
              onClick={() => setIsExpanded((current) => !current)}
              style={{ background: "#e7f3ff" }}
              color="primary"
              component="span"
            >
              {isExpanded ? (
                <ExpandLessIcon fontSize="large" />
              ) : (
                <ExpandMoreIcon fontSize="large" />
              )}
            </IconButton>
          </CollapseButtonContainer>
        </AcademicYearCard>
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <SemesterCard>
            <InfoContainer>
              <Header>
                <span>Semester 1</span>
                <IconButton color="primary" component="span">
                  <EditIcon />
                </IconButton>
              </Header>
              <Text>Start date: {new Date().toDateString()}</Text>
              <Text>Number of weeks: 15</Text>
            </InfoContainer>
            <ActionContainer>
              <ActionButton>Close semester</ActionButton>
            </ActionContainer>
          </SemesterCard>
          <SemesterCard>
            <InfoContainer>
              <Header>
                <span>Semester 1</span>
                <IconButton color="primary" component="span">
                  <EditIcon />
                </IconButton>
              </Header>
              <Text>Start date: {new Date().toDateString()}</Text>
              <Text>Number of weeks: 15</Text>
            </InfoContainer>
            <ActionContainer>
              <ActionButton>Close semester</ActionButton>
            </ActionContainer>
          </SemesterCard>
        </Collapse>
      </AcademicYearContainer>
    </StyledAcademicYear>
  );
};

const StyledAcademicYear = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-top: 1rem;
`;

const AcademicYearContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.blue};
  padding: 0.5rem;
  border-radius: 10px;
  margin-bottom: 1rem;
`;

const AcademicYearCard = styled.div`
  border-radius: 7px;
  box-shadow: ${({ theme }) => theme.greyShadow};
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  justify-content: space-between;
  display: flex;
`;

const CollapseButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SemesterCard = styled.div`
  border-radius: 7px;
  display: flex;
  margin-bottom: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  justify-content: space-between;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2),
    0 2px 4px 0 rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Text = styled.div`
  font-weight: 16px;
  margin-bottom: 0.5rem;
`;

const Header = styled.div`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ActionButton = styled(Button)`
  background-color: ${({ theme }) => theme.lightRed};
  box-shadow: none;
  color: ${({ theme }) => theme.red};
  font-weight: 500;
  font-size: 15px;
  padding: 0 0.7rem;
  border: 1px solid ${({ theme }) => theme.red};
  &:active {
    background-color: ${({ theme }) => theme.lightRed};
    &:hover {
      background-color: ${({ theme }) => theme.lightRed};
    }
  }

  &:hover {
    background-color: ${({ theme }) => theme.lightRed};
  }
`;

export default AcademicYear;
