import { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || 'demo';

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found. Please check the spelling and try again.');
        }
        if (response.status === 401) {
          throw new Error('Invalid API key. Please set REACT_APP_WEATHER_API_KEY in your environment.');
        }
        throw new Error('Failed to fetch weather data. Please try again.');
      }

      const data = await response.json();
      setWeather({
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
      });
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div className="App">
      <div className="weather-container">
        <h1 className="app-title">🌤️ Weather App</h1>
        
        <form onSubmit={fetchWeather} className="search-form">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="search-input"
            aria-label="City name"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        {weather && (
          <div className="weather-card">
            <div className="weather-header">
              <h2 className="city-name">
                {weather.city}, {weather.country}
              </h2>
              <img
                src={getWeatherIconUrl(weather.icon)}
                alt={weather.description}
                className="weather-icon"
              />
            </div>
            
            <div className="temperature">
              {weather.temperature}°C
            </div>
            
            <p className="weather-description">
              {weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}
            </p>
            
            <div className="weather-details">
              <div className="detail-item">
                <span className="detail-label">Feels Like</span>
                <span className="detail-value">{weather.feelsLike}°C</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{weather.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Wind Speed</span>
                <span className="detail-value">{weather.windSpeed} m/s</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Pressure</span>
                <span className="detail-value">{weather.pressure} hPa</span>
              </div>
            </div>
          </div>
        )}

        {!weather && !error && !loading && (
          <div className="welcome-message">
            <p>Enter a city name to get the current weather</p>
            <p className="api-note">
              Note: To use this app, set the <code>REACT_APP_WEATHER_API_KEY</code> environment variable 
              with your OpenWeatherMap API key.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
