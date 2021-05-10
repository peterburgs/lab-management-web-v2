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
  Lab,
  ROLES,
} from "./types/model";
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
const LabModel: ModelDefinition<Lab> = Model.extend({});

type AppRegistry = Registry<
  {
    semester: typeof SemesterModel;
    registration: typeof RegistrationModel;
    teaching: typeof TeachingModel;
    user: typeof UserModel;
    course: typeof CourseModel;
    registrableCourse: typeof RegistrableCourseModel;
    lab: typeof LabModel;
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
      lab: Model,
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
            endDate: add(new Date(), { minutes: 30 }),
            isOpening: true,
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
        labs: [
          {
            _id: "lab-1",
            labName: "Lab 1",
            capacity: 30,
            createdAt: new Date(),
            updatedAt: new Date(),
            isHidden: false,
          },
          {
            _id: "lab-2",
            labName: "Lab 2",
            capacity: 20,
            createdAt: new Date(),
            updatedAt: new Date(),
            isHidden: false,
          },
          {
            _id: "lab-3",
            labName: "Lab 3",
            capacity: 10,
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
          {
            _id: "registrable-course-2",
            registration: "registration-1",
            course: "course-2",
          },
          {
            _id: "registrable-course-3",
            registration: "registration-1",
            course: "course-3",
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
          {
            _id: "teaching-2",
            user: "user-1",
            course: "course-2",
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
            email: "17110076@student.hcmute.edu.vn",
            fullName: "Le Duc Thinh",
            createdAt: new Date(),
            updatedAt: new Date(),
            roles: [0, 1],
            isHidden: false,
          },
          {
            _id: "user-2",
            email: "17110003@student.hcmute.edu.vn",
            fullName: "Trinh Minh Anh",
            createdAt: new Date(),
            updatedAt: new Date(),
            roles: [0, 1],
            isHidden: false,
          },
        ],
      });
    },
    routes() {
      this.namespace = "api/v1";

      // Teaching route
      this.get("/teachings", (schema: AppSchema, request) => {
        const teachings = schema.where("teaching", {
          ...request.queryParams,
          isHidden: false,
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
            teachings: [],
            message: "Cannot find any teachings",
            count: 0,
          }
        );
      });
      this.post("/teachings", (schema: AppSchema, request) => {
        let attrs = JSON.parse(request.requestBody);
        attrs._id = "teaching-3";
        attrs.createdAt = new Date();
        attrs.updatedAt = new Date();

        return {
          teaching: schema.create("teaching", attrs),
          message: "Create teaching successfully",
        };
      });
      this.post("/teachings/bulk", (schema: AppSchema, request) => {
        let teachings = JSON.parse(request.requestBody) as Teaching[];

        teachings = teachings.map((teaching, index) => {
          const data = {
            ...teaching,
            _id: `teaching-${teachings.length + index}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          schema.create("teaching", data);
          return data;
        });

        return {
          teachings,
          message: "Create all teachings successfully",
        };
      });
      this.put(
        "/teachings/:teachingid",
        (schema: AppSchema, request) => {
          let attrs = JSON.parse(request.requestBody);
          const teaching = schema.findBy("teaching", {
            _id: request.params.teachingid,
          });
          if (teaching) {
            teaching.update({ ...attrs });
            return {
              teaching,
              message: "Update teaching successfully",
            };
          }

          return new Response(
            422,
            { some: "header" },
            {
              teaching: null,
              message: "Object sent did not match",
            }
          );
        }
      );
      this.delete(
        "/teachings/:teachingid",
        (schema: AppSchema, request) => {
          const teaching = schema.findBy("teaching", {
            _id: request.params.teachingid,
          });
          if (teaching) {
            teaching.update({ isHidden: true });
            return {
              teaching,
              message: "Delete teaching successfully",
            };
          }

          return new Response(
            500,
            { some: "header" },
            {
              teaching: null,
              message: "Something went wrong",
            }
          );
        }
      );

      // Semester route
      this.get("/semesters", (schema: AppSchema, request) => {
        const semesters = schema.where("semester", {
          ...request.queryParams,
        });
        if (semesters.models.length > 0) {
          return {
            semesters: semesters.models,
            message: "Get semesters successfully",
            count: semesters.models.length,
          };
        }
        return new Response(
          404,
          { some: "header" },
          {
            semesters: [],
            message: "Cannot find any semesters",
            count: 0,
          }
        );
      });
      this.post("/semesters", (schema: AppSchema, request) => {
        let attrs = JSON.parse(request.requestBody);
        attrs._id = "semester-1";
        attrs.createdAt = new Date();
        attrs.updatedAt = new Date();

        return {
          semester: schema.create("semester", attrs),
          message: "Create semester successfully",
        };
      });
      this.put(
        "/semesters/:semesterid",
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
            };
          }

          return new Response(
            422,
            { some: "header" },
            {
              semester: null,
              message: "Object sent did not match",
            }
          );
        }
      );

      // Registration route
      this.get("/registrations", (schema: AppSchema, request) => {
        const registrations = schema.where("registration", {
          ...request.queryParams,
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
        attrs._id = "registration-3";
        attrs.createdAt = new Date();
        attrs.updatedAt = new Date();

        return {
          registration: schema.create("registration", attrs),
          message: "Create registration successfully",
        };
      });
      this.put(
        "/registrations/:registrationid",
        (schema: AppSchema, request) => {
          let attrs = JSON.parse(request.requestBody);
          const registration = schema.findBy("registration", {
            _id: request.params.registrationid,
          });
          if (registration) {
            registration.update({ ...attrs });
            return {
              registration,
              message: "Update registration successfully",
            };
          }

          return new Response(
            422,
            { some: "header" },
            {
              registration: null,
              message: "Object sent did not match",
            }
          );
        }
      );

      // Registrable course route
      this.get(
        "/registrable-courses",
        (schema: AppSchema, request) => {
          const registrableCourses = schema.where(
            "registrableCourse",
            {
              ...request.queryParams,
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

          return {
            registrableCourse: schema.create(
              "registrableCourse",
              attrs
            ),
            message: "Create registrable course successfully",
          };
        }
      );

      // Course route
      this.get("/courses", (schema: AppSchema, request) => {
        const courses = schema.where("course", {
          ...request.queryParams,
          isHidden: false,
        });

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

        return {
          course: schema.create("course", attrs),
          message: "Create course successfully",
        };
      });
      this.put("/courses/:courseid", (schema: AppSchema, request) => {
        let attrs = JSON.parse(request.requestBody);
        const course = schema.findBy("course", {
          _id: request.params.courseid,
        });
        if (course) {
          course.update({ ...attrs });
          return {
            course,
            message: "Update course successfully",
          };
        }

        return new Response(
          422,
          { some: "header" },
          {
            course: null,
            message: "Object sent did not match",
          }
        );
      });
      this.delete(
        "/courses/:courseid",
        (schema: AppSchema, request) => {
          const course = schema.findBy("course", {
            _id: request.params.courseid,
          });
          if (course) {
            course.update({ isHidden: true });
            return {
              course,
              message: "Delete course successfully",
            };
          }

          return new Response(
            500,
            { some: "header" },
            {
              course: null,
              message: "Something went wrong",
            }
          );
        }
      );

      // Lab route
      this.get("/labs", (schema: AppSchema, request) => {
        const labs = schema.where("lab", {
          ...request.queryParams,
          isHidden: false,
        });

        if (labs.models.length > 0) {
          return {
            labs: labs.models,
            message: "Get labs successfully",
            count: labs.models.length,
          };
        }
        return new Response(
          404,
          { some: "header" },
          {
            labs: [],
            message: "Cannot find any labs",
            count: 0,
          }
        );
      });
      this.post("/labs", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        attrs._id = "lab-4";
        attrs.createdAt = new Date();
        attrs.updatedAt = new Date();

        return {
          lab: schema.create("lab", attrs),
          message: "Create lab successfully",
        };
      });
      this.put("/labs/:labid", (schema: AppSchema, request) => {
        let attrs = JSON.parse(request.requestBody);
        const lab = schema.findBy("lab", {
          _id: request.params.labid,
        });
        if (lab) {
          lab.update({ ...attrs });
          return {
            lab,
            message: "Update lab successfully",
          };
        }

        return new Response(
          422,
          { some: "header" },
          {
            course: null,
            message: "Object sent did not match",
          }
        );
      });
      this.delete("/labs/:labid", (schema: AppSchema, request) => {
        const lab = schema.findBy("lab", {
          _id: request.params.labid,
        });
        if (lab) {
          lab.update({ isHidden: true });
          return {
            lab,
            message: "Delete lab successfully",
          };
        }

        return new Response(
          500,
          { some: "header" },
          {
            course: null,
            message: "Something went wrong",
          }
        );
      });

      // User route
      this.get("/users", (schema: AppSchema, request) => {
        const users = schema.where("user", {
          ...request.queryParams,
          isHidden: false,
        });

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
            message: "Cannot find any user",
            count: 0,
          }
        );
      });
      this.post("/users", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        attrs.createdAt = new Date();
        attrs.updatedAt = new Date();

        return {
          user: schema.create("user", attrs),
          message: "Create user successfully",
        };
      });
      this.put("/users/:userid", (schema: AppSchema, request) => {
        let attrs = JSON.parse(request.requestBody);
        const user = schema.findBy("user", {
          _id: request.params.userid,
        });
        if (user) {
          user.update({ ...attrs });
          return {
            user,
            message: "Update user successfully",
          };
        }

        return new Response(
          422,
          { some: "header" },
          {
            user: null,
            message: "Object sent did not match",
          }
        );
      });
      this.delete("/users/:userid", (schema: AppSchema, request) => {
        const user = schema.findBy("user", {
          _id: request.params.userid,
        });
        if (user) {
          user.update({ isHidden: true });
          return {
            user,
            message: "Delete user successfully",
          };
        }

        return new Response(
          500,
          { some: "header" },
          {
            course: null,
            message: "Something went wrong",
          }
        );
      });

      // Auth route
      this.get("/auth", (schema: AppSchema, request) => {
        let email = "17110076@student.hcmute.edu.vn"; // get from token
        let role = Number(request.queryParams.role);
        let token = request.requestHeaders.Authorization.split(
          " "
        )[1];

        const users = schema.where("user", {
          email: email,
        });
        if (users.models.length > 0) {
          if (
            users.models[0].roles.indexOf(
              role === 0 ? ROLES.ADMIN : ROLES.LECTURER
            ) !== -1
          )
            return {
              verifiedUser: users.models[0],
              avatarUrl:
                "https://lh4.googleusercontent.com/-8dPdj1_5_8I/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucliLTUwmZKoDHXKqKQztraa2HWHWg/s96-c/photo.jpg",
              verifiedRole: role,
              verifiedToken: token,
            };
        }
        return new Response(
          401,
          { some: "header" },
          {
            verifiedUser: null,
            avatarUrl: null,
            verifiedRole: null,
            verifiedToken: null,
          }
        );
      });
    },
  });
};

export default server;
