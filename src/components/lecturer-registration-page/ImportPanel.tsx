import React from "react";
import styled from "styled-components";
import template from "../../assets/templates/teaching_template.xlsx";

interface ImportPanelProps {
  setShowImportTeachingModal: (a: boolean) => void;
}

const ImportPanel = (props: ImportPanelProps) => {
  return (
    <StyledImportPanel>
      <Button onClick={() => props.setShowImportTeachingModal(true)}>
        Import
      </Button>
      <Button href={template} download="teaching_template">Download template</Button>
    </StyledImportPanel>
  );
};

// Styling
const StyledImportPanel = styled.div`
  box-shadow: ${({ theme }) => theme.greyShadow};
  border-radius: 8px;
  border: ${({ theme }) => `1px solid ${theme.lightGrey}`};
  opacity: 1;
  padding: 0.5rem;
  width: 150px;
  background: white;
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 250px;
`;

const Button = styled.a`
  border: none;
  outline: none;
  color: black;
  text-decoration: none;
  border-radius: 4px;
  padding: 7px;
  display: flex;
  align-items: center;
  opacity: 0.85;
  background: transparent;
  font-size: 16px;
  cursor: pointer;
  height: 40px;
  justify-content: left;
  width: 100%;
  &:hover {
    background: ${({ theme }) => theme.lightGrey};
  }
  &:active {
    transform: scale(0.98);
  }
`;

export default ImportPanel;
