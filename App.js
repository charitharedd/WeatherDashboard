import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState('C');
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites')) || []);
  const [error, setError] = useState('');

  const fetchWeather = async (cityName) => {
    const API_KEY = 'YOUR_API_KEY';
    const unitQuery = unit === 'C' ? 'metric' : 'imperial';
    try {
      const response = await axios.get(
        https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cityName}&units=${unitQuery}
      );
      setWeather(response.data);
      setError('');
    } catch (err) {
      setError('City not found or API error.');
      setWeather(null);
    }
  };

  const handleSearch = () => {
    if (city) fetchWeather(city);
  };

  const toggleUnit = () => {
    setUnit(unit === 'C' ? 'F' : 'C');
  };

  const addFavorite = () => {
    if (city && !favorites.includes(city)) {
      const updatedFavorites = [...favorites, city];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  const selectFavorite = (city) => {
    setCity(city);
    fetchWeather(city);
  };

  return (
    <div className="app">
      <h1>Weather Dashboard</h1>
      <div className="search-bar">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={addFavorite}>Save</button>
      </div>
      <div className="unit-toggle">
        <button onClick={toggleUnit}>Toggle °C/°F</button>
      </div>
      {error && <p className="error">{error}</p>}
      {weather && (
        <div className="weather-card">
          <h2>{weather.location.name}</h2>
          <p>Temperature: {weather.current.temp_c}°{unit}</p>
          <p>Humidity: {weather.current.humidity}%</p>
          <p>Wind Speed: {weather.current.wind_kph} kph</p>
          <p>Condition: {weather.current.condition.text}</p>
          <img src={weather.current.condition.icon} alt="weather-icon" />
        </div>
      )}
      {favorites.length > 0 && (
        <div className="favorites">
          <h3>Favorite Cities</h3>
          <ul>
            {favorites.map((favCity, index) => (
              <li key={index} onClick={() => selectFavorite(favCity)}>
                {favCity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
