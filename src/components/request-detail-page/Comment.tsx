import React from "react";
import styled from "styled-components";

const Comment = () => {
  return (
    <StyledComment>
      <AvatarContainer>
        <img
          alt="user avatar"
          src="https://lh4.googleusercontent.com/-8dPdj1_5_8I/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucliLTUwmZKoDHXKqKQztraa2HWHWg/s96-c/photo.jpg"
        />
      </AvatarContainer>

      <CommentContainer>
        <Info>Starea commented 2 days ago</Info>
        <Content>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Dolores eaque necessitatibus deleniti sed, culpa nobis
          obcaecati et magnam reprehenderit nostrum vitae minima porro
          natus ducimus quisquam voluptas sequi. Officiis, repellat!
        </Content>
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
  padding: 0.7rem;
`;

export default Comment;
