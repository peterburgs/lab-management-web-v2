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
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { useAppDispatch, useAppSelector } from "../store";
import CloseSemesterModal from "../components/academic-year-page/CloseSemesterModal";
import EditSemesterModal from "../components/academic-year-page/EditSemesterModal";
import {
  AcademicYear,
  ROLES,
  SEMESTER_STATUSES,
} from "../types/model";
import AddIcon from "@material-ui/icons/Add";
import moment from "moment";
import { ReactComponent as NothingImage } from "../assets/images/nothing.svg";
import StartAcademicYearModal from "../components/academic-year-page/StartAcademicYearModal";
import StartSemesterModal from "../components/academic-year-page/StartSemesterModal";
import EditAcademicYearModal from "../components/academic-year-page/EditAcademicYearModal";
import { useHistory } from "react-router";
import PrivateRoute from "../containers/PrivateRoute";
import CloseAcademicYearModal from "../components/academic-year-page/CloseAcademicYearModal";
import _ from "lodash";
import "simplebar/dist/simplebar.min.css";
import SimpleBar from "simplebar-react";
import {
  setShowErrorSnackBar,
  setSnackBarContent,
} from "../reducers/notificationSlice";

const AcademicYearPage = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showStartAcademicYearModal, setShowStartAcademicYearModal] =
    useState(false);
  const [showStartSemesterModal, setShowStartSemesterModal] =
    useState(false);
  const [academicYearType, setAcademicYearType] = useState(0);
  const [currentExpanding, setCurrentExpanding] =
    useState<string>("");

  const history = useHistory();
  const dispatch = useAppDispatch();

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

  const academicYearSearchText = useAppSelector(
    (state) => state.search.academicYearSearchText
  );

  const renderSemesterModal = () => {
    if (semesterStatus === "succeeded") {
      return (
        <>
          <PrivateRoute
            roles={[ROLES.ADMIN]}
            path="/academic-years/semesters/:id/close"
            exact={true}
            component={
              <CloseSemesterModal
                name={"Do you want you close this semester"}
                showModal={true}
                setShowModal={() => history.goBack()}
              />
            }
          />
          <PrivateRoute
            roles={[ROLES.ADMIN]}
            path="/academic-years/semesters/:id"
            exact={true}
            component={
              <EditSemesterModal
                name={"Edit Semester"}
                showModal={true}
                setShowModal={() => history.goBack()}
              />
            }
          />
          <PrivateRoute
            roles={[ROLES.ADMIN]}
            path="/academic-years/semesters/:id/start"
            exact={true}
            component={
              <StartSemesterModal
                name="Are you sure to start this semester?"
                showModal={true}
                setShowModal={() => history.goBack()}
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
        let condition = true;
        if (academicYearType === 0) condition = condition && true;
        if (academicYearType === 1)
          condition = condition && academicYear.isOpening === true;
        if (academicYearType === 2)
          condition = condition && academicYear.isOpening === false;
        if (academicYearSearchText) {
          condition =
            condition &&
            academicYear.name
              .toLowerCase()
              .includes(academicYearSearchText);
        }
        return condition;
      })
    );
  }, [academicYearType, academicYears, academicYearSearchText]);

  useEffect(() => {
    if (academicYears.length > 0) {
      const clonedAcademicYears = _.cloneDeep(academicYears);
      setFilteredAcademicYears(
        clonedAcademicYears.sort((a, b) =>
          moment(b.startDate).diff(moment(a.startDate))
        )
      );
    }
  }, [academicYears]);

  const handleExpanding = (id: string) => {
    if (currentExpanding === id) {
      setIsExpanded((current) => !current);
    } else {
      setCurrentExpanding(id);
      setIsExpanded(true);
    }
  };

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
            <AcademicYearContainer
              key={academicYear._id}
              isOpening={academicYear.isOpening}
            >
              <AcademicYearCard>
                <MainContent>
                  <InfoContainer>
                    <Header>
                      <span>{academicYear.name}</span>
                      {academicYear.isOpening && (
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
                      )}

                      {academicYear.isOpening ? (
                        <OpenBadge>OPENING</OpenBadge>
                      ) : (
                        <ClosedBadge>CLOSED</ClosedBadge>
                      )}
                    </Header>

                    <Text>
                      Start date:{" "}
                      {moment(academicYear.startDate).format(
                        "MM-DD-YYYY h:mm:ss a"
                      )}
                    </Text>
                    {academicYear.isOpening === false && (
                      <Text>
                        End date:{" "}
                        {moment(academicYear.endDate).format(
                          "MM-DD-YYYY h:mm:ss a"
                        )}
                      </Text>
                    )}
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
                    {/* {academicYear.isOpening && (
                      <StyledButton
                        onClick={() => {
                          if (
                            semesters.filter(
                              (semester) =>
                                semester.academicYear ===
                                  academicYear._id &&
                                semester.isOpening === true
                            ).length > 0
                          ) {
                            dispatch(setShowErrorSnackBar(true));
                            dispatch(
                              setSnackBarContent(
                                "All semesters must be closed before opening new one "
                              )
                            );
                          } else {
                            setShowStartSemesterModal(true);
                          }
                        }}
                        icon={<AddIcon />}
                      >
                        <span>Start new semester</span>
                      </StyledButton>
                    )} */}
                  </InfoContainer>
                  <ActionContainer>
                    {academicYear.isOpening && (
                      <AcademicYearCloseButton
                        onClick={() =>
                          history.push(
                            `/academic-years/${academicYear._id}/close`
                          )
                        }
                      >
                        Close academic year
                      </AcademicYearCloseButton>
                    )}
                  </ActionContainer>
                </MainContent>
                <CollapseButtonContainer>
                  <IconButton
                    onClick={() => handleExpanding(academicYear._id)}
                    style={{ background: "#e7f3ff" }}
                    color="primary"
                    component="span"
                  >
                    {currentExpanding === academicYear._id ? (
                      isExpanded ? (
                        <ExpandLessIcon fontSize="large" />
                      ) : (
                        <ExpandMoreIcon fontSize="large" />
                      )
                    ) : (
                      <ExpandMoreIcon fontSize="large" />
                    )}
                  </IconButton>
                </CollapseButtonContainer>
              </AcademicYearCard>
              <Collapse
                in={
                  currentExpanding === academicYear._id
                    ? isExpanded
                    : false
                }
                timeout="auto"
                unmountOnExit
              >
                {semesters.filter(
                  (item) => item.academicYear === academicYear._id
                ).length > 0 ? (
                  semesters
                    .filter(
                      (item) => item.academicYear === academicYear._id
                    )
                    .map((item) => (
                      <SemesterCard key={item._id}>
                        <InfoContainer>
                          <Header>
                            <span>{item.semesterName}</span>
                            {academicYear.isOpening && (
                              <IconButton
                                onClick={() =>
                                  history.push(
                                    `/academic-years/semesters/${item._id}`
                                  )
                                }
                                color="primary"
                                component="span"
                              >
                                <EditIcon />
                              </IconButton>
                            )}

                            {item.status ===
                            SEMESTER_STATUSES.OPENING ? (
                              <OpenBadge>OPENING</OpenBadge>
                            ) : item.status ===
                              SEMESTER_STATUSES.FUTURE ? (
                              <FutureBadge>FUTURE</FutureBadge>
                            ) : (
                              <ClosedBadge>CLOSED</ClosedBadge>
                            )}
                          </Header>

                          <Text>
                            Start date:{" "}
                            {item.startDate
                              ? moment(item.startDate).format(
                                  "MM-DD-YYYY h:mm:ss a"
                                )
                              : "Not started yet"}
                          </Text>
                          <Text>
                            Number of weeks: {item.numberOfWeeks}
                          </Text>
                        </InfoContainer>
                        {item.status === SEMESTER_STATUSES.OPENING &&
                        academicYear.isOpening ? (
                          <ActionContainer>
                            <SemesterActionButton
                              semesterStatus={item.status}
                              onClick={() =>
                                history.push(
                                  `/academic-years/semesters/${item._id}/close`
                                )
                              }
                            >
                              Close semester
                            </SemesterActionButton>
                          </ActionContainer>
                        ) : item.status ===
                            SEMESTER_STATUSES.FUTURE &&
                          academicYear.isOpening ? (
                          <ActionContainer>
                            <SemesterActionButton
                              semesterStatus={item.status}
                              onClick={() =>
                                history.push(
                                  `/academic-years/semesters/${item._id}/start`
                                )
                              }
                            >
                              Start semester
                            </SemesterActionButton>
                          </ActionContainer>
                        ) : null}
                      </SemesterCard>
                    ))
                ) : (
                  <Text
                    style={{ textAlign: "center", marginTop: "1rem" }}
                  >
                    No data found
                  </Text>
                )}
              </Collapse>
            </AcademicYearContainer>
          ))}
        </>
      );
    } else {
      return (
        <NotFoundContainer>
          <NothingImage />
          <span>No data found</span>
        </NotFoundContainer>
      );
    }
  };

  return (
    <>
      <PrivateRoute
        roles={[ROLES.ADMIN]}
        path="/academic-years/:id"
        exact={true}
        component={
          <EditAcademicYearModal
            showModal={true}
            setShowModal={() => history.goBack()}
            name="Edit academic year"
          />
        }
      />
      <PrivateRoute
        roles={[ROLES.ADMIN]}
        path="/academic-years/:id/close"
        exact={true}
        component={
          <CloseAcademicYearModal
            showModal={true}
            setShowModal={() => history.goBack()}
            name="Do you want to close this academic year?"
          />
        }
      />
      <StartAcademicYearModal
        setShowModal={setShowStartAcademicYearModal}
        showModal={showStartAcademicYearModal}
        name="Start academic year"
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
            onClick={() => {
              if (
                (academicYears as AcademicYear[]).filter(
                  (item) => item.isOpening === true
                ).length > 0
              ) {
                console.log("hello");
                dispatch(
                  setSnackBarContent(
                    "An academic year is opening. Cannot start new one."
                  )
                );
                dispatch(setShowErrorSnackBar(true));
              } else {
                setShowStartAcademicYearModal(true);
              }
            }}
          >
            <span>Start new academic year</span>
          </Button>
        </Toolbar>
        <SimpleBar
          style={{
            maxHeight: "calc(100% - 110px)",
            maxWidth: "100%",
          }}
        >
          {conditionalRenderer()}
        </SimpleBar>
      </StyledAcademicYear>
    </>
  );
};

const StyledAcademicYear = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
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
    ${({ theme, isOpening }) => (isOpening ? theme.green : theme.red)};
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
  border-radius: 10px;
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

const AcademicYearCloseButton = styled(Button)`
  background-color: ${({ theme }) => theme.lightRed};
  box-shadow: none;
  color: ${({ theme }) => theme.red};
  font-weight: 500;
  font-size: 15px;
  padding: 0 0.7rem;
  border: 1px solid ${({ theme }) => theme.red};
  &:active {
    background-color: ${({ theme }) => theme.red};
    &:hover {
      background-color: ${({ theme }) => theme.red};
      color: white;
    }
  }

  &:hover {
    background-color: ${({ theme }) => theme.red};
    color: white;
  }
`;

const SkeletonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  grid-row-gap: 1rem;
`;

interface SemesterActionButtonProps {
  semesterStatus: SEMESTER_STATUSES;
}

const SemesterActionButton = styled(
  Button
)<SemesterActionButtonProps>`
  background-color: ${({ theme, semesterStatus }) =>
    semesterStatus === SEMESTER_STATUSES.OPENING
      ? theme.lightRed
      : theme.lightGreen};
  box-shadow: none;
  color: ${({ theme, semesterStatus }) =>
    semesterStatus === SEMESTER_STATUSES.OPENING
      ? theme.red
      : theme.green};
  font-weight: 500;
  font-size: 15px;
  padding: 0 0.7rem;
  border: 1px solid
    ${({ theme, semesterStatus }) =>
      semesterStatus === SEMESTER_STATUSES.OPENING
        ? theme.red
        : theme.green};
  &:active {
    background-color: ${({ theme, semesterStatus }) =>
      semesterStatus === SEMESTER_STATUSES.OPENING
        ? theme.red
        : theme.green};
    &:hover {
      background-color: ${({ theme, semesterStatus }) =>
        semesterStatus === SEMESTER_STATUSES.OPENING
          ? theme.red
          : theme.green};
      color: white;
    }
  }

  &:hover {
    background-color: ${({ theme, semesterStatus }) =>
      semesterStatus === SEMESTER_STATUSES.OPENING
        ? theme.red
        : theme.green};
    color: white;
  }
`;

const ClosedBadge = styled.div`
  background-color: ${({ theme }) => theme.lightRed};
  color: ${({ theme }) => theme.red};
  font-size: 12px;
  padding: 0.3rem;
  font-weight: 600;
  border-radius: 10px;
  margin-left: 1rem;
`;

const OpenBadge = styled.div`
  background-color: ${({ theme }) => theme.lightGreen};
  color: ${({ theme }) => theme.darkGreen};
  font-size: 12px;
  padding: 0.3rem;
  font-weight: 600;
  border-radius: 10px;
  margin-left: 1rem;
`;

const FutureBadge = styled.div`
  background-color: #eae6ff;
  color: #403294;
  font-size: 12px;
  padding: 0.3rem;
  font-weight: 600;
  border-radius: 10px;
  margin-left: 1rem;
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
