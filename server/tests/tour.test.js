import httpStatus from "http-status";
import slugify from "slugify";
import request from "supertest";
import Tour from "../src/models/tourModel";
import User from "../src/models/userModel";
import app from "../src/app.js";
import mongoose, { isValidObjectId, ObjectId } from "mongoose";

import setupTestDB from "./utils/setupTestDB.js";
setupTestDB();
describe("Tour routes", () => {
  describe("POST /v1/tours", () => {
    let newTour;
    let oneAcount;
    let slug;

    beforeEach(() => {
      newTour = {
        name: "Sun World Ba Na Hills",
        duration: 2,
        maxGroupSize: 20,
        difficulty: "Trung bình",
        price: 10000000,
        summary: "Bà Nà là quần thể du lịch nghỉ dưỡng toạ",
        description:
          "Bà Nà là quần thể du lịch nghỉ dưỡng toạ lạc tại khu vực thuộc dãy Trường Sơn nằm ở xã Hoà Ninh, Huyện Hòa Vang, cách trung tâm Đà Nẵng khoảng 25km về phía Tây Nam.",
        location: "Tuyến cáp treo lên Bà Nà Hills, Hoà Ninh, Hòa Vang, Đà Nẵng",
      };
      slug = slugify(newTour.name, {
        lower: true,
        upper: true,
        locale: "vi",
        trim: true,
      });
      oneAcount = {
        name: "Ron",
        email: "roon@gmail.com",
        password: "pass123",
        passwordConfirm: "pass123",
      };
    });

    test("should return 201 and successfully create new tour if data is ok only admin is created", async () => {
      const admin = await User.create({ ...oneAcount, role: "admin" });
      expect(admin.role).toBe("admin");

      const loginCredentials = {
        email: oneAcount.email,
        password: oneAcount.password,
      };
      const login = await request(app)
        .post("/v1/auth/login")
        .send(loginCredentials)
        .expect(httpStatus.OK);

      expect(login.body.user).toHaveProperty("role", "admin");

      const res = await request(app)
        .post("/v1/tours")
        .auth(login.body.accessToken, { type: "bearer" })
        .send(newTour)
        .expect(httpStatus.CREATED);

      expect(res.body.status).toEqual("success");

      expect(res.body.data).toMatchObject({
        _id: expect.anything(),
        ...newTour,
        slug,
      });

      const dbTour = await Tour.findById(res.body.data.id);
      expect(dbTour).toBeDefined();
      expect(dbTour).toMatchObject({
        _id: expect.anything(),
        ...newTour,
        slug,
      });
    });

    test("should return 401 error if access token is missing", async () => {
      await request(app)
        .post("/v1/tours")
        .send(newTour)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test("should return 403 error if logged in user is not admin", async () => {
      await User.create(oneAcount);
      const loginCredentials = {
        email: oneAcount.email,
        password: oneAcount.password,
      };
      const login = await request(app)
        .post("/v1/auth/login")
        .send(loginCredentials)
        .expect(httpStatus.OK);

      await request(app)
        .post("/v1/tours")
        .auth(login.body.accessToken, { type: "bearer" })
        .expect(httpStatus.FORBIDDEN);
    });
  });
  describe("GET /v1/tours/:tourId", () => {
    let newTour;
    let slug;
    let oneAcount;
    beforeEach(() => {
      newTour = {
        name: "Sun World Ba Na Hills",
        duration: 2,
        maxGroupSize: 20,
        difficulty: "Trung bình",
        price: 10000000,
        summary: "Bà Nà là quần thể du lịch nghỉ dưỡng toạ",
        description:
          "Bà Nà là quần thể du lịch nghỉ dưỡng toạ lạc tại khu vực thuộc dãy Trường Sơn nằm ở xã Hoà Ninh, Huyện Hòa Vang, cách trung tâm Đà Nẵng khoảng 25km về phía Tây Nam.",
        location: "Tuyến cáp treo lên Bà Nà Hills, Hoà Ninh, Hòa Vang, Đà Nẵng",
      };
      slug = slugify(newTour.name, {
        lower: true,
        upper: true,
        locale: "vi",
        trim: true,
      });
      oneAcount = {
        name: "Ron",
        email: "roon@gmail.com",
        password: "pass123",
        passwordConfirm: "pass123",
      };
    });

    test("should return 200 and the tour object if data is ok", async () => {
      const tour = await Tour.create(newTour);

      const res = await request(app)
        .get(`/v1/tours/${tour.id}`)
        .expect(httpStatus.OK);
      expect(res.body.data).toMatchObject({
        _id: expect.anything(),
        ...newTour,
        slug,
      });
    });

    test("should return 400 error if tourId is not a valid mongo id", async () => {
      await request(app)
        .get("/v1/tours/invalidId")
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 404 error if tour is not found", async () => {
      const id = await mongoose.Types.ObjectId();
      await request(app).get(`/v1/tours/${id}`).expect(httpStatus.NOT_FOUND);
    });
  });
  describe("GET /v1/tours", () => {
    let newTour;
    let newTour1;
    let newTour2;
    beforeEach(() => {
      newTour = {
        name: "Sun World Ba Na Hills",
        duration: 2,
        maxGroupSize: 20,
        difficulty: "Trung bình",
        price: 10000000,
        summary: "Bà Nà là quần thể du lịch nghỉ dưỡng toạ",
        description:
          "Bà Nà là quần thể du lịch nghỉ dưỡng toạ lạc tại khu vực thuộc dãy Trường Sơn nằm ở xã Hoà Ninh, Huyện Hòa Vang, cách trung tâm Đà Nẵng khoảng 25km về phía Tây Nam.",
        location: "Tuyến cáp treo lên Bà Nà Hills, Hoà Ninh, Hòa Vang, Đà Nẵng",
      };
      newTour1 = {
        name: "Sun World Ba Na Hills111",
        duration: 2,
        maxGroupSize: 20,
        difficulty: "Trung bình",
        price: 10000000,
        summary: "Bà Nà là quần thể du lịch nghỉ dưỡng toạ",
        description:
          "Bà Nà là quần thể du lịch nghỉ dưỡng toạ lạc tại khu vực thuộc dãy Trường Sơn nằm ở xã Hoà Ninh, Huyện Hòa Vang, cách trung tâm Đà Nẵng khoảng 25km về phía Tây Nam.",
        location: "Tuyến cáp treo lên Bà Nà Hills, Hoà Ninh, Hòa Vang, Đà Nẵng",
      };
      newTour2 = {
        name: "Sun World Ba Na Hills2222",
        duration: 2,
        maxGroupSize: 20,
        difficulty: "Trung bình",
        price: 9000000,
        summary: "Bà Nà là quần thể du lịch nghỉ dưỡng toạ",
        description:
          "Bà Nà là quần thể du lịch nghỉ dưỡng toạ lạc tại khu vực thuộc dãy Trường Sơn nằm ở xã Hoà Ninh, Huyện Hòa Vang, cách trung tâm Đà Nẵng khoảng 25km về phía Tây Nam.",
        location: "Tuyến cáp treo lên Bà Nà Hills, Hoà Ninh, Hòa Vang, Đà Nẵng",
      };
    });
    test("should return 200 and apply the default query options", async () => {
      await Tour.insertMany([newTour, newTour1, newTour2]);
      const res = await request(app).get("/v1/tours").expect(httpStatus.OK);

      expect(res.body).toEqual({
        code: 200,
        status: "success",
        data: expect.any(Array),
        page: 1,
        limit: 10,
        totalRows: 3,
      });
      expect(res.body.data).toHaveLength(3);
      expect(res.body.data[1]).toMatchObject({
        id: expect.anything(),
        ...newTour1,
      });
    });

    test("should correctly apply filter on name field", async () => {
      await Tour.insertMany([newTour, newTour1, newTour2]);

      const res = await request(app)
        .get("/v1/tours")
        .query({ name: newTour.name })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        code: 200,
        status: "success",
        data: expect.any(Array),
        page: 1,
        limit: 10,
        totalRows: 3,
      });
      expect(res.body.data).toHaveLength(1);
      expect(isValidObjectId(res.body.data[0].id)).toBeTruthy();
    });

    test("should correctly apply filter on price field", async () => {
      await Tour.insertMany([newTour, newTour1, newTour2]);
      const res = await request(app)
        .get("/v1/tours")
        .query({ price: 10000000 })
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        code: 200,
        status: "success",
        data: expect.any(Array),
        page: 1,
        limit: 10,
        totalRows: 3,
      });
      expect(res.body.data).toHaveLength(2);

      expect(isValidObjectId(res.body.data[0].id)).toBeTruthy();
      expect(isValidObjectId(res.body.data[1].id)).toBeTruthy();
    });

    test("should correctly sort the returned array if descending sort param is specified", async () => {
      await Tour.insertMany([newTour, newTour1, newTour2]);

      const res = await request(app)
        .get("/v1/tours")
        .query({ sortBy: "-price" })
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        code: 200,
        status: "success",
        data: expect.any(Array),
        page: 1,
        limit: 10,
        totalRows: 3,
      });
      expect(res.body.data).toHaveLength(3);
      expect(res.body.data[0].name).toBe(newTour1.name);
      expect(res.body.data[1].name).toBe(newTour.name);
      expect(res.body.data[2].name).toBe(newTour2.name);
    });

    test("should correctly sort the returned array if ascending sort param is specified", async () => {
      await Tour.insertMany([newTour, newTour1, newTour2]);

      const res = await request(app)
        .get("/v1/tours")
        .query({ sortBy: "price" })
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        code: 200,
        status: "success",
        data: expect.any(Array),
        page: 1,
        limit: 10,
        totalRows: 3,
      });
      expect(res.body.data).toHaveLength(3);
      expect(res.body.data[0].name).toBe(newTour2.name);
      expect(res.body.data[1].name).toBe(newTour.name);
      expect(res.body.data[2].name).toBe(newTour1.name);
    });

    test("should correctly sort the returned array if multiple sorting criteria are specified", async () => {
      await Tour.insertMany([newTour, newTour1, newTour2]);
      const res = await request(app)
        .get("/v1/tours")
        .query({ sortBy: "-price,name" })
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        code: 200,
        status: "success",
        data: expect.any(Array),
        page: 1,
        limit: 10,
        totalRows: 3,
      });
      expect(res.body.data).toHaveLength(3);

      const expectedOrder = [newTour, newTour1, newTour2].sort((a, b) => {
        if (a.price < b.price) {
          return 1;
        }
        if (a.price > b.price) {
          return -1;
        }
        return a.name < b.name ? -1 : 1;
      });

      expectedOrder.forEach((user, index) => {
        expect(isValidObjectId(res.body.data[index].id)).toBeTruthy();
      });
    });

    test("should return the correct page if page and limit params are specified", async () => {
      await Tour.insertMany([newTour, newTour1, newTour2]);
      const res = await request(app)
        .get("/v1/tours")
        .query({ page: 2, limit: 2 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        code: 200,
        status: "success",
        data: expect.any(Array),
        page: 2,
        limit: 2,
        totalRows: 3,
      });
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].name).toBe(newTour2.name);
    });
  });
  describe("PATCH /v1/tours/:tourId", () => {
    let newTour;
    let newTour1;
    let oneAcount;
    beforeEach(() => {
      newTour = {
        name: "Sun World Ba Na Hills",
        duration: 2,
        maxGroupSize: 20,
        difficulty: "Trung bình",
        price: 10000000,
        summary: "Bà Nà là quần thể du lịch nghỉ dưỡng toạ",
        description:
          "Bà Nà là quần thể du lịch nghỉ dưỡng toạ lạc tại khu vực thuộc dãy Trường Sơn nằm ở xã Hoà Ninh, Huyện Hòa Vang, cách trung tâm Đà Nẵng khoảng 25km về phía Tây Nam.",
        location: "Tuyến cáp treo lên Bà Nà Hills, Hoà Ninh, Hòa Vang, Đà Nẵng",
      };
      newTour1 = {
        name: "Sun World Ba Na Hills111",
        duration: 2,
        maxGroupSize: 20,
        difficulty: "Trung bình",
        price: 10000000,
        summary: "Bà Nà là quần thể du lịch nghỉ dưỡng toạ",
        description:
          "Bà Nà là quần thể du lịch nghỉ dưỡng toạ lạc tại khu vực thuộc dãy Trường Sơn nằm ở xã Hoà Ninh, Huyện Hòa Vang, cách trung tâm Đà Nẵng khoảng 25km về phía Tây Nam.",
        location: "Tuyến cáp treo lên Bà Nà Hills, Hoà Ninh, Hòa Vang, Đà Nẵng",
      };
      oneAcount = {
        name: "Ron",
        email: "roon@gmail.com",
        password: "pass123",
        passwordConfirm: "pass123",
      };
    });

    test("should return 200 and successfully update tour if data is ok and only admin", async () => {
      const admin = await User.create({ ...oneAcount, role: "admin" });
      expect(admin.role).toBe("admin");

      const loginCredentials = {
        email: oneAcount.email,
        password: oneAcount.password,
      };
      const login = await request(app)
        .post("/v1/auth/login")
        .send(loginCredentials)
        .expect(httpStatus.OK);
      const tour = await Tour.create(newTour);
      const updateBody = {
        name: "Test New Name",
        price: 123456,
        maxGroupSize: 16,
      };

      const res = await request(app)
        .patch(`/v1/tours/${tour._id}`)
        .auth(login.body.accessToken, { type: "bearer" })
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body.data).toMatchObject({
        id: tour._id,
        name: updateBody.name,
        price: updateBody.price,
        maxGroupSize: updateBody.maxGroupSize,
      });

      const dbTour = await Tour.findById(tour._id);
      expect(dbTour).toBeDefined();
      expect(dbTour).toMatchObject({
        name: updateBody.name,
        price: updateBody.price,
        maxGroupSize: updateBody.maxGroupSize,
      });
    });

    test("should return 403 error if logged in user is not admin", async () => {
      const admin = await User.create({ ...oneAcount });
      expect(admin.role).toBe("user");

      const loginCredentials = {
        email: oneAcount.email,
        password: oneAcount.password,
      };
      const login = await request(app)
        .post("/v1/auth/login")
        .send(loginCredentials)
        .expect(httpStatus.OK);
      const tour = await Tour.create(newTour);
      const updateBody = {
        name: "Test New Name",
        price: 123456,
        maxGroupSize: 16,
      };

      await request(app)
        .patch(`/v1/tours/${tour._id}`)
        .auth(login.body.accessToken, { type: "bearer" })
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test("should return 401 error if access token is missing or invalid", async () => {
      const tour = await Tour.create(newTour);
      const updateBody = { name: "Test New Name" };

      await request(app)
        .patch(`/v1/tours/${tour._id}`)
        .send(updateBody)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test("should return 400 error if tourId is not a valid mongo id", async () => {
      const admin = await User.create({ ...oneAcount, role: "admin" });
      expect(admin.role).toBe("admin");

      const loginCredentials = {
        email: oneAcount.email,
        password: oneAcount.password,
      };
      const login = await request(app)
        .post("/v1/auth/login")
        .send(loginCredentials)
        .expect(httpStatus.OK);
      const updateBody = { name: "Test new name" };

      await request(app)
        .patch(`/v1/tours/invalidId`)
        .auth(login.body.accessToken, { type: "bearer" })
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 if name is already taken", async () => {
      const admin = await User.create({ ...oneAcount, role: "admin" });
      expect(admin.role).toBe("admin");

      const loginCredentials = {
        email: oneAcount.email,
        password: oneAcount.password,
      };
      const login = await request(app)
        .post("/v1/auth/login")
        .send(loginCredentials)
        .expect(httpStatus.OK);

      const tour = await Tour.insertMany([newTour, newTour1]);

      const updateBody = { name: newTour.name };

      await request(app)
        .patch(`/v1/tours/${tour[1]._id}`)
        .auth(login.body.accessToken, { type: "bearer" })
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe("DELETE /v1/tours/:tourId", () => {
    let newTour;
    let oneAcount;
    beforeEach(() => {
      newTour = {
        name: "Sun World Ba Na Hills",
        duration: 2,
        maxGroupSize: 20,
        difficulty: "Trung bình",
        price: 10000000,
        summary: "Bà Nà là quần thể du lịch nghỉ dưỡng toạ",
        description:
          "Bà Nà là quần thể du lịch nghỉ dưỡng toạ lạc tại khu vực thuộc dãy Trường Sơn nằm ở xã Hoà Ninh, Huyện Hòa Vang, cách trung tâm Đà Nẵng khoảng 25km về phía Tây Nam.",
        location: "Tuyến cáp treo lên Bà Nà Hills, Hoà Ninh, Hòa Vang, Đà Nẵng",
      };
      oneAcount = {
        name: "Ron",
        email: "roon@gmail.com",
        password: "pass123",
        passwordConfirm: "pass123",
      };
    });

    test("should return 200 if data is ok and only admin", async () => {
      const admin = await User.create({ ...oneAcount, role: "admin" });
      expect(admin.role).toBe("admin");

      const loginCredentials = {
        email: oneAcount.email,
        password: oneAcount.password,
      };
      const login = await request(app)
        .post("/v1/auth/login")
        .send(loginCredentials)
        .expect(httpStatus.OK);

      expect(login.body.user).toHaveProperty("role", "admin");
      const tour = await Tour.create(newTour);
      await request(app)
        .delete(`/v1/tours/${tour._id}`)
        .auth(login.body.accessToken, { type: "bearer" })
        .expect(httpStatus.OK);

      const dbTour = await User.findById(tour._id);
      expect(dbTour).toBeNull();
    });

    test("should return 403 error if logged in user is not admin", async () => {
      const admin = await User.create({ ...oneAcount });
      expect(admin.role).toBe("user");

      const loginCredentials = {
        email: oneAcount.email,
        password: oneAcount.password,
      };
      const login = await request(app)
        .post("/v1/auth/login")
        .send(loginCredentials)
        .expect(httpStatus.OK);
      const tour = await Tour.create(newTour);

      await request(app)
        .delete(`/v1/tours/${tour._id}`)
        .auth(login.body.accessToken, { type: "bearer" })
        .expect(httpStatus.FORBIDDEN);
    });

    test("should return 401 error if access token is missing or invalid", async () => {
      const tour = await Tour.create(newTour);
      await request(app)
        .delete(`/v1/tours/${tour._id}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test("should return 400 error if tourId is not a valid mongo id", async () => {
      const admin = await User.create({ ...oneAcount, role: "admin" });
      expect(admin.role).toBe("admin");

      const loginCredentials = {
        email: oneAcount.email,
        password: oneAcount.password,
      };
      const login = await request(app)
        .post("/v1/auth/login")
        .send(loginCredentials)
        .expect(httpStatus.OK);

      await request(app)
        .delete("/v1/tours/invalidId")
        .auth(login.body.accessToken, { type: "bearer" })
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 404 error if tour already is not found", async () => {
      const admin = await User.create({ ...oneAcount, role: "admin" });
      expect(admin.role).toBe("admin");

      const loginCredentials = {
        email: oneAcount.email,
        password: oneAcount.password,
      };
      const login = await request(app)
        .post("/v1/auth/login")
        .send(loginCredentials)
        .expect(httpStatus.OK);
      await Tour.create(newTour);
      const id = await mongoose.Types.ObjectId();
      await request(app)
        .delete(`/v1/tours/${id}`)
        .auth(login.body.accessToken, { type: "bearer" })
        .expect(httpStatus.NOT_FOUND);
    });
  });
});
