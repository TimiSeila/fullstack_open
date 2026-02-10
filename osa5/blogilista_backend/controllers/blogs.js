const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response, next) => {
  const { id } = request.params;

  try {
    const blog = await Blog.findById(id);

    if (!blog) return response.status(404).end();

    return response.json(blog);
  } catch (err) {
    next(err);
  }
});

blogsRouter.post(
  "/",
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      const user = request.user;

      const blog = new Blog({
        title: request.body?.title,
        author: request.body?.author,
        url: request.body?.url,
        likes: request.body?.likes || 0,
        user: user.id,
      });

      const savedBlog = await blog.save();
      user.blogs = user.blogs.concat(savedBlog.id);
      await user.save();
      response.status(201).json(savedBlog);
    } catch (err) {
      next(err);
    }
  },
);

blogsRouter.put("/:id", async (request, response, next) => {
  const { id } = request.params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) return response.status(404).end();

    blog.title = request.body?.title;
    blog.author = request.body?.author;
    blog.url = request.body?.url;
    blog.likes = request.body?.likes;

    const savedBlog = await blog.save();
    return response.json(savedBlog);
  } catch (err) {
    next(err);
  }
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response, next) => {
    const { id } = request.params;

    try {
      const user = request.user;

      const blog = await Blog.findById(id);

      if (!blog) return response.status(204).end();

      if (blog.user.toString() !== user.id) {
        return response.status(401).json({ error: "not owner of blog" });
      }
      await Blog.findByIdAndDelete(id);
      return response.status(204).end();
    } catch (err) {
      next(err);
    }
  },
);

module.exports = blogsRouter;
