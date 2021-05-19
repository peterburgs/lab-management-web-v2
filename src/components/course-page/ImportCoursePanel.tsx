import React from "react";
import styled from "styled-components";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const template = [
  {
    STT: 1,
    "Mã môn": "ADMP431879E",
    "Tên môn": "Advanced Programming for Mobile Devices",
    "Loại môn": "Lý thuyết",
    STC: "3",
  },
];

interface ImportCoursePanelProps {
  setShowImportCourseModal: (a: boolean) => void;
}

const ImportCoursePanel = (props: ImportCoursePanelProps) => {
  // handle export template
  const exportCSV = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "course_form_template" + fileExtension);
  };

  return (
    <StyledImportPanel>
      <Button onClick={() => props.setShowImportCourseModal(true)}>
        Import
      </Button>
      <Button onClick={exportCSV}>Download excel template</Button>
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

const Button = styled.button`
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

export default ImportCoursePanel;
