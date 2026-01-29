const logger = require("./logger");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response
      .status(400)
      .send({ error: "ID must be 24 character hex string" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response.status(400).json({ error: "Username already in use" });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
    return next();
  }
  request.token = null;
  return next();
};

const userExtractor = async (request, response, next) => {
  try {
    const token = jwt.verify(request.token, process.env.SECRET);

    if (!token.id) {
      return response.status(401).json({ error: "token invalid" });
    }

    const user = await User.findById(token.id);

    if (!user) {
      return response
        .status(400)
        .json({ error: "User ID missing or not valid" });
    }

    request.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
