import {
  createServer,
  Response,
  Model,
  Registry,
  RestSerializer,
} from "miragejs";
import { ModelDefinition } from "miragejs/-types";
import Schema from "miragejs/orm/schema";
import {
  Registration,
  Teaching,
  Semester,
  User,
  Course,
  RegistrableCourse,
} from "./react-app-env";
import { add } from "date-fns";
import _ from "lodash";

const SemesterModel: ModelDefinition<Semester> = Model.extend({});
const RegistrationModel: ModelDefinition<Registration> = Model.extend(
  {}
);
const TeachingModel: ModelDefinition<Teaching> = Model.extend({});
const UserModel: ModelDefinition<User> = Model.extend({});
const CourseModel: ModelDefinition<Course> = Model.extend({});
const RegistrableCourseModel: ModelDefinition<RegistrableCourse> = Model.extend(
  {}
);

type AppRegistry = Registry<
  {
    semester: typeof SemesterModel;
    registration: typeof RegistrationModel;
    teaching: typeof TeachingModel;
    user: typeof UserModel;
    course: typeof CourseModel;
    registrableCourse: typeof RegistrableCourseModel;
  },
  {}
>;
type AppSchema = Schema<AppRegistry>;

const server = () => {
  createServer({
    models: {
      semester: Model,
      registration: Model,
      teaching: Model,
      course: Model,
      user: Model,
      registrableCourse: Model,
    },
    serializers: {
      application: RestSerializer,
    },
    seeds(server) {
      server.db.loadData({
        semesters: [
          {
            _id: "semester-1",
            startDate: new Date(),
            semesterName: "Semester 2020-2021",
            numberOfWeeks: 15,
            isOpening: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            isHidden: false,
          },
        ],
        registrations: [
          {
            _id: "registration-1",
            batch: 1,
            startDate: new Date(),
            endDate: add(new Date(), { minutes: 1 }),
            isOpening: false,
            updatedAt: new Date(),
            createdAt: new Date(),
            semester: "semester-1",
          },
          {
            _id: "registration-2",
            batch: 2,
            startDate: new Date(),
            endDate: new Date(),
            isOpening: false,
            updatedAt: new Date(),
            createdAt: new Date(),
            semester: "semester-1",
          },
          {
            _id: "registration-3",
            batch: 3,
            startDate: new Date(),
            endDate: new Date(),
            isOpening: false,
            updatedAt: new Date(),
            createdAt: new Date(),
            semester: "semester-1",
          },
        ],
        courses: [
          {
            _id: "course-1",
            courseName: "Deep Learning",
            numberOfCredits: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
            isHidden: false,
          },
          {
            _id: "course-2",
            courseName: "Machine Learning",
            numberOfCredits: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
            isHidden: false,
          },
          {
            _id: "course-3",
            courseName: "Capstone Project",
            numberOfCredits: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
            isHidden: false,
          },
        ],
        registrableCourses: [
          {
            _id: "registrable-course-1",
            registration: "registration-1",
            course: "course-1",
          },
        ],
        teachings: [
          {
            _id: "teaching-1",
            user: "user-1",
            course: "course-1",
            group: 1,
            dayOfWeek: 1,
            startPeriod: 1,
            endPeriod: 3,
            numberOfStudents: 30,
            numberOfPracticalWeeks: 7,
            registration: "registration-1",
            createdAt: new Date(),
            updatedAt: new Date(),
            isHidden: false,
            theoryRoom: "A1-101",
          },
        ],
        users: [
          {
            _id: "user-1",
            email: "thinhle2199@gmail.com",
            fullName: "Le Duc Thinh",
            createdAt: new Date(),
            updatedAt: new Date(),
            roles: ["ADMIN"],
            isHidden: false,
          },
        ],
      });
    },
    routes() {
      this.namespace = "api/v1";
      this.get("/teachings", (schema: AppSchema, request) => {
        const registrationId = request.queryParams.registrationid;
        const teachings = schema.where("teaching", {
          registration: registrationId,
        });
        if (teachings.models.length > 0) {
          return {
            teachings: teachings.models,
            message: "Get teachings successfully",
            count: teachings.models.length,
          };
        }
        return new Response(
          404,
          { some: "header" },
          {
            registrations: [],
            message: "Cannot find any registrations",
            count: 0,
          }
        );
      });
      this.post("/semester", (schema: AppSchema, request) => {
        let attrs = JSON.parse(request.requestBody);
        attrs._id = "semester-1";
        attrs.createdAt = new Date();
        attrs.updatedAt = new Date();

        return {
          semester: schema.create("semester", attrs),
          message: "Create semester successfully",
          count: 1,
        };
      });
      this.put(
        "/semester/:semesterid",
        (schema: AppSchema, request) => {
          let attrs = JSON.parse(request.requestBody);
          const semester = schema.findBy("semester", {
            _id: request.params.semesterid,
          });
          if (semester) {
            semester.update({ ...attrs });
            return {
              semester,
              message: "Update semester successfully",
              count: 1,
            };
          }

          return new Response(
            422,
            { some: "header" },
            {
              semester: null,
              message: "Object sent did not match",
              count: 0,
            }
          );
        }
      );
      this.get("/semester", (schema: AppSchema, request) => {
        let isOpening = request.queryParams.isopening;
        const semester = schema.findBy("semester", {
          isOpening: isOpening === "true",
        });
        if (semester) {
          return {
            semester,
            message: "Get semester successfully",
            count: 1,
          };
        }
        return new Response(
          404,
          { some: "header" },
          {
            semester: null,
            message: "Cannot find semester",
            count: 0,
          }
        );
      });
      this.get("/registrations", (schema: AppSchema, request) => {
        let semesterId = request.queryParams.semesterid;
        const registrations = schema.where("registration", {
          semester: semesterId,
        });
        if (registrations.models.length > 0) {
          return {
            registrations: registrations.models,
            message: "Get registrations successfully",
            count: registrations.models.length,
          };
        }
        return new Response(
          404,
          { some: "header" },
          {
            registrations: [],
            message: "Cannot find any registrations",
            count: 0,
          }
        );
      });
      this.post("/registrations", (schema: AppSchema, request) => {
        let attrs = JSON.parse(request.requestBody);
        attrs._id = "registration-4";
        attrs.createdAt = new Date();
        attrs.updatedAt = new Date();

        const result = schema.create("registration", attrs);

        return {
          registrations: [{ ...result.attrs }],
          message: "Create registration successfully",
          count: 1,
        };
      });
      this.get(
        "/registrable-courses",
        (schema: AppSchema, request) => {
          let registrationId = request.queryParams.registrationId;
          const registrableCourses = schema.where(
            "registrableCourse",
            {
              registration: registrationId,
            }
          );
          if (registrableCourses.models.length > 0) {
            return {
              registrableCourses: registrableCourses.models,
              message: "Get registrable courses successfully",
              count: registrableCourses.models.length,
            };
          }
          return new Response(
            404,
            { some: "header" },
            {
              registrableCourses: [],
              message: "Cannot find any registrable courses",
              count: 0,
            }
          );
        }
      );
      this.post(
        "/registrable-courses",
        (schema: AppSchema, request) => {
          let attrs = JSON.parse(request.requestBody);
          attrs._id = "registrable-course-2";
          attrs.createdAt = new Date();
          attrs.updatedAt = new Date();

          const result = schema.create("registrableCourse", attrs);

          return {
            registrableCourses: [{ ...result.attrs }],
            message: "Create registrable course successfully",
            count: 1,
          };
        }
      );
      this.get("/courses", (schema: AppSchema, request) => {
        const courses = schema.all("course");

        if (courses.models.length > 0) {
          return {
            courses: courses.models,
            message: "Get courses successfully",
            count: courses.models.length,
          };
        }
        return new Response(
          404,
          { some: "header" },
          {
            courses: [],
            message: "Cannot find any courses",
            count: 0,
          }
        );
      });
      this.post("/courses", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        attrs.createdAt = new Date();
        attrs.updatedAt = new Date();

        const result = schema.create("course", attrs);

        return {
          courses: [{ ...result.attrs }],
          message: "Create course successfully",
          count: 1,
        };
      });
      this.get("/users", (schema: AppSchema, request) => {
        const users = schema.all("user");

        if (users.models.length > 0) {
          return {
            users: users.models,
            message: "Get users successfully",
            count: users.models.length,
          };
        }
        return new Response(
          404,
          { some: "header" },
          {
            users: [],
            message: "Cannot find any users",
            count: 0,
          }
        );
      });
    },
  });
};

export default server;
