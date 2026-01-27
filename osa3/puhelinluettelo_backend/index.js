require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");
const app = express();

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response
      .status(400)
      .send({ error: "ID must be 24 character hex string" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);
app.use(express.static("dist"));

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((res) => {
    return response.json(res);
  });
});

app.post("/api/persons", (request, response, next) => {
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: "Content missing",
    });
  }

  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  });

  person
    .save()
    .then((res) => {
      return response.json(res);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  const { id } = request.params;

  Person.findById(id)
    .then((res) => {
      if (!res) return response.status(404).end();
      return response.json(res);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { id } = request.params;

  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: "Content missing",
    });
  }

  Person.findById(id)
    .then((res) => {
      if (!res) return response.status(404).end();
      res.number = request.body.number;
      res
        .save()
        .then((res) => {
          return response.json(res);
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const { id } = request.params;

  Person.findByIdAndDelete(id)
    .then((res) => {
      return response.status(204).end();
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  const date = new Date();

  Person.find({}).then((res) => {
    return response.send(
      `<p>Phonebook has info for ${res.length} people</p> <p>${date}</p>`,
    );
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
