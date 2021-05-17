import React from "react";
import styled from "styled-components";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import {
  REQUEST_TYPES,
  REQUEST_STATUSES,
  User,
} from "../../types/model";
import { Link } from "react-router-dom";
import HourglassEmptyOutlinedIcon from "@material-ui/icons/HourglassEmptyOutlined";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

interface RequestCardProps {
  title: string;
  pendingAt?: Date;
  approvedAt?: Date;
  deniedAt?: Date;
  status: REQUEST_STATUSES;
  type: REQUEST_TYPES;
  user: User;
  numberOfComments: number;
  requestId: string;
}

const RequestCard = ({
  title,
  pendingAt,
  approvedAt,
  deniedAt,
  status,
  type,
  user,
  numberOfComments,
  requestId,
}: RequestCardProps) => {
  return (
    <StyledRequestCard>
      <Container>
        <StatusIconContainer>
          {status === REQUEST_STATUSES.PENDING ? (
            <HourglassEmptyOutlinedIcon
              style={{ color: "#0070f3" }}
            />
          ) : status === REQUEST_STATUSES.APPROVED ? (
            <CheckIcon style={{ color: "#44BD63" }} />
          ) : (
            <CloseIcon style={{ color: "#F02849" }} />
          )}
        </StatusIconContainer>
        <ContentContainer>
          <Header>
            <RequestLink to={`/requests/${requestId}`}>
              <TypeBadge>{type}</TypeBadge>
              <span>{title}</span>
            </RequestLink>
          </Header>
          <Info>
            {status === REQUEST_STATUSES.PENDING
              ? "Open at " +
                new Date(pendingAt!).toDateString() +
                " " +
                new Date(pendingAt!).getHours() +
                ":" +
                new Date(pendingAt!).getMinutes() +
                ":" +
                new Date(pendingAt!).getSeconds()
              : status === REQUEST_STATUSES.APPROVED
              ? "Approved at " +
                new Date(approvedAt!).toDateString() +
                " " +
                new Date(approvedAt!).getHours() +
                ":" +
                new Date(approvedAt!).getMinutes() +
                ":" +
                new Date(approvedAt!).getSeconds()
              : "Denied at " +
                new Date(deniedAt!).toDateString() +
                " " +
                new Date(deniedAt!).getHours() +
                ":" +
                new Date(deniedAt!).getMinutes() +
                ":" +
                new Date(deniedAt!).getSeconds()}
            <span>
              {" "}
              by {user.fullName} - {user.email}
            </span>
          </Info>
        </ContentContainer>
      </Container>

      <CommentBadge>
        <ChatBubbleOutlineIcon fontSize="small" />
        <span>{numberOfComments}</span>
      </CommentBadge>
    </StyledRequestCard>
  );
};

const Header = styled.div`
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 0.5rem;
`;

const Info = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.grey};
`;

const StyledRequestCard = styled.div`
  display: flex;
  padding: 1rem 0;
  width: 100%;
  border-bottom: 1px solid #eaecef;
  justify-content: space-between;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatusIconContainer = styled.div`
  margin-right: 1rem;
`;

const RequestLink = styled(Link)`
  font-size: 17px;
  font-weight: 400;
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  color: black;
  &:hover {
    color: ${({ theme }) => theme.blue};
  }

  & > span {
    margin-left: 0.3rem;
  }
`;

const CommentBadge = styled.div`
  display: flex;

  & > span {
    margin-left: 0.1rem;
    font-size: 12px;
  }
`;

const TypeBadge = styled.div`
  background-color: #eae6ff;
  color: #403294;
  font-size: 12px;
  padding: 0.3rem;
  font-weight: 600;
`;

const Container = styled.div`
  display: flex;
`;

export default RequestCard;
