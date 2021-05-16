import React from "react";
import styled from "styled-components";
import { STATUSES } from "../types/model";
import SimpleBar from "simplebar-react";
import Button from "../components/common/Button";
import Comment from "../components/request-detail-page/Comment";
import "simplebar/dist/simplebar.min.css";
import AddComment from "../components/request-detail-page/AddComment";

const RequestDetailPage = () => {
  return (
    <StyledRequestDetailPage>
      <Header>
        <RequestInfo>
          <RequestTitle>Change to lab 1</RequestTitle>
          <Info>
            <TypeBadge>MODIFY LAB USAGE</TypeBadge>
            <StatusBadge status={STATUSES.PENDING}>
              PENDING
            </StatusBadge>
            <span>
              {new Date().toDateString() +
                " " +
                new Date().getHours() +
                ":" +
                new Date().getMinutes() +
                ":" +
                new Date().getSeconds() +
                " " +
                "by Starea"}
            </span>
          </Info>
          <RequestDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Impedit explicabo vel animi cumque inventore quis
            cupiditate, iste quidem molestiae? Architecto ut totam,
            nesciunt provident laboriosam aliquid error? Nihil,
            quisquam eveniet?
          </RequestDescription>
        </RequestInfo>
        <Action>
          <ActionButton action="approve">Approve</ActionButton>
          <ActionButton action="deny">Deny</ActionButton>
        </Action>
      </Header>
      <SimpleBar
        style={{
          maxHeight: "calc(100% - 170px)",
        }}
      >
        <CommentListContainer>
          <Comment />
          <Comment />
        </CommentListContainer>
        <AddComment />
      </SimpleBar>
    </StyledRequestDetailPage>
  );
};

const StyledRequestDetailPage = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eaecef;
`;

const RequestInfo = styled.div`
  display: flex;
  flex-direction: column;

  & > * {
    margin-bottom: 0.5rem;
  }
`;

const RequestTitle = styled.div`
  font-size: 32px;
  font-weight: 400;
  display: flex;
  margin-bottom: 1rem;
`;

const Action = styled.div`
  display: flex;
  & > * {
    margin-left: 0.7rem;
  }
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${({ theme }) => theme.grey};
`;

const RequestDescription = styled.div`
  font-style: italic;
  line-height: 1.5;
  font-size: 15px;
`;

const TypeBadge = styled.div`
  background-color: #eae6ff;
  color: #403294;
  font-size: 12px;
  padding: 0.3rem;
  font-weight: 600;
  margin-right: 0.7rem;
  height: 24px;
`;

interface StatusBadgeProps {
  status: STATUSES;
}

const StatusBadge = styled.div<StatusBadgeProps>`
  background-color: ${({ status, theme }) =>
    status === STATUSES.PENDING
      ? theme.veryLightBlue
      : status === STATUSES.APPROVED
      ? theme.lightGreen
      : theme.lightRed};
  color: ${({ status, theme }) =>
    status === STATUSES.PENDING
      ? theme.blue
      : status === STATUSES.APPROVED
      ? theme.green
      : theme.red};
  font-size: 12px;
  padding: 0.3rem;
  font-weight: 600;
  margin-right: 0.7rem;
  height: 24px;
`;

interface ActionButtonProps {
  action: "approve" | "deny";
}

const ActionButton = styled(Button)<ActionButtonProps>`
  background-color: ${({ theme, action }) =>
    action === "approve" ? theme.lightGreen : theme.lightRed};
  box-shadow: none;
  color: ${({ theme, action }) =>
    action === "approve" ? theme.green : theme.red};
  font-weight: 500;
  font-size: 15px;
  padding: 0 0.7rem;
  border: 1px solid
    ${({ theme, action }) =>
      action === "approve" ? theme.green : theme.red};
  &:active {
    background-color: ${({ theme, action }) =>
      action === "approve" ? theme.lightGreen : theme.lightRed};
    &:hover {
      background-color: ${({ theme, action }) =>
        action === "approve" ? theme.lightGreen : theme.lightRed};
    }
  }

  &:hover {
    background-color: ${({ theme, action }) =>
      action === "approve" ? theme.lightGreen : theme.lightRed};
  }
`;

const CommentListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  overflow: hidden;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid #eaecef;
`;

export default RequestDetailPage;
