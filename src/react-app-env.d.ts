/// <reference types="react-scripts" />

export type Semester = {
  _id: string;
  semesterName: string;
  startDate: Date;
  numberOfWeeks: number;
  isOpening: boolean;
  updatedAt: Date;
  createdAt: Date;
  isHidden: boolean;
};

export type Teaching = {
  _id: string;
  user: string;
  course: string;
  group: number;
  dayOfWeek: number;
  startPeriod: number;
  endPeriod: number;
  numberOfStudents: number;
  theoryRoom: string;
  numberOfPracticalWeeks: number;
  registration: string;
  updatedAt: Date;
  createdAt: Date;
  isHidden: boolean;
};

export type Registration = {
  _id: string;
  batch: number;
  startDate: Date;
  endDate: Date;
  isOpening: boolean;
  semester: string;
  updatedAt: Date;
  createdAt: Date;
  isHidden: boolean;
};

export type Course = {
  _id: string;
  courseName: string;
  numberOfCredits: number;
  createdAt: Date;
  updatedAt: Date;
  isHidden: boolean;
};

export type RegistrableCourse = {
  _id: string;
  registration: string;
  course: string;
};

export type User = {
  _id: string;
  email: string;
  fullName: string;
  roles: "ADMIN" | "LECTURER";
  createdAt: Date;
  updatedAt: Date;
  isHidden: boolean;
};
