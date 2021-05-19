export enum ROLES {
  ADMIN,
  LECTURER,
}

export enum REQUEST_TYPES {
  MODIFY_LAB_USAGE,
  ADD_EXTRA_CLASS,
}

export enum REQUEST_STATUSES {
  PENDING,
  APPROVED,
  DENIED,
}

export enum ACTIONS {
  CREATE,
  GET,
  DELETE,
  UPDATE,
  LOGIN,
  REGISTER,
}

export enum COURSE_TYPES {
  PRACTICAL,
  THEORY,
}

export enum SEMESTER_STATUSES {
  CLOSED,
  OPENING,
  FUTURE,
}

export type Semester = {
  _id?: string;
  semesterName: string;
  index: number;
  startDate?: Date;
  numberOfWeeks: number;
  status: SEMESTER_STATUSES;
  updatedAt?: Date;
  createdAt?: Date;
  academicYear: AcademicYear | string;
  labSchedule?: number[][];
  isHidden: boolean;
};

export type Teaching = {
  _id: string;
  uId: string;
  user: string | User;
  course: string | Course;
  class: string;
  group: number;
  dayOfWeek: number;
  startPeriod: number;
  endPeriod: number;
  numberOfStudents: number;
  theoryRoom: string;
  numberOfPracticalWeeks: number;
  registration: string | Registration;
  updatedAt?: Date;
  createdAt?: Date;
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
  type: COURSE_TYPES;
  createdAt?: Date;
  updatedAt?: Date;
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
  _id?: string;
  lab: string | Lab;
  teaching: string | Teaching;
  weekNo: number;
  dayOfWeek: number;
  startPeriod: number;
  endPeriod: number;
  createdAt?: Date;
  updatedAt?: Date;
  isHidden: boolean;
  semester: string;
};

export type Request = {
  _id: string;
  lab: Lab | string;
  status: REQUEST_STATUSES;
  user: User | string;
  uId?: string;
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
  _id?: string;
  user?: User | string;
  uId?: string;
  request: Request | string;
  text: string;
  isHidden: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type AcademicYear = {
  _id: string;
  name: string;
  numberOfWeeks: number;
  startDate: Date;
  endDate: Date;
  isOpening: boolean;
  isHidden: boolean;
};
