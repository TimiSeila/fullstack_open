const { test, describe } = require("node:test");
const assert = require("node:assert");
const testData = require("./testData");
const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  test("of empty list is zero", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });
  test("when list has only one blog equals the likes of that", () => {
    const result = listHelper.totalLikes(testData.blogsOne);
    assert.strictEqual(result, 7);
  });
  test("when bigger list given", () => {
    const result = listHelper.totalLikes(testData.blogs);
    assert.strictEqual(result, 36);
  });
});

describe("favorite blog", () => {
  test("of empty list is null", () => {
    const result = listHelper.favoriteBlog([]);
    assert.deepStrictEqual(result, null);
  });
  test("when list has only one blog returns that", () => {
    const result = listHelper.favoriteBlog(testData.blogsOne);
    assert.deepStrictEqual(result, testData.blogsOne[0]);
  });
  test("when bigger list given", () => {
    const result = listHelper.favoriteBlog(testData.blogs);
    assert.deepStrictEqual(result, testData.blogs[2]);
  });
});

describe("most blogs", () => {
  test("of empty list is null", () => {
    const result = listHelper.mostBlogs([]);
    assert.deepStrictEqual(result, null);
  });
  test("when list has only one blog returns that", () => {
    const result = listHelper.mostBlogs(testData.blogsOne);
    assert.deepStrictEqual(result, {
      author: testData.blogsOne[0].author,
      blogs: 1,
    });
  });
  test("when bigger list given", () => {
    const result = listHelper.mostBlogs(testData.blogs);
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
});

describe("most likes", () => {
  test("of empty list is null", () => {
    const result = listHelper.mostLikes([]);
    assert.deepStrictEqual(result, null);
  });
  test("when list has only one blog returns that", () => {
    const result = listHelper.mostLikes(testData.blogsOne);
    assert.deepStrictEqual(result, {
      author: testData.blogsOne[0].author,
      likes: 7,
    });
  });
  test("when bigger list given", () => {
    const result = listHelper.mostLikes(testData.blogs);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
