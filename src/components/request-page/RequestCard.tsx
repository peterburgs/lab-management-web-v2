import React from "react";
import styled from "styled-components";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import { REQUEST_TYPES, STATUSES } from "../../types/model";
import { Link } from "react-router-dom";

interface RequestCardProps {
  title: string;
  pendingAt?: Date;
  approvedAt?: Date;
  deniedAt?: Date;
  status: STATUSES;
  type: REQUEST_TYPES;
  authorName: string;
  numberOfComments: number;
}

const RequestCard = ({
  title,
  pendingAt,
  approvedAt,
  deniedAt,
  status,
  type,
  authorName,
  numberOfComments,
}: RequestCardProps) => {
  return (
    <StyledRequestCard>
      <ContentContainer>
        <Header>
          <RequestLink to="/id">
            <TypeBadge>
              {type === REQUEST_TYPES.MODIFY_LAB_USAGE
                ? "MODIFY LAB USAGE"
                : "ADD EXTRA CLASS"}
            </TypeBadge>
            <span>{title}</span>
          </RequestLink>
        </Header>
        <Info>
          {status === STATUSES.PENDING
            ? "Open at " + pendingAt!.toDateString()
            : status === STATUSES.APPROVED
            ? "Approved at " + approvedAt!.toDateString()
            : "Denied at " + deniedAt!.toDateString()}
          <span> by {authorName}</span>
        </Info>
      </ContentContainer>
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

export default RequestCard;
