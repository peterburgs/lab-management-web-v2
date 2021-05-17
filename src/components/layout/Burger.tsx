import React from "react";
import styled from "styled-components";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import DehazeIcon from "@material-ui/icons/Dehaze";

interface BurgerProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Burger = ({ isCollapsed, onToggle }: BurgerProps) => {
  return (
    <StyledBurger onClick={onToggle}>
      {isCollapsed ? (
        <DehazeIcon fontSize="medium" style={{ color: "white" }} />
      ) : (
        <ArrowBackIosIcon
          fontSize="medium"
          style={{ color: "white" }}
        />
      )}
    </StyledBurger>
  );
};

// Styling

const StyledBurger = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 1.25rem;
  height: 1.25rem;

  @media (max-width: 1220px) {
    display: flex;
  }
`;

export default Burger;
