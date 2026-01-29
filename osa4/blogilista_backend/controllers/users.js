const bcrypt = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });
  response.json(users);
});

usersRouter.post("/", async (request, response, next) => {
  if (!request?.body)
    return response.status(400).json({ error: "Invalid data" });

  const { username, name, password } = request?.body;

  if (!username || !name || !password)
    return response.status(400).json({ error: "Invalid data" });

  if (password.length < 3)
    return response
      .status(400)
      .json({ error: "Password should be minimum 3 characters" });

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (err) {
    next(err);
  }
});

module.exports = usersRouter;
