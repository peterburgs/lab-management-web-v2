import React from "react";
import styled from "styled-components";

interface BurgerProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Burger = ({ isCollapsed, onToggle }: BurgerProps) => {
  return (
    <StyledBurger onClick={onToggle} isCollapsed={isCollapsed}>
      <div />
      <div />
      <div />
    </StyledBurger>
  );
};

// Styling
interface StyledBurgerProps {
  isCollapsed: boolean;
}

const StyledBurger = styled.button<StyledBurgerProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 1.25rem;
  height: 1.25rem;

  &:focus {
    outline: none;
  }

  @media (max-width: 1220px) {
    display: flex;
  }

  div {
    background: white;
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;
    width: 1.25rem;
    height: 0.15rem;

    :nth-child(1) {
      transform: ${({ isCollapsed }) =>
        isCollapsed ? "rotate(0)" : "rotate(45deg)"};
    }

    :nth-child(2) {
      opacity: ${({ isCollapsed }) => (isCollapsed ? 1 : 0)};
      transform: ${({ isCollapsed }) =>
        isCollapsed ? "translateX(0)" : "translateX(20px)"};
    }

    :nth-child(3) {
      transform: ${({ isCollapsed }) =>
        isCollapsed ? "rotate(0)" : "rotate(-45deg)"};
    }
  }
`;

export default Burger;
