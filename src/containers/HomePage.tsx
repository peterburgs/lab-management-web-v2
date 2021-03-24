import React, { useState } from "react";
import styled from "styled-components";
import Table from "../components/common/Table";
import { Column } from "react-table";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import Button from "../components/common/Button";
import EditIcon from "@material-ui/icons/Edit";
import EditSemesterModal from "../components/HomePage/EditSemesterModal";

type Test = {
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  col5: string;
  col6: string;
};

const HomePage = () => {
  const data = React.useMemo<Array<Test>>(
    () => [
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
        col4: "World",
        col5: "World",
        col6: "World",
      },
      {
        col1: "Hello1",
        col2: "World1",
        col3: "World1",
        col4: "World1",
        col5: "World1",
        col6: "World1",
      },
    ],
    []
  );

  const columns = React.useMemo<Array<Column<Test>>>(
    () => [
      {
        Header: "Column 1",
        accessor: "col1" as const,
      },
      {
        Header: "Column 2",
        accessor: "col2" as const,
      },
      {
        Header: "Column 3",
        accessor: "col3" as const,
      },
      {
        Header: "Column 4",
        accessor: "col4" as const,
      },
      {
        Header: "Column 5",
        accessor: "col5" as const,
      },
      {
        Header: "Column 6",
        accessor: "col6" as const,
      },
    ],
    []
  );

  // state
  const [batch, setBatch] = useState(1);
  const [showEditSemesterModal, setShowEditSemesterModal] = useState(
    false
  );

  return (
    <>
      <EditSemesterModal
        showModal={showEditSemesterModal}
        setShowModal={setShowEditSemesterModal}
        name="Edit Semester"
      />
      <StyledHomePage>
        <Header>
          <div>Semester 2020-2021</div>
          <Tooltip title="Edit semester">
            <IconButton
              onClick={() => setShowEditSemesterModal(true)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Header>
        <SemesterInfo>
          <div>{`Start date: ${new Date().toUTCString()}`}</div>
          <div>Number of weeks: 15</div>
        </SemesterInfo>
        <Toolbar>
          <Filter>
            <FormControl>
              <InputLabel id="batch-label">Batch</InputLabel>
              <Select
                labelId="batch-label"
                id="batch-select"
                value={batch}
                onChange={(e) => setBatch(e.target.value as number)}
                label="Batch"
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
              </Select>
            </FormControl>
          </Filter>
          <Action>
            <Button>Generate schedule</Button>
          </Action>
        </Toolbar>
        <TableContainer>
          <Table<Test> data={data} columns={columns} name="Test" />
        </TableContainer>
      </StyledHomePage>
    </>
  );
};

const StyledHomePage = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.div`
  font-size: 18px;
  font-weight: 500;
  display: flex;
  align-items: center;

  & > button {
    padding: 3px;
    svg {
      fill: #0070f3;
    }
  }
`;

const TableContainer = styled.div`
  padding-top: 1rem;
  height: 100%;
  overflow-x: hidden;
`;

const SemesterInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 0.5rem;
  color: rgba(0, 0, 0, 0.5);
  font-size: 16px;
  font-weight: 500;
  div {
    margin-bottom: 0.3rem;
  }
`;

const Toolbar = styled.div`
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;

  @media (max-width: 900px) {
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: center;
    & > div {
      margin: 6px;
    }
  }
`;

const Filter = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 1rem;
`;

const Action = styled.div`
  display: grid;
  column-gap: 1rem;
  grid-template-columns: 1fr;
  font-size: 0.875rem;
`;

export default HomePage;
