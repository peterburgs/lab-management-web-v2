import React, { useState } from "react";
import styled from "styled-components";
import { Column } from "react-table";
import Table from "../components/common/Table";
import Button from "../components/common/Button";
import { Skeleton } from "@material-ui/core";
import NewLabModal from "../components/lab-page/NewLabModal";
import EditLabModal from "../components/lab-page/EditLabModal";
import DeleteLabModal from "../components/lab-page/DeleteLabModal";
import PrivateRoute from "./PrivateRoute";
import AddIcon from "@material-ui/icons/Add";
import GetAppIcon from "@material-ui/icons/GetApp";
import * as FileSaver from "file-saver";
import * as XLSX from "sheetjs-style";
import ImportExportIcon from "@material-ui/icons/ImportExport";

// import models
import { Lab, ROLES } from "../types/model";

// import reducers

// import hooks
import useGetAllLabs from "../hooks/lab/useGetAllLabs";
import { useAppSelector } from "../store";
import { useHistory } from "react-router";
import ImportLabModal from "../components/lab-page/ImportLabModal";
import ImportLabPanel from "../components/lab-page/ImportLabPanel";
import moment from "moment";

type LabTable = {
  rowId: string;
  name: string;
  status: JSX.Element;
  capacity: number;
  description: string;
  emptyColumn: string;
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
        emptyColumn: "",
        rowId: lab._id!,
        name: lab.labName,
        capacity: lab.capacity,
        description: lab.description ? lab.description : "",
        status: lab.isAvailableForCurrentUsing ? (
          <AvailableBadge>Available</AvailableBadge>
        ) : (
          <NotAvailableBadge>Not Available</NotAvailableBadge>
        ),
        createdAt: new Date(lab.createdAt!).toDateString(),
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
  const [showImportLabPanel, setShowImportLabPanel] = useState(false);
  const [showImportLabModal, setShowImportLabModal] = useState(false);
  // * Call API
  const [labs, labStatus] = useGetAllLabs();

  // call hooks
  const labSearchText = useAppSelector(
    (state) => state.search.labSearchText
  );
  const role = useAppSelector((state) => state.auth.verifiedRole);
  const history = useHistory();

  // event handling

  const exportCSV = () => {
    const template: {
      "#": string;
      "Lab name": string;
      Capacity: number | string;
    }[] = (labs as Lab[]).map((lab, i) => {
      return {
        "#": String(i + 1),
        "Lab name": lab.labName,
        Capacity: lab.capacity,
        Description: lab.description ? lab.description : "",
      };
    });
    template.push({
      "#": "Exported date",
      "Lab name": moment(new Date()).format("DD:MM:YYYY hh:mm:ss A"),
      Capacity: "",
    });

    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    let wscols = [{ wch: 30 }, { wch: 30 }, { wch: 30 }];

    let hsrows: { hpt: number }[] = (labs as Lab[]).map((_, __) => {
      return {
        hpt: 40,
      };
    });
    hsrows.push({ hpt: 40 });
    const ws = XLSX.utils.json_to_sheet(template);
    ws["!rows"] = hsrows;
    ws["!cols"] = wscols;
    if ((labs as Lab[]).length > 0) {
      for (let i = 0; i <= (labs as Lab[]).length + 1; i++) {
        for (let j = 1; j <= 4; j++) {
          if (i === 0) {
            ws[`${(j + 9).toString(36).toUpperCase()}${i + 1}`].s = {
              font: {
                sz: 16,
                bold: true,
                color: { rgb: "000000" },
              },
              fill: {
                fgColor: { rgb: "FFFFAA00" },
              },
              border: {
                top: { style: "medium", color: { rgb: "000000" } },
                bottom: { style: "medium", color: { rgb: "000000" } },
                left: { style: "medium", color: { rgb: "000000" } },
                right: { style: "medium", color: { rgb: "000000" } },
              },
              alignment: { vertical: "center", horizontal: "center" },
            };
          } else {
            ws[`${(j + 9).toString(36).toUpperCase()}${i + 1}`].s = {
              font: {
                sz: 15,
                color: { rgb: "000000" },
              },
              alignment: {
                wrapText: true,
                vertical: "center",
                horizontal: "center",
              },
              border: {
                top: { style: "medium", color: { rgb: "000000" } },
                bottom: { style: "medium", color: { rgb: "000000" } },
                left: { style: "medium", color: { rgb: "000000" } },
                right: { style: "medium", color: { rgb: "000000" } },
              },
            };
          }
        }
      }
    }
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "labs" + fileExtension);
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
        Header: "Status",
        accessor: "status" as const,
      },
      {
        Header: "Capacity",
        accessor: "capacity" as const,
      },
      {
        Header: "Description",
        accessor: "capacity" as const,
      },
      {
        Header: "",
        accessor: "emptyColumn" as const,
        width: 50,
        disableSortBy: true,
      },
    ];
    if (labStatus === "succeeded") {
      const { data } = prepareData(
        (labs as Lab[]).filter(
          (item) =>
            item._id!.includes(labSearchText) ||
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
          isAllowEditDelete={role === ROLES.ADMIN}
          isFaceId={false}
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
          isAllowEditDelete={role === ROLES.ADMIN}
          isFaceId={false}
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
        roles={[ROLES.ADMIN]}
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
      <ImportLabModal
        name="Import lab"
        showModal={showImportLabModal}
        setShowModal={setShowImportLabModal}
      />
      <NewLabModal
        name="New lab"
        showModal={showNewLabModal}
        setShowModal={setShowNewLabModal}
      />
      <DeleteLabModal
        showModal={showDeleteLabModal}
        setShowModal={setShowDeleteLabModal}
        name="Do you want to remove this lab?"
        labId={labIdToDelete}
      />
      <StyledLabPage>
        <Toolbar>
          <Total>Total:&nbsp;{labs.length}</Total>
          <Action isAdmin={role === ROLES.ADMIN}>
            {/* <Tooltip title="Refresh table data">
              <IconButtonContainer>
                <IconButton
                  onClick={handleRefreshData}
                  icon={<RefreshIcon fontSize="small" />}
                />
              </IconButtonContainer>
            </Tooltip> */}
            {role === ROLES.ADMIN && (
              <>
                <Button
                  onClick={() =>
                    setShowImportLabPanel((current) => !current)
                  }
                  icon={<ImportExportIcon />}
                >
                  Import labs
                </Button>
                <Button onClick={exportCSV} icon={<GetAppIcon />}>
                  Export labs
                </Button>
                {showImportLabPanel && (
                  <ImportPanelContainer>
                    <ImportLabPanel
                      setShowImportLabModal={setShowImportLabModal}
                    />
                  </ImportPanelContainer>
                )}
                <Button
                  icon={<AddIcon />}
                  onClick={() => setShowNewLabModal(true)}
                >
                  New lab
                </Button>
              </>
            )}
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
  justify-content: space-between;
  box-sizing: border-box;

  @media (max-width: 600px) {
    display: inline-flex;
    flex-wrap: wrap;
    & > div {
      margin-bottom: 6px;
    }
  }
`;

interface ActionProps {
  isAdmin: boolean;
}

const Action = styled.div<ActionProps>`
  display: grid;
  column-gap: 1rem;
  grid-template-columns: ${({ isAdmin }) =>
    isAdmin ? "1fr 1fr 1fr" : "1fr"};
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

const ImportPanelContainer = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  transform: translate(-400px, 155px);
  z-index: 3;

  @media (max-width: 1220px) {
    transform: translate(-400px, 60px);
  }
`;

const NotAvailableBadge = styled.div`
  background-color: ${({ theme }) => theme.lightRed};
  color: ${({ theme }) => theme.red};
  font-size: 12px;
  padding: 0 0.5rem;
  font-weight: 600;
  border-radius: 10px;
`;

const AvailableBadge = styled.div`
  background-color: ${({ theme }) => theme.green};
  color: white;
  font-size: 12px;
  padding: 0 0.5rem;
  font-weight: 600;
  border-radius: 10px;
`;

const Total = styled.div`
  font-size: 13px;
`;

export default LabPage;
