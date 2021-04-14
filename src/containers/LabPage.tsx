import React, { useState } from "react";
import styled from "styled-components";
import { Column } from "react-table";
import Table from "../components/common/Table";
import Button from "../components/common/Button";
import IconButton from "../components/common/IconButton";
import { Skeleton, Tooltip } from "@material-ui/core";
import NewLabModal from "../components/lab-page/NewLabModal";
import EditLabModal from "../components/lab-page/EditLabModal";
import DeleteLabModal from "../components/lab-page/DeleteLabModal";
import PrivateRoute from "./PrivateRoute";
import AddIcon from "@material-ui/icons/Add";
import RefreshIcon from "@material-ui/icons/Refresh";

// import models
import { Lab } from "../react-app-env";

// import reducers

// import hooks
import useGetAllLabs from "../hooks/lab/useGetAllLabs";
import { useAppSelector, useAppDispatch } from "../store";
import { useHistory } from "react-router";
import { resetState as resetLabState } from "../reducers/labSlice";

type LabTable = {
  rowId: string;
  name: string;
  capacity: number;
  createdAt: string;
};

const prepareData = (
  labs: Lab[]
): {
  data: LabTable[];
} => {
  let data: LabTable[];

  if (labs.length > 0) {
    data = labs.map((lab) => {
      return {
        rowId: lab._id,
        name: lab.labName,
        capacity: lab.capacity,
        createdAt: new Date(lab.createdAt).toDateString(),
      };
    });
  } else {
    data = [];
  }

  return { data };
};

const LabPage = () => {
  // State
  const [showNewLabModal, setShowNewLabModal] = useState(false);
  const [showDeleteLabModal, setShowDeleteLabModal] = useState(false);
  const [labIdToDelete, setLabIdToDelete] = useState<string>(null!);

  // * Call API
  const [labs, labStatus] = useGetAllLabs();

  // call hooks
  const labSearchText = useAppSelector(
    (state) => state.search.labSearchText
  );
  const history = useHistory();
  const dispatch = useAppDispatch();

  // event handling

  const handleRefreshData = () => {
    dispatch(resetLabState());
  };

  const renderTable = () => {
    const columns: Array<Column<LabTable>> = [
      {
        Header: "Row ID",
        accessor: "rowId" as const,
      },
      {
        Header: "Lab Name",
        accessor: "name" as const,
      },
      {
        Header: "Capacity",
        accessor: "capacity" as const,
      },
      {
        Header: "Created At",
        accessor: "createdAt" as const,
      },
    ];
    if (labStatus === "succeeded") {
      const { data } = prepareData(
        (labs as Lab[]).filter(
          (item) =>
            item._id.includes(labSearchText) ||
            item.labName
              .toLowerCase()
              .includes(labSearchText.toLowerCase())
        )
      );
      return (
        <Table<LabTable>
          data={data}
          columns={columns}
          name="Lab"
          isAllowEditDelete={true}
          onClickEditBtn={(id) => history.push(`/labs/${id}`)}
          onClickDeleteBtn={(id) => {
            setShowDeleteLabModal(true);
            setLabIdToDelete(id);
          }}
        />
      );
    } else if (labStatus === "failed") {
      const data: LabTable[] = [];
      return (
        <Table<LabTable>
          data={data}
          columns={columns}
          name="Lab"
          isAllowEditDelete={true}
          onClickEditBtn={(id) => history.push(`/labs/${id}`)}
          onClickDeleteBtn={(id) => {
            setShowDeleteLabModal(true);
            setLabIdToDelete(id);
          }}
        />
      );
    } else {
      return (
        <SkeletonContainer>
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
        </SkeletonContainer>
      );
    }
  };

  return (
    <>
      <PrivateRoute
        roles={["ADMIN"]}
        path="/labs/:id"
        exact={false}
        component={
          <EditLabModal
            showModal={true}
            setShowModal={() => history.goBack()}
            name="Edit lab"
          />
        }
      />
      <NewLabModal
        name="New lab"
        showModal={showNewLabModal}
        setShowModal={setShowNewLabModal}
      />
      <DeleteLabModal
        showModal={showDeleteLabModal}
        setShowModal={setShowDeleteLabModal}
        name="Confirm delete lab"
        labId={labIdToDelete}
      />
      <StyledLabPage>
        <Toolbar>
          <Action>
            <Tooltip title="Refresh table data">
              <IconButtonContainer>
                <IconButton
                  onClick={handleRefreshData}
                  icon={<RefreshIcon fontSize="small" />}
                />
              </IconButtonContainer>
            </Tooltip>
            <Button
              icon={<AddIcon />}
              onClick={() => setShowNewLabModal(true)}
            >
              New lab
            </Button>
          </Action>
        </Toolbar>
        <TableContainer>{renderTable()}</TableContainer>
      </StyledLabPage>
    </>
  );
};

const StyledLabPage = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SkeletonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-row-gap: 1rem;
`;

const Toolbar = styled.div`
  padding-top: 1rem;
  display: flex;
  justify-content: flex-end;
  box-sizing: border-box;

  @media (max-width: 600px) {
    display: inline-flex;
    flex-wrap: wrap;
    & > div {
      margin-bottom: 6px;
    }
  }
`;

const Action = styled.div`
  display: grid;
  column-gap: 1rem;
  grid-template-columns: 1fr 1fr;
  font-size: 0.875rem;

  @media (max-width: 600px) {
    width: 100%;
    margin: 0;
    display: flex;
    flex-direction: row;

    button {
      width: 100%;
    }
  }
`;

const TableContainer = styled.div`
  padding-top: 1rem;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const IconButtonContainer = styled.div`
  display: flex;
  width: 40px;
  box-sizing: border-box;
  justify-self: end;
`;

export default LabPage;
