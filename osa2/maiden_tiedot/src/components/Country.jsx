import React, { useEffect, useState } from "react";
import axios from "axios";

const Country = ({ country }) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    axios
      .get(
        `https://api.open-meteo.com/v1/forecast?latitude=${country.capitalInfo.latlng[0]}&longitude=${country.capitalInfo.latlng[1]}&current=temperature_2m,wind_speed_10m,weather_code&forecast_days=1&wind_speed_unit=ms`
      )
      .then((res) => {
        setWeatherData(res.data);
      });
  }, []);

  const parseLanguages = (languagesObject) => {
    let langs = [];
    for (const [key, value] of Object.entries(languagesObject)) {
      langs.push(value);
    }
    return langs;
  };

  return (
    <div>
      <h1>
        {country.name.common} {country.flag}
      </h1>
      <p>Capital: {country.capital}</p>
      <p>Region: {country.region}</p>
      <h2>Languages</h2>
      <ul>
        {parseLanguages(country.languages).map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      {weatherData ? (
        <>
          <h2>Weather in {country.capital}</h2>
          <p>Temperature: {weatherData.current.temperature_2m} °C</p>
          <p>Wind: {weatherData.current.wind_speed_10m} m/s</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Country;
