import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    personService.getAllPersons().then((res) => {
      setPersons(res);
    });
  }, []);

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handlePersonSubmit = (e) => {
    e.preventDefault();

    const foundPerson = persons.find((person) => person.name === newName);

    if (foundPerson) {
      const confirm = window.confirm(
        `${foundPerson.name} is already added to the phonebook, replace old number with a new one?`,
      );

      if (confirm) {
        const changedPerson = { ...foundPerson, number: newNumber };
        personService
          .updatePerson(foundPerson.id, changedPerson)
          .then((res) => {
            setPersons(
              persons.map((person) =>
                person.id !== foundPerson.id ? person : res,
              ),
            );
            setNewName("");
            setNewNumber("");
            setSuccess(`'${res.name}'s phone number successfully updated`);
            setTimeout(() => {
              setSuccess(null);
            }, 5000);
          });
      }
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber,
    };

    personService.createPerson(personObject).then((res) => {
      setPersons(persons.concat(res));
      setNewName("");
      setNewNumber("");
      setSuccess(`Person '${res.name}' added successfully`);
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    });
  };

  const handleDeletePerson = (id, name) => {
    const confirmed = window.confirm(`Delete ${name}?`);
    if (confirmed) {
      personService
        .deletePerson(id)
        .then((res) => {
          setPersons(persons.filter((person) => person.id !== id));
          setSuccess(`Person '${name}' removed successfully`);
          setTimeout(() => {
            setSuccess(null);
          }, 5000);
        })
        .catch((error) => {
          setError(`Person '${name}' doesn't exist in the DB`);
          setTimeout(() => {
            setError(null);
          }, 5000);
          setPersons(persons.filter((person) => person.id !== id));
        });
    }
  };

  const personsToShow = filter
    ? persons.filter((person) => person.name.toLowerCase().includes(filter))
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onChange={handleFilterChange} />
      <h2>Add record</h2>
      <PersonForm
        onSubmit={handlePersonSubmit}
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
      />
      <Notification.Error message={error} />
      <Notification.Success message={success} />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} onDeletePerson={handleDeletePerson} />
    </div>
  );
};

export default App;
