import React from "react";
import styled from "styled-components";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import Button from "../common/Button";

const AddComment = () => {
  const [editorState, setEditorState] = React.useState<EditorState>(
    EditorState.createEmpty()
  );

  return (
    <StyledComment>
      <AvatarContainer>
        <img
          alt="user avatar"
          src="https://lh4.googleusercontent.com/-8dPdj1_5_8I/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucliLTUwmZKoDHXKqKQztraa2HWHWg/s96-c/photo.jpg"
        />
      </AvatarContainer>
      <CommentForm>
        <TextboxContainer>
          <Editor
            editorState={editorState}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            onEditorStateChange={setEditorState}
            placeholder="Leave a comment..."
          />
          {/* <textarea
          disabled
          value={draftToHtml(
            convertToRaw(editorState.getCurrentContent())
          )}
        /> */}
        </TextboxContainer>
        <ActionButton>Comment</ActionButton>
      </CommentForm>
    </StyledComment>
  );
};

const StyledComment = styled.div`
  display: flex;
  width: 100%;
  margin-top: 1rem;
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

const TextboxContainer = styled.div`
  border: 1px solid #e1e4e8;
  border-radius: 7px;
  background-color: white;
  padding:0.5rem;
`;

const ActionButton = styled(Button)`
  background-color: ${({ theme }) => theme.lightGreen};
  box-shadow: none;
  margin-top: 0.5rem;
  max-width: 100px;
  align-self: flex-end;
  color: ${({ theme }) => theme.green};
  font-weight: 500;
  font-size: 15px;
  padding: 0 0.7rem;
  border: 1px solid ${({ theme }) => theme.green};
  &:active {
    background-color: ${({ theme }) => theme.lightGreen};
    &:hover {
      background-color: ${({ theme }) => theme.lightGreen};
    }
  }

  &:hover {
    background-color: ${({ theme }) => theme.lightGreen};
  }
`;

const CommentForm = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #e1e4e8;
  border-radius: 7px;
  padding: 0.7rem;
  background-color: #f6f8fa;
`;

export default AddComment;
