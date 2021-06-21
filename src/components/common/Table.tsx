/*
  This component depends a lot on "react-table" library.
  For more detail of the library: https://react-table.tanstack.com/docs/quick-start
*/
import React, {
  MouseEventHandler,
  PropsWithChildren,
  CSSProperties,
} from "react";
import styled from "styled-components";
import {
  useTable,
  useResizeColumns,
  useFlexLayout,
  Meta,
  HeaderGroup,
  Cell,
  TableInstance,
  TableOptions,
  Row,
  useRowSelect,
  useSortBy,
} from "react-table";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import InfoIcon from "@material-ui/icons/Info";
import { TableSortLabel } from "@material-ui/core";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import { ReactComponent as Image } from "../../assets/images/empty.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserSlash } from "@fortawesome/free-solid-svg-icons";

// Define the interface for the props of this component
export interface TableProperties<T extends Record<string, unknown>>
  extends TableOptions<T> {
  name: string;
  onAdd?: (instance: TableInstance<T>) => MouseEventHandler;
  onDelete?: (instance: TableInstance<T>) => MouseEventHandler;
  onEdit?: (instance: TableInstance<T>) => MouseEventHandler;
  onClick?: (row: Row<T>) => void;
  onClickEditBtn?: (id: string) => void;
  onClickDeleteBtn?: (id: string) => void;
  onClickDeleteFaceIdBtn?: (id: string) => void;
  isAllowEditDelete: boolean;
  isFaceId: boolean;
}

// Add alignment styling to header and cell
const headerProps = <T extends Record<string, unknown>>(
  props: any,
  { column }: Meta<T, { column: HeaderGroup<T> }>
) => getStyles(props, column && column.disableResizing, column && column.align);
const cellProps = <T extends Record<string, unknown>>(
  props: any,
  { cell }: Meta<T, { cell: Cell<T> }>
) =>
  getStyles(
    props,
    cell.column && cell.column.disableResizing,
    cell.column && cell.column.align
  );
const getStyles = (props: any, disableResizing = false, align = "left") => [
  props,
  {
    style: {
      justifyContent: align === "right" ? "flex-end" : "flex-start",
      alignItems: "flex-start",
      display: "flex",
    },
  },
];

const Table = <T extends Record<string, unknown>>(
  props: PropsWithChildren<TableProperties<T>>
) => {
  const defaultColumn = React.useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 150, // width is used for both the flex-basis and flex-grow
      maxWidth: 200, // maxWidth is only used as a limit for resizing
    }),
    []
  );

  // table instance contains every logics of the table such as sort, render, select event, etc.
  const tableInstance = useTable<T>(
    {
      ...props,
      defaultColumn,
      initialState: { hiddenColumns: ["rowId"] },
    },
    useResizeColumns,
    useFlexLayout,
    useSortBy,
    useRowSelect
  );

  // API of table instance that we can used to render the table
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    toggleAllRowsSelected,
  } = tableInstance;

  return (
    <StyledTable {...getTableProps()}>
      <StyledThead>
        {/* thead */}
        {headerGroups.map((headerGroup) => (
          <StyledTHeadRow {...headerGroup.getHeaderGroupProps()}>
            {/* tr */}
            {headerGroup.headers.map((column) => {
              const style = {
                textAlign: column.align ? column.align : "left ",
              } as CSSProperties;
              return (
                <StyledTh {...column.getHeaderProps(headerProps)}>
                  {/* th */}
                  {column.canSort ? (
                    <StyledTableSortLabel
                      active={column.isSorted}
                      direction={column.isSortedDesc ? "desc" : "asc"}
                      {...column.getSortByToggleProps()}
                      style={style}
                    >
                      {column.render("Header")}
                    </StyledTableSortLabel>
                  ) : (
                    <div style={style}>{column.render("Header")}</div>
                  )}
                  {column.canResize && (
                    <Resizer
                      {...column.getResizerProps()}
                      className={`${column.isResizing ? "isResizing" : ""}`}
                    />
                  )}
                </StyledTh>
              );
            })}
          </StyledTHeadRow>
        ))}
      </StyledThead>
      <SimpleBar
        forceVisible="y"
        autoHide={false}
        style={{
          maxHeight: "calc(100% - 70px)",
        }}
      >
        <StyledTbody {...getTableBodyProps()}>
          {/* tbody */}
          {rows.length === 0 ? (
            <EmptyImage>
              <Image />
              <div>There is nothing to show</div>
            </EmptyImage>
          ) : (
            rows.map((row) => {
              prepareRow(row);

              return (
                <StyledTBodyRow
                  onClick={() => {
                    toggleAllRowsSelected(false);
                    row.toggleRowSelected();
                  }}
                  {...row.getRowProps()}
                  className={`${row.isSelected ? "selected" : ""}`}
                >
                  {/* tr */}
                  {row.cells.map((cell) => {
                    return (
                      <StyledTd {...cell.getCellProps(cellProps)}>
                        {/* td */}
                        <StyledSpan>{cell.render("Cell")}</StyledSpan>
                      </StyledTd>
                    );
                  })}

                  <ActionButtonContainer>
                    {row.original.rowId !== "MASTER" ? (
                      <>
                        {props.isFaceId && (
                          <DeleteButton
                            onClick={() =>
                              props.onClickDeleteFaceIdBtn!(
                                row.original.rowId as string
                              )
                            }
                          >
                            <FontAwesomeIcon icon={faUserSlash} />
                          </DeleteButton>
                        )}
                        {props.isAllowEditDelete && (
                          <>
                            {" "}
                            <EditButton
                              onClick={() =>
                                props.onClickEditBtn!(
                                  row.original.rowId as string
                                )
                              }
                            >
                              <EditIcon fontSize="small" />
                            </EditButton>
                            <DeleteButton
                              onClick={() =>
                                props.onClickDeleteBtn!(
                                  row.original.rowId as string
                                )
                              }
                            >
                              <DeleteIcon fontSize="small" />
                            </DeleteButton>
                          </>
                        )}
                      </>
                    ) : null}
                  </ActionButtonContainer>
                </StyledTBodyRow>
              );
            })
          )}
        </StyledTbody>
      </SimpleBar>
    </StyledTable>
  );
};

// Styling
const StyledTable = styled.div`
  display: block;
  height: 100%;
  width: 100%;
  border-spacing: 0;
  overflow: hidden;
`;

const StyledSpan = styled.span`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Resizer = styled.div`
  right: 0;
  background: rgba(0, 0, 0, 0.1);
  width: 5px;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 1;
  opacity: 0;
  ${"" /* prevents from scrolling while dragging on touch devices */}
  touch-action :none;
  transition: "all linear 100ms";
  cursor: "col-resize";
  right: -2;
  width: 3px;
  height: 50%;
  top: 25%;

  &.isResizing {
    height: calc(100% - 4px);
    top: 2px;
    right: -1;
    width: 1px;
    border: none;
  }
`;

const StyledThead = styled.div`
  overflow: hidden;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.blueShadow};
  border-radius: 0.7rem;
  border: ${({ theme }) => `0.5px solid ${theme.lightBlue}`};
`;

const StyledTHeadRow = styled.div`
  outline: 0;
  vertical-align: middle;
  font-weight: 500;
  line-height: 1.5rem;
  position: relative;

  &:hover ${Resizer} {
    opacity: 1;
  }
`;

const ActionButtonContainer = styled.div`
  right: 0;
  position: absolute;
  bottom: 0;
  top: 0;
  display: flex;
  align-items: center;
  background: #fff;
  margin-right: 1.5rem;
`;

const EditButton = styled.button`
  outline: none;
  background: transparent;
  color: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.8);
  cursor: pointer;
  margin: 0 5px;
  font-size: 16px;
  padding: 5px 5px;
  display: flex;
  align-items: center;

  &:active {
    background-color: rgba(0, 0, 0, 0.8);
    transform: scale(0.98);
    &:hover {
      background-color: rgba(0, 0, 0, 0.8);
    }
  }

  &:hover {
    background-color: black;
    color: white;
  }
`;

const DeleteButton = styled.button`
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.red};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.red};
  cursor: pointer;
  margin: 0 5px;
  font-size: 16px;
  padding: 5px 5px;
  display: flex;
  align-items: center;

  &:active {
    background-color: ${({ theme }) => theme.red};
    transform: scale(0.98);
    color: white;
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

const StyledTBodyRow = styled.div`
  outline: 0;
  vertical-align: middle;
  position: relative;
  &:hover {
    background-color: rgba(0, 0, 0, 0.07);
    border-radius: 0.7rem;
    border-top: 1px solid rgba(224, 224, 224, 1);
    & + div {
      border-top: 1px solid transparent;
    }
    ${ActionButtonContainer} {
      background: transparent;
      border-radius: 0.7rem;
      display: flex;
    }
  }

  border-right: 1px solid transparent;
  border-bottom: 1px solid transparent;
  border-left: 1px solid transparent;
  border-top: 1px solid rgba(224, 224, 224, 1);
  &:last-child {
    border-bottom: none;
  }
  &:first-child {
    border-top: 1px solid transparent;
  }
  &.selected {
    background-color: #e9f2fe;
    border: 1px solid #ccdff7;
    font-weight: 500;
    border-radius: 0.7rem;
    & + div {
      border-top: 1px solid transparent;
    }
    ${ActionButtonContainer} {
      background: #e9f2fe;
      border-radius: 0.7rem;
      display: flex;
    }
  }
`;

const StyledTh = styled.div`
  margin: 0;
  padding: 0.5rem;
  position: relative;
  font-size: 14px;
`;

const StyledTbody = styled.div`
  margin-top: 0.5rem;
  overflow: hidden;
`;

const StyledTd = styled.div`
  margin: 0;
  padding: 0.5rem;
  position: relative;
  padding: 16;
  line-height: 2.5;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
  font-size: 14px;
`;

const StyledTableSortLabel = styled(TableSortLabel)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  svg {
    width: 16px;
    height: 16px;
    margin-top: 0px;
    margin-left: 2px;
  }
`;

const EmptyImage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  svg {
    width: 400px;
    height: auto;
  }
  &:hover {
    svg {
      fill: black;
    }
  }
  & > div {
    margin-top: 0.5rem;
    font-weight: 500;
    font-size: 1.25rem;
  }
`;

export default Table;
