import React from "react";

const CountryList = ({ countries, onSelectedCountryChange }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (countries.length === 0) {
    return <p>No matches found</p>;
  }

  return (
    <div>
      {countries.map((country) => (
        <div key={country.name.official}>
          <p>{country.name.common}</p>
          <button onClick={() => onSelectedCountryChange(country)}>Show</button>
        </div>
      ))}
    </div>
  );
};

export default CountryList;
