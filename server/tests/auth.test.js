import httpStatus from "http-status";
import request from "supertest";
import User from "../../src/models/userModel.js";
import app from "../../src/app.js";
import setupTestDB from "./utils/setupTestDB.js";
setupTestDB();
describe("Auth routes", () => {
  describe("POST /v1/auth/register", () => {
    let newUser;
    beforeEach(() => {
      newUser = {
        name: "Ron Nguyen",
        email: "roonn1@gmail.com",
        password: "password1",
        passwordConfirm: "password1",
      };
    });

    test("should return 201 and successfully register user if request data is ok", async () => {
      const res = await request(app)
        .post("/v1/auth/register")
        .send(newUser)
        .expect(httpStatus.CREATED);
      expect(res.body.user).not.toHaveProperty("password");
      expect(res.body.user).toMatchObject({
        _id: expect.anything(),
        name: newUser.name,
        email: newUser.email,
        photo: "default.jpg",
        role: "user",
      });

      const dbUser = await User.findById(res.body.user._id);

      expect(dbUser).toBeDefined();
      expect(dbUser.password).not.toBe(newUser.password);
      expect(dbUser).toMatchObject({
        name: newUser.name,
        email: newUser.email,
        role: "user",
      });

      expect(res.body.accessToken).toEqual(expect.anything());
      expect(res.body.refreshToken).toEqual(expect.anything());
    });

    test("should return 400 error if email is already used", async () => {
      const userOne = await User.create(newUser);
      expect(userOne).toBeDefined();
      const res = await request(app)
        .post("/v1/auth/register")
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
      expect(res.body.message).toEqual(
        `Duplicate field value: "${newUser.email}", Please use anthor value`
      );
    });

    test("should return 400 error if password length is less than 6 characters", async () => {
      newUser.password = "pas1";
      await request(app)
        .post("/v1/auth/register")
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 error if password does not contain both letters and numbers", async () => {
      newUser.password = "password";
      await request(app)
        .post("/v1/auth/register")
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);

      newUser.password = "11111111";
      await request(app)
        .post("/v1/auth/register")
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe("POST /v1/auth/login", () => {
    let newUser;
    beforeEach(() => {
      newUser = {
        name: "Ron Nguyen",
        email: "roonn1@gmail.com",
        password: "password1",
        passwordConfirm: "password1",
      };
    });
    test("should return 200 and login user if email and password match", async () => {
      const userOne = await User.create(newUser);
      const loginCredentials = {
        email: newUser.email,
        password: newUser.password,
      };
      const res = await request(app)
        .post("/v1/auth/login")
        .send(loginCredentials)
        .expect(httpStatus.OK);

      expect(res.body.user).toMatchObject({
        _id: expect.anything(),
        name: userOne.name,
        email: userOne.email,
        role: userOne.role,
      });

      expect(res.body.accessToken).toEqual(expect.anything());
      expect(res.body.refreshToken).toEqual(expect.anything());
    });

    test("should return 401 error if there are no users with that email", async () => {
      const loginCredentials = {
        email: newUser.email,
        password: newUser.password,
      };

      const res = await request(app)
        .post("/v1/auth/login")
        .send(loginCredentials)
        .expect(httpStatus.UNAUTHORIZED);
      expect(res.body).toEqual({
        code: httpStatus.UNAUTHORIZED,
        status: "fail",
        message: "Incorrect email or password",
      });
    });

    test("should return 401 error if password is wrong", async () => {
      const userOne = await User.create(newUser);
      const loginCredentials = {
        email: userOne.email,
        password: "wrongPass1",
      };

      const res = await request(app)
        .post("/v1/auth/login")
        .send(loginCredentials)
        .expect(httpStatus.UNAUTHORIZED);
      expect(res.body).toEqual({
        code: httpStatus.UNAUTHORIZED,
        status: "fail",
        message: "Incorrect email or password",
      });
    });
  });
});
