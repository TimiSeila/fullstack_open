import { useState, useEffect } from "react";
import axios from "axios";
import CountryList from "./components/CountryList";
import Country from "./components/Country";
import Filter from "./components/Filter";

function App() {
  const [allCountries, setAllCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((res) => {
        setAllCountries(res.data);
      });
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setSelectedCountry(null);
  };

  const handleSelectedCountryChange = (country) => {
    setSelectedCountry(country);
    setFilter("");
  };

  const countriesToShow = filter
    ? allCountries.filter((country) =>
        country.name.common.toLowerCase().includes(filter)
      )
    : allCountries;

  return (
    <div>
      <Filter filter={filter} onFilterChange={handleFilterChange} />
      {selectedCountry ? (
        <Country country={selectedCountry} />
      ) : (
        <CountryList
          countries={countriesToShow}
          onSelectedCountryChange={handleSelectedCountryChange}
        />
      )}
    </div>
  );
}

export default App;
