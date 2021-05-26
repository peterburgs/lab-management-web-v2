import React, { useState } from "react";
import styled from "styled-components";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import Button from "../common/Button";
import { newComment } from "../../reducers/commentSlice";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  setShowErrorSnackBar,
  setShowSuccessSnackBar,
  setSnackBarContent,
} from "../../reducers/notificationSlice";
import { unwrapResult } from "@reduxjs/toolkit";

interface AddCommentProps {
  request: string;
}

const AddComment = (props: AddCommentProps) => {
  const [editorState, setEditorState] = React.useState<EditorState>(
    EditorState.createEmpty()
  );

  const [status, setStatus] = useState("idle");
  const user = useAppSelector((state) => state.auth.verifiedUser);
  const avatarUrl = useAppSelector((state) => state.auth.avatarUrl);

  const dispatch = useAppDispatch();

  const handleSubmit = async (data: string) => {
    if (user) {
      try {
        let comment = {
          text: data,
          uId: user._id,
          request: props.request,
          isHidden: false,
        };
        setStatus("pending");
        const actionResult = await dispatch(newComment(comment));
        unwrapResult(actionResult);

        dispatch(setSnackBarContent("New comment created"));
        dispatch(setShowSuccessSnackBar(true));
        const newEditorState = EditorState.push(
          editorState,
          ContentState.createFromText(""),
          "remove-range"
        );
        setEditorState(newEditorState);
      } catch (err) {
        console.log("Failed to create new comment", err);
        if (err.response) {
          dispatch(setSnackBarContent(err.response.data.message));
        } else {
          dispatch(
            setSnackBarContent("Failed to create new comment")
          );
        }
        dispatch(setShowErrorSnackBar(true));
      } finally {
        setStatus("idle");
      }
    }
  };

  return (
    <StyledComment>
      <AvatarContainer>
        <img alt="user avatar" src={avatarUrl!} />
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
        <ActionButton
          loading={status === "pending"}
          onClick={() =>
            handleSubmit(
              draftToHtml(
                convertToRaw(editorState.getCurrentContent())
              )
            )
          }
        >
          Comment
        </ActionButton>
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
  padding: 0.5rem;
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
