import React, {
  SyntheticEvent,
  useRef,
  useState,
  useEffect,
} from "react";
import styled, { css } from "styled-components";
import { ReactComponent as SearchIcon } from "../../assets/images/search-icon.svg";
import {
  resetState as resetSearchState,
  setCourseSearch,
  setLabSearch,
  setTeachingSearch,
  setUserSearch,
  setRequestSearch,
} from "../../reducers/searchSlice";
import { useAppDispatch } from "../../store";
import { useLocation } from "react-router";

const AppSearchBar = () => {
  // useState, useRef
  const [isFocused, setIsFocused] = useState(false);
  const [placeholder, setPlaceholder] = useState("Search");
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const dispatch = useAppDispatch();

  // event handler
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (inputRef.current) {
      switch (location.pathname.split("/")[1]) {
        case "registration":
          dispatch(setTeachingSearch(inputRef.current.value));
          break;
        case "courses":
          dispatch(setCourseSearch(inputRef.current.value));
          break;
        case "users":
          dispatch(setUserSearch(inputRef.current.value));
          break;
        case "labs":
          dispatch(setLabSearch(inputRef.current.value));
          break;
        case "requests":
          dispatch(setRequestSearch(inputRef.current.value));
          break;
        case "schedule":
          console.log("Test");
          break;
      }
    }
  };

  // useEffect
  useEffect(() => {
    dispatch(resetSearchState());
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    switch (location.pathname.split("/")[1]) {
      case "registration":
        setPlaceholder("Enter course name or id to search");
        break;
      case "courses":
        setPlaceholder("Enter course name or id to search");
        break;
      case "schedule":
        setPlaceholder("Enter lab name to search");
        break;
      case "users":
        setPlaceholder("Enter email or user ID to search");
        break;
      case "labs":
        setPlaceholder("Enter lab name to search");
        break;
      case "requests":
        setPlaceholder("Enter request title to search");
        break;
    }
  }, [location, inputRef, dispatch]);

  return (
    <StyledSearchBar isFocused={isFocused}>
      <SearchForm onSubmit={handleSubmit}>
        <SearchIconContainer type="submit">
          <StyledSearchIcon>
            <SearchIcon />
          </StyledSearchIcon>
        </SearchIconContainer>
        <SearchInput
          ref={inputRef}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          type="text"
          placeholder={placeholder}
        />
      </SearchForm>
    </StyledSearchBar>
  );
};

// Styling
interface StyledSearchBarProps {
  isFocused: boolean;
}

const StyledSearchBar = styled.div<StyledSearchBarProps>`
  width: 100%;
  box-sizing: border-box;
  background: #f4f4f4;
  border-radius: 8px;

  &:hover {
    opacity: 0.7;
  }

  ${({ isFocused }) =>
    isFocused &&
    css`
      box-shadow: 0 1px 1px 0 rgb(65 69 73 / 30%),
        0 1px 3px 1px rgb(65 69 73 / 15%);
      background: white;
      & input {
        background: white;
      }
    `}
`;

const SearchForm = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SearchIconContainer = styled.button`
  border: none;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const StyledSearchIcon = styled.span`
  padding: 0.75rem;
  display: flex;
  align-items: center;
  height: auto;
  & > svg {
    fill: #5f6368;
    width: 20px;
    height: 20px;
  }
`;

const SearchInput = styled.input`
  border: none;
  height: 100%;
  padding: 12px;
  background: #f4f4f4;
  border-radius: 8px;
  width: 100%;
  font-size: 16px;
  &:focus {
    outline: none;
  }
`;

export default AppSearchBar;
