import React from "react";

const Persons = ({ persons, onDeletePerson }) => {
  return persons.map((person) => (
    <div key={person.id}>
      <p>
        {person.name} {person.number}
      </p>
      <button onClick={() => onDeletePerson(person.id, person.name)}>
        delete
      </button>
    </div>
  ));
};

export default Persons;
