import React, { SyntheticEvent, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { ReactComponent as SearchIcon } from "../../assets/images/search-icon.svg";

interface SearchBarProps {
  setSearchText?: (a: string) => void;
  placeholder?: string;
}

const SearchBar = ({
  setSearchText,
  placeholder,
}: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (inputRef.current && setSearchText) {
      setSearchText(inputRef.current.value);
    }
  };

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
  min-width: 60%;
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

export default SearchBar;
