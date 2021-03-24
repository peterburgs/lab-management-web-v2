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
  user: User;
  course: Course;
  group: number;
  dayOfWeek: number;
  startPeriod: number;
  endPeriod: number;
  numberOfStudents: number;
  theoryRoom: string;
  numberOfPracticalWeeks: number;
  registration: Registration;
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
  semester: Semester;
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

export type User = {
  _id: string;
  email: string;
  fullName: string;
  roles: UserRole[];
  createdAt: Date;
  updatedAt: Date;
  isHidden: boolean;
};
