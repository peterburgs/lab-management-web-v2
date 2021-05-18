import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "../components/common/Button";
import EditIcon from "@material-ui/icons/Edit";
import {
  IconButton,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  Skeleton,
  MenuItem,
  Tooltip,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { useAppSelector } from "../store";
import CloseSemesterModal from "../components/academic-year-page/CloseSemesterModal";
import EditSemesterModal from "../components/academic-year-page/EditSemesterModal";
import SemesterModal from "../components/academic-year-page/SemesterModal";
import { AcademicYear, ROLES } from "../types/model";
import AddIcon from "@material-ui/icons/Add";
import moment from "moment";
import { ReactComponent as NothingImage } from "../assets/images/nothing.svg";
import StartAcademicYearModal from "../components/academic-year-page/StartAcademicYear";
import StartSemesterModal from "../components/academic-year-page/StartSemesterModal";
import EditAcademicYearModal from "../components/academic-year-page/EditAcademicYearModal";
import { useHistory } from "react-router";
import PrivateRoute from "../containers/PrivateRoute";

const AcademicYearPage = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEditSemesterModal, setShowEditSemesterModal] =
    useState(false);
  const [showCloseSemesterModal, setShowCloseSemesterModal] =
    useState(false);
  const [showStartAcademicYearModal, setShowStartAcademicYearModal] =
    useState(false);
  const [showStartSemesterModal, setShowStartSemesterModal] =
    useState(false);
  const [academicYearType, setAcademicYearType] = useState(0);

  const history = useHistory();

  const [filteredAcademicYears, setFilteredAcademicYears] = useState<
    AcademicYear[]
  >([]);

  const semesters = useAppSelector(
    (state) => state.semesters.semesters
  );
  const semesterStatus = useAppSelector(
    (state) => state.semesters.status
  );

  const academicYears = useAppSelector(
    (state) => state.academicYears.academicYears
  );
  const academicYearStatus = useAppSelector(
    (state) => state.academicYears.status
  );

  const renderSemesterModal = () => {
    if (semesterStatus === "succeeded") {
      return (
        <>
          <CloseSemesterModal
            name={"Do you want you close this semester"}
            showModal={showCloseSemesterModal}
            setShowModal={setShowCloseSemesterModal}
            setShowSemesterModal={() => history.goBack()}
          />
          <EditSemesterModal
            name={"Edit Semester"}
            showModal={showEditSemesterModal}
            setShowModal={setShowEditSemesterModal}
          />
          <PrivateRoute
            roles={[ROLES.ADMIN]}
            path="/academic-years/semesters/:id"
            exact={false}
            component={
              <SemesterModal
                name="Semester"
                showModal={true}
                setShowModal={() => history.goBack()}
                setShowEditSemesterModal={setShowEditSemesterModal}
                setShowCloseSemesterModal={setShowCloseSemesterModal}
              />
            }
          />
        </>
      );
    }
    return null;
  };

  // useEffect
  useEffect(() => {
    setFilteredAcademicYears(
      (academicYears as AcademicYear[]).filter((academicYear) => {
        if (academicYearType === 0) return true;
        if (academicYearType === 1)
          return academicYear.isOpening === true;
        if (academicYearType === 2)
          return academicYear.isOpening === false;
      })
    );
  }, [academicYearType, academicYears]);

  const conditionalRenderer = () => {
    if (academicYearStatus === "pending") {
      return (
        <SkeletonContainer>
          <Skeleton
            variant="rectangular"
            height={250}
            animation="wave"
          />
          <Skeleton
            variant="rectangular"
            height={250}
            animation="wave"
          />
        </SkeletonContainer>
      );
    } else if (filteredAcademicYears.length > 0) {
      return (
        <>
          {filteredAcademicYears.map((academicYear) => (
            <AcademicYearContainer isOpening={academicYear.isOpening}>
              <AcademicYearCard>
                <MainContent>
                  <InfoContainer>
                    <Header>
                      <span>{academicYear.name}</span>
                      <IconButton
                        onClick={() =>
                          history.push(
                            `/academic-years/${academicYear._id}`
                          )
                        }
                        color="primary"
                        component="span"
                      >
                        <EditIcon />
                      </IconButton>
                    </Header>

                    <Text>
                      Start date:{" "}
                      {moment(academicYear.startDate).format(
                        "MM-DD-YYYY h:mm:ss a"
                      )}
                    </Text>
                    <Text>
                      Number of weeks: {academicYear.numberOfWeeks}
                    </Text>
                    <Text>
                      Number of semesters:{" "}
                      {semesters
                        ? semesters.filter(
                            (semester) =>
                              semester.academicYear ===
                              academicYear._id
                          ).length
                        : 0}
                    </Text>
                    {academicYear.isOpening && (
                      <StyledButton
                        disabled={
                          semesters.filter(
                            (semester) =>
                              semester.academicYear ===
                                academicYear._id &&
                              semester.isOpening === true
                          ).length > 0
                        }
                        onClick={() =>
                          setShowStartSemesterModal(true)
                        }
                        icon={<AddIcon />}
                      >
                        <Tooltip
                          title={
                            semesters.filter(
                              (semester) =>
                                semester.academicYear ===
                                  academicYear._id &&
                                semester.isOpening === true
                            ).length > 0
                              ? "There is an opening semester. Close all to create new one."
                              : "Create new semester"
                          }
                        >
                          <span>Start new semester</span>
                        </Tooltip>
                      </StyledButton>
                    )}
                  </InfoContainer>
                  <ActionContainer>
                    {academicYear.isOpening ? (
                      <ActionButton>Close academic year</ActionButton>
                    ) : (
                      <ClosedBadge>CLOSED</ClosedBadge>
                    )}
                  </ActionContainer>
                </MainContent>
                <CollapseButtonContainer>
                  <IconButton
                    onClick={() =>
                      setIsExpanded((current) => !current)
                    }
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
                    <Text>
                      Start date: {new Date().toDateString()}
                    </Text>
                    <Text>Number of weeks: 15</Text>
                  </InfoContainer>
                  <ActionContainer>
                    <ActionButton>Close semester</ActionButton>
                  </ActionContainer>
                </SemesterCard>
              </Collapse>
            </AcademicYearContainer>
          ))}
        </>
      );
    } else {
      return (
        <NotFoundContainer>
          <NothingImage />
          <span>There is no academic year</span>
        </NotFoundContainer>
      );
    }
  };

  return (
    <>
      <PrivateRoute
        roles={[ROLES.ADMIN]}
        path="/academic-years/:id"
        exact={false}
        component={
          <EditAcademicYearModal
            showModal={true}
            setShowModal={() => history.goBack()}
            name="Edit academic year"
          />
        }
      />
      <StartAcademicYearModal
        setShowModal={setShowStartAcademicYearModal}
        showModal={showStartAcademicYearModal}
        name="Start academic year"
      />
      <StartSemesterModal
        name="Start semester"
        showModal={showStartSemesterModal}
        setShowModal={setShowStartSemesterModal}
      />
      {renderSemesterModal()}
      <StyledAcademicYear>
        <Toolbar>
          <FormControl style={{ minWidth: "100px" }}>
            <InputLabel id="view-label">View</InputLabel>
            <Select
              labelId="view-label"
              value={academicYearType}
              onChange={(e) => setAcademicYearType(e.target.value)}
              label="View"
            >
              <MenuItem value={0}>All</MenuItem>
              <MenuItem value={1}>Opening</MenuItem>
              <MenuItem value={2}>Closed</MenuItem>
            </Select>
          </FormControl>

          <Button
            icon={<AddIcon />}
            disabled={
              (academicYears as AcademicYear[]).filter(
                (item) => item.isOpening === true
              ).length > 0
            }
            onClick={() => setShowStartAcademicYearModal(true)}
          >
            <Tooltip
              title={
                (academicYears as AcademicYear[]).filter(
                  (item) => item.isOpening === true
                ).length > 0
                  ? "There is an opening academic year. Close all to create a new one."
                  : "Create new academic year"
              }
            >
              <span>Start new academic year</span>
            </Tooltip>
          </Button>
        </Toolbar>
        {conditionalRenderer()}
      </StyledAcademicYear>
    </>
  );
};

const StyledAcademicYear = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-top: 1rem;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 1rem;
`;

interface AcademicYearContainerProps {
  isOpening: boolean;
}

const AcademicYearContainer = styled.div<AcademicYearContainerProps>`
  border: 2px solid
    ${({ theme, isOpening }) => (isOpening ? theme.green : "black")};
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

const SkeletonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  grid-row-gap: 1rem;
`;

const ClosedBadge = styled.div`
  background-color: #eae6ff;
  color: #403294;
  font-size: 12px;
  padding: 0.3rem;
  font-weight: 600;
`;

const NotFoundContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  height: 100%;
  flex-direction: column;
  svg {
    max-width: 550px;
    height: auto;
  }

  span {
    font-weight: 500;
    font-size: 25px;
    margin-top: 1rem;
  }

  button {
    margin-top: 1rem;
  }

  @media (max-width: 600px) {
    svg {
      max-width: 300px;
      height: auto;
    }
  }
`;

const StyledButton = styled(Button)`
  width: 170px;
  padding: 0;
`;

export default AcademicYearPage;
