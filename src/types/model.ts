export enum ROLES {
  ADMIN,
  LECTURER,
}

export enum REQUEST_TYPES {
  MODIFY_LAB_USAGE = "MODIFY LAB USAGE",
  ADD_EXTRA_CLASS = "ADD EXTRA CLASS",
}

export enum REQUEST_STATUSES {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DENIED = "DENIED",
}

export type Semester = {
  _id: string;
  semesterName: string;
  startDate: Date;
  numberOfWeeks: number;
  isOpening: boolean;
  updatedAt: Date;
  createdAt: Date;
  labSchedule: number[][];
  isHidden: boolean;
};

export type Teaching = {
  _id: string;
  uId: string;
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
  avatarUrl: string;
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
  weekNo: number;
  dayOfWeek: number;
  startPeriod: number;
  endPeriod: number;
  createdAt: Date;
  updatedAt: Date;
  isHidden: boolean;
};

export type Request = {
  _id: string;
  lab: Lab | string;
  status: REQUEST_STATUSES;
  user: User | string;
  weekNo: number;
  dayOfWeek: number;
  startPeriod: number;
  endPeriod: number;
  labUsage?: LabUsage | string;
  teaching?: Teaching | string;
  title: string;
  description: string;
  type: REQUEST_TYPES;
  isHidden: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Comment = {
  _id: string;
  user: User | string;
  request: Request | string;
  text: string;
  isHidden: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
