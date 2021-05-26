import React from "react";
import styled from "styled-components";
import moment from "moment";

interface CommentProps {
  avatarUrl: string;
  createdAt: Date;
  text: string;
}

const Comment = ({ avatarUrl, createdAt, text }: CommentProps) => {
  return (
    <StyledComment>
      <AvatarContainer>
        <img alt="user avatar" src={avatarUrl} />
      </AvatarContainer>
      <CommentContainer>
        <Info>{moment(createdAt).fromNow()}</Info>
        <Content dangerouslySetInnerHTML={{ __html: text }} />
      </CommentContainer>
    </StyledComment>
  );
};

const StyledComment = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  width: 100%;
`;

const AvatarContainer = styled.div`
  min-height: 32px;
  max-height: 32px;
  min-width: 32px;
  max-width: 32px;
  border-radius: 2rem;
  background-color: blue;
  margin-right: 1rem;

  img {
    border-radius: 2rem;
    min-height: 32px;
    max-height: 32px;
    min-width: 32px;
    max-width: 32px;
  }
`;

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #e1e4e8;
  border-radius: 7px;
  width: 100%;
`;

const Info = styled.div`
  background-color: #f6f8fa;
  color: #586069;
  padding: 0.7rem;
  border-radius: 7px 7px 0px 0px;
  border-bottom: 1px solid #e1e4e8;
  font-size: 13px;
`;

const Content = styled.div`
  padding: 0rem 0.5rem;
`;

export default Comment;
