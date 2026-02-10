const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const testData = require("./testData");
const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  let blogObject = new Blog(testData.initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(testData.initialBlogs[1]);
  await blogObject.save();

  let userPassword = await bcrypt.hash(testData.initialUsers[0].password, 10);
  let initialUser = new User({
    ...testData.initialUsers[0],
    passwordHash: userPassword,
  });
  await initialUser.save();

  userPassword = await bcrypt.hash(testData.initialUsers[1].password, 10);
  initialUser = new User({
    ...testData.initialUsers[1],
    passwordHash: userPassword,
  });
  await initialUser.save();
});

describe("Getting blogs", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const res = await api.get("/api/blogs");

    assert.strictEqual(res.body.length, testData.initialBlogs.length);
  });

  test("blogs include id not _id", async () => {
    const res = await api.get("/api/blogs");

    res.body.forEach((blog) => {
      assert.ok(blog.id);
      assert.strictEqual(blog._id, undefined);
    });
  });
});

describe("Getting specific blog", () => {
  test("succeeds with a valid id", async () => {
    await api
      .get(`/api/blogs/${testData.initialBlogs[0]._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("fails with status code 404 if blog doesnt exist", async () => {
    await api.get(`/api/blogs/${testData.blogsOne[0]._id}`).expect(404);
  });

  test("fails with status code 400 if id is invalid", async () => {
    await api
      .get(`/api/blogs/test`)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
});

describe("Adding blogs", () => {
  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
    };

    const res = await api.post("/api/login").send(testData.initialUsers[0]);

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${res.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const finalBlogs = await api.get("/api/blogs");
    assert.strictEqual(
      finalBlogs.body.length,
      testData.initialBlogs.length + 1,
    );

    const addedBlog = finalBlogs.body.find((item) => item.url === newBlog.url);

    assert.deepStrictEqual(addedBlog.url, newBlog.url);
  });

  test("return 401 if no token", async () => {
    const newBlog = {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    const finalBlogs = await api.get("/api/blogs");
    assert.strictEqual(finalBlogs.body.length, testData.initialBlogs.length);
  });

  test("api correctly assigns likes as 0 if empty or doesnt exist", async () => {
    const newBlog = {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    };

    const res = await api.post("/api/login").send(testData.initialUsers[0]);

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${res.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const finalBlogs = await api.get("/api/blogs");
    assert.strictEqual(
      finalBlogs.body.length,
      testData.initialBlogs.length + 1,
    );

    const addedBlog = finalBlogs.body.find((item) => item.url === newBlog.url);

    assert.strictEqual(addedBlog.likes, 0);
  });

  test("blog without title or url is not added", async () => {
    const newBlog = {
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
    };

    const res = await api.post("/api/login").send(testData.initialUsers[0]);

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${res.body.token}`)
      .send(newBlog)
      .expect(400);

    const finalBlogs = await api.get("/api/blogs");

    assert.strictEqual(finalBlogs.body.length, testData.initialBlogs.length);
  });
});

describe("Updating blogs", () => {
  test("succees with status code 200 if id and data are valid", async () => {
    await api
      .put(`/api/blogs/${testData.initialBlogs[0]._id}`)
      .send(testData.blogsOne[0])
      .expect(200);
  });

  test("fails with status code 400 if id is invalid", async () => {
    await api.put(`/api/blogs/test`).send(testData.blogsOne[0]).expect(400);
  });

  test("fails with status code 400 if data is invalid", async () => {
    await api
      .put(`/api/blogs/${testData.initialBlogs[0]._id}`)
      .send()
      .expect(400);
  });
});

describe("Deleting blogs", () => {
  test("succees with status code 204 if id is valid", async () => {
    const res = await api.post("/api/login").send(testData.initialUsers[0]);

    const newBlog = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${res.body.token}`)
      .send({ title: "RemovablePost", url: "x.com" })
      .expect(201);

    await api
      .delete(`/api/blogs/${newBlog.body.id}`)
      .set("Authorization", `Bearer ${res.body.token}`)
      .expect(204);

    const finalBlogs = await api.get("/api/blogs");
    assert.strictEqual(finalBlogs.body.length, testData.initialBlogs.length);
  });

  test("fails with status code 400 if id is invalid", async () => {
    const res = await api.post("/api/login").send(testData.initialUsers[0]);

    await api
      .delete(`/api/blogs/test`)
      .set("Authorization", `Bearer ${res.body.token}`)
      .expect(400);

    const finalBlogs = await api.get("/api/blogs");
    assert.strictEqual(finalBlogs.body.length, testData.initialBlogs.length);
  });
});

describe("Creating user", () => {
  test("succees with status code 201 if data is valid", async () => {
    await api.post("/api/users").send(testData.extraUser).expect(201);

    const finalUsers = await api.get("/api/users");
    assert.strictEqual(
      finalUsers.body.length,
      testData.initialUsers.length + 1,
    );
  });

  test("succees with status code 400 if data is invalid", async () => {
    await api.post("/api/users").send().expect(400);

    const finalUsers = await api.get("/api/users");
    assert.strictEqual(finalUsers.body.length, testData.initialUsers.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
