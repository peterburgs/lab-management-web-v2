import { createServer } from "miragejs";

const server = () => {
  createServer({
    routes() {
      this.get("/api/teachings/registration-1", () => ({
        teachings: [
          {
            _id: "teaching-1",
            user: {
              _id: "user-1",
              email: "thinhle2199@gmail.com",
              fullName: "Le Duc Thinh",
              createdAt: new Date(),
              updatedAt: new Date(),
              roles: ["ADMIN"],
              isHidden: false,
            },
            course: {
              _id: "course-1",
              courseName: "Deep Learning",
              numberOfCredits: 3,
              createdAt: new Date(),
              updatedAt: new Date(),
              isHidden: false,
            },
            group: 1,
            dayOfWeek: 1,
            startPeriod: 1,
            endPeriod: 3,
            numberOfStudents: 30,
            numberOfPracticalWeeks: 7,
            registration: {
              _id: "registration-1",
              batch: 1,
              startDate: new Date(),
              endDate: new Date(),
              isOpening: true,
              semester: {
                _id: "semester 2020-2021",
                startDate: new Date(),
                semesterName: "Semester 1",
                numberOfWeeks: 15,
                isOpening: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                isHidden: false,
              },
              createdAt: new Date(),
              updatedAt: new Date(),
              isHidden: false,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            isHidden: false,
            theoryRoom: "A1-101",
          },
        ],
      }));
      this.get("/api/semester/open", () => ({
        semester: {
          _id: "semester-1",
          startDate: new Date(),
          semesterName: "Semester 2020-2021",
          numberOfWeeks: 15,
          isOpening: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          isHidden: false,
        },
      }));
      this.get("/api/registrations/semester-1", () => ({
        registrations: [
          // {
          //   _id: "registration-1",
          //   batch: 1,
          //   startDate: new Date(),
          //   endDate: new Date(),
          //   isOpening: true,
          //   semester: "semester-1",
          // },
        ],
      }));
    },
  });
};

export default server;
