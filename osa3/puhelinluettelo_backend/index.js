const express = require("express");
const morgan = require("morgan");
const app = express();

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: "1",
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: "2",
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: "3",
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: "4",
  },
];

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
  response.json(persons);
});

app.post("/api/persons", (request, response) => {
  const newUserId = Math.floor(Math.random() * 99999999999);

  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: "Content missing",
    });
  }

  const foundPerson = persons.find(
    (person) => person.name === request.body.name,
  );

  if (foundPerson)
    return response.status(409).json({
      error: "Name must be unique",
    });

  const person = {
    name: request.body.name,
    number: request.body.number,
    id: newUserId.toString(),
  };

  persons = persons.concat(person);

  response.json(person);
});

app.get("/api/persons/:id", (request, response) => {
  const { id } = request.params;

  const person = persons.find((person) => person.id === id);

  if (!person) return response.status(404).end();

  return response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const { id } = request.params;
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`,
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
