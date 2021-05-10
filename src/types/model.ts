export enum ROLES {
  ADMIN,
  LECTURER,
}

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
  user: string | User;
  course: string | Course;
  group: number;
  dayOfWeek: number;
  startPeriod: number;
  endPeriod: number;
  numberOfStudents: number;
  theoryRoom: string;
  numberOfPracticalWeeks: number;
  registration: string | Registration;
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
  semester: string | Semester;
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
  _id?: string;
  registration: string | Registration;
  course: string | Course;
};

export type User = {
  _id: string;
  email: string;
  fullName: string;
  roles: ROLES[];
  createdAt: Date;
  updatedAt: Date;
  isHidden: boolean;
};

export type Lab = {
  _id: string;
  labName: string;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
  isHidden: boolean;
};

export type LabUsage = {
  _id: string;
  lab: string | Lab;
  teaching: string | Teaching;
  weekNo: string;
  dayOfWeek: number;
  startPeriod: Date;
  endPeriod: Date;
  createdAt: Date;
  updatedAt: Date;
  isHidden: boolean;
};
