const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Missing CLI argument 'password'");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://timiseila_db_user:${password}@cluster0.asqala1.mongodb.net/phonebook?appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv[3] && process.argv[4]) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log(
      `Added || Name: ${process.argv[3]} | Number: ${process.argv[4]} to phonebook`,
    );
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((res) => {
    console.log("Phonebook:");
    res.forEach((person) => {
      console.log(`Name: ${person.name} | Number: ${person.number}`);
    });
    mongoose.connection.close();
  });
}
