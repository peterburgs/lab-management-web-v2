import React, { MouseEventHandler, useEffect, useState } from "react";
import styled from "styled-components";
import { ModalProps } from "../../../types/modal";
import Modal from "../common/Modal";
import SearchBar from "../common/SearchBar";
import CheckboxList, { CheckboxItem } from "../common/CheckboxList";
import { Course } from "../../react-app-env";

interface SelectCourseModalProps extends ModalProps {
  selectedCourses: CheckboxItem[];
  courses: Course[];
  handleSelectCourse: (
    item: CheckboxItem
  ) => MouseEventHandler<HTMLDivElement>;
}

const SelectCourseModal = ({
  courses,
  selectedCourses,
  setShowModal,
  showModal,
  name,
  handleSelectCourse,
}: SelectCourseModalProps) => {
  const [searchResultCourses, setSearchResultCourses] = useState<
    CheckboxItem[]
  >([]);
  const [searchCourseText, setSearchCourseText] = useState("");

  useEffect(() => {
    setSearchResultCourses(
      courses
        .map((course) => {
          return { _id: course._id, name: course.courseName };
        })
        .filter((item) =>
          searchCourseText === ""
            ? true
            : item.name.includes(searchCourseText)
        )
    );
  }, [courses, searchCourseText]);

  return (
    <Modal
      setShowModal={setShowModal}
      showModal={showModal}
      name={name}
      style={{
        overlay: { zIndex: 1000, overflowY: "auto", height: "100vh" },
      }}
    >
      <SearchBar
        setSearchText={setSearchCourseText}
        placeholder="Enter course name"
      />
      <CheckboxList
        selectedItems={selectedCourses}
        onSelectItem={handleSelectCourse}
        items={searchResultCourses}
      />
    </Modal>
  );
};

const CheckboxListContainer = styled.div`
  max-height: 500px;
  overflow: auto;
`;

export default SelectCourseModal;
