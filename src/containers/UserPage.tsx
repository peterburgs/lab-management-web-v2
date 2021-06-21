import React, { useState } from "react";
import styled from "styled-components";
import { Column } from "react-table";
import Table from "../components/common/Table";
import Button from "../components/common/Button";
import IconButton from "../components/common/IconButton";
import { Skeleton, Tooltip } from "@material-ui/core";
import NewUserModal from "../components/user-page/NewUserModal";
import AddIcon from "@material-ui/icons/Add";
import EditUserModal from "../components/user-page/EditUserModal";
import PrivateRoute from "./PrivateRoute";
import DeleteUserModal from "../components/user-page/DeleteUserModal";
import RefreshIcon from "@material-ui/icons/Refresh";

// import models
import { ROLES, User } from "../types/model";

// import reducers

// import hooks
import useGetAllUsers from "../hooks/user/useGetAllUsers";
import { useAppSelector, useAppDispatch } from "../store";
import { useHistory } from "react-router";
import { resetState as resetUserState } from "../reducers/userSlice";
import DeleteFaceIDModal from "../components/user-page/DeleteFaceIDModal";

type UserTable = {
  rowId: string;
  id: string;
  fullName: string;
  email: string;
  role: string;
  isFaceIdVerified: JSX.Element;
  emptyColumn: string;
};

const prepareData = (
  users: User[]
): {
  data: UserTable[];
} => {
  let data: UserTable[];

  if (users.length > 0) {
    data = users.map((user) => {
      return {
        emptyColumn: "",
        rowId: user._id,
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.roles
          .map((item) => (item === ROLES.ADMIN ? "Admin" : "Lecturer"))
          .join(" & "),
        isFaceIdVerified: user.isFaceIdVerified ? (
          <AvailableBadge>Verified</AvailableBadge>
        ) : (
          <NotAvailableBadge>Not verified</NotAvailableBadge>
        ),
        createdAt: new Date(user.createdAt).toDateString(),
      };
    });
  } else {
    data = [];
  }

  return { data };
};

const UserPage = () => {
  // State
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [showDeleteFaceIdModal, setShowDeleteFaceIdModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string>(null!);
  const [userIdToDeleteFaceId, setUserIdToDeleteFaceId] = useState<string>(
    null!
  );

  // * Call API
  const [users, userStatus] = useGetAllUsers();

  // call hooks
  const userSearchText = useAppSelector((state) => state.search.userSearchText);
  const history = useHistory();
  const dispatch = useAppDispatch();

  // event handling

  const handleRefreshData = () => {
    dispatch(resetUserState());
  };

  const renderTable = () => {
    const columns: Array<Column<UserTable>> = [
      {
        Header: "Row ID",
        accessor: "rowId" as const,
      },
      {
        Header: "ID",
        accessor: "id" as const,
        width: 50,
      },
      {
        Header: "Full Name",
        accessor: "fullName" as const,
        width: 100,
      },
      {
        Header: "Email",
        accessor: "email" as const,
      },
      {
        Header: "Role",
        accessor: "role" as const,
        width: 70,
      },
      {
        Header: "FaceID",
        accessor: "isFaceIdVerified" as const,
        width: 50,
      },
      {
        Header: "",
        accessor: "emptyColumn" as const,
        width: 50,
        disableSortBy: true,
      },
    ];
    if (userStatus === "succeeded") {
      const { data } = prepareData(
        (users as User[]).filter(
          (item) =>
            item._id.includes(userSearchText) ||
            item.email.toLowerCase().includes(userSearchText.toLowerCase())
        )
      );
      return (
        <Table<UserTable>
          data={data}
          columns={columns}
          name="User"
          isAllowEditDelete={true}
          isFaceId={true}
          onClickEditBtn={(id) => history.push(`/users/${id}`)}
          onClickDeleteBtn={(id) => {
            setShowDeleteUserModal(true);
            setUserIdToDelete(id);
          }}
          onClickDeleteFaceIdBtn={(id) => {
            setShowDeleteFaceIdModal(true);
            setUserIdToDeleteFaceId(id);
          }}
        />
      );
    } else if (userStatus === "failed") {
      const data: UserTable[] = [];
      return (
        <Table<UserTable>
          data={data}
          columns={columns}
          name="User"
          isAllowEditDelete={true}
          isFaceId={true}
          onClickEditBtn={(id) => history.push(`/users/${id}`)}
          onClickDeleteBtn={(id) => {
            setShowDeleteUserModal(true);
            setUserIdToDelete(id);
          }}
          onClickDeleteFaceIdBtn={(id) => {
            setShowDeleteFaceIdModal(true);
            setUserIdToDeleteFaceId(id);
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
        path="/users/:id"
        exact={false}
        component={
          <EditUserModal
            showModal={true}
            setShowModal={() => history.goBack()}
            name="Edit user"
          />
        }
      />
      <NewUserModal
        name="New user"
        showModal={showNewUserModal}
        setShowModal={setShowNewUserModal}
      />
      <DeleteUserModal
        showModal={showDeleteUserModal}
        setShowModal={setShowDeleteUserModal}
        name="Do you want to remove this user?"
        userId={userIdToDelete}
      />
      <DeleteFaceIDModal
        showModal={showDeleteFaceIdModal}
        setShowModal={setShowDeleteFaceIdModal}
        name="Do you want to remove this Face ID"
        userId={userIdToDeleteFaceId}
      />
      <StyledUserPage>
        <Toolbar>
          <Action>
            {/* <Tooltip title="Refresh table data">
              <IconButtonContainer>
                <IconButton
                  onClick={handleRefreshData}
                  icon={<RefreshIcon fontSize="small" />}
                />
              </IconButtonContainer>
            </Tooltip> */}
            <Button
              icon={<AddIcon />}
              onClick={() => setShowNewUserModal(true)}
            >
              New user
            </Button>
          </Action>
        </Toolbar>
        <TableContainer>{renderTable()}</TableContainer>
      </StyledUserPage>
    </>
  );
};

const StyledUserPage = styled.div`
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
  grid-template-columns: 1fr;
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
export default UserPage;
