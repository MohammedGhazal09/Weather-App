import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [astronomy, setAstronomy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const API_KEY = '16e76914aa244ae3bc8141253252511';
  const BASE_URL = 'https://api.weatherapi.com/v1';

  useEffect(() => {
    fetchWeatherData('Riyadh');
  }, []);

  const fetchWeatherData = async (searchCity) => {
    setLoading(true);
    setError('');
    setSuggestions([]);

    try {
      const [currentRes, forecastRes, astronomyRes] = await Promise.all([
        axios.get(`${BASE_URL}/current.json`, {
          params: { key: API_KEY, q: searchCity, aqi: 'yes' }
        }),
        axios.get(`${BASE_URL}/forecast.json`, {
          params: { key: API_KEY, q: searchCity, days: 3, alerts: 'yes' }
        }),
        axios.get(`${BASE_URL}/astronomy.json`, {
          params: { key: API_KEY, q: searchCity, dt: new Date().toISOString().split('T')[0] }
        })
      ]);

      setWeather(currentRes.data);
      setForecast(forecastRes.data);
      setAstronomy(astronomyRes.data);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('City not found. Please check the city name.');
      } else {
        setError('Failed to fetch weather data. Please try again.');
      }
      setWeather(null);
      setForecast(null);
      setAstronomy(null);
    } finally {
      setLoading(false);
    }
  };

  const searchCities = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/search.json`, {
        params: { key: API_KEY, q: query }
      });
      setSuggestions(response.data.slice(0, 5));
    } catch {
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCity(value);
    searchCities(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion.name);
    setSuggestions([]);
    fetchWeatherData(suggestion.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }
    fetchWeatherData(city);
  };

  const formatDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  const getAqiLabel = (aqi) => {
    if (!aqi || aqi < 1 || aqi > 6) return 'Unknown';
    const labels = ['Good', 'Moderate', 'Unhealthy for Sensitive', 'Unhealthy', 'Very Unhealthy', 'Hazardous'];
    return labels[aqi - 1];
  };

  const getAqiClass = (aqi) => {
    if (!aqi || aqi < 1 || aqi > 6) return '';
    const classes = ['aqi-good', 'aqi-moderate', 'aqi-sensitive', 'aqi-unhealthy', 'aqi-very-unhealthy', 'aqi-hazardous'];
    return classes[aqi - 1];
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Weather App</h1>
        <p className="date">{formatDate()}</p>
        
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={handleInputChange}
              className="search-input"
            />
            {suggestions.length > 0 && (
              <ul className="suggestions">
                {suggestions.map((suggestion, index) => (
                  <li 
                    key={index} 
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="suggestion-item"
                  >
                    {suggestion.name}, {suggestion.region}, {suggestion.country}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-card">
            <div className="weather-header">
              <h2 className="city-name">
                {weather.location.name}, {weather.location.country}
              </h2>
              <img
                src={weather.current.condition.icon}
                alt={weather.current.condition.text}
                className="weather-icon"
              />
            </div>
            
            <div className="weather-main">
              <p className="temperature">{Math.round(weather.current.temp_c)}°C</p>
              <p className="description">{weather.current.condition.text}</p>
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <span className="detail-label">Feels Like</span>
                <span className="detail-value">{Math.round(weather.current.feelslike_c)}°C</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{weather.current.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Wind Speed</span>
                <span className="detail-value">{weather.current.wind_kph} km/h</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">UV Index</span>
                <span className="detail-value">{weather.current.uv}</span>
              </div>
            </div>

            {weather.current.air_quality && (
              <div className="aqi-section">
                <h3 className="section-title">Air Quality</h3>
                <div className={`aqi-badge ${getAqiClass(weather.current.air_quality['us-epa-index'])}`}>
                  {getAqiLabel(weather.current.air_quality['us-epa-index'])}
                </div>
                <div className="aqi-details">
                  <span>PM2.5: {weather.current.air_quality.pm2_5 != null ? weather.current.air_quality.pm2_5.toFixed(1) : 'N/A'} µg/m³</span>
                  <span>PM10: {weather.current.air_quality.pm10 != null ? weather.current.air_quality.pm10.toFixed(1) : 'N/A'} µg/m³</span>
                </div>
              </div>
            )}

            {astronomy && (
              <div className="astronomy-section">
                <h3 className="section-title">Sun & Moon</h3>
                <div className="astronomy-grid">
                  <div className="astronomy-item">
                    <span className="astronomy-icon">🌅</span>
                    <span className="astronomy-label">Sunrise</span>
                    <span className="astronomy-value">{astronomy.astronomy.astro.sunrise}</span>
                  </div>
                  <div className="astronomy-item">
                    <span className="astronomy-icon">🌇</span>
                    <span className="astronomy-label">Sunset</span>
                    <span className="astronomy-value">{astronomy.astronomy.astro.sunset}</span>
                  </div>
                  <div className="astronomy-item">
                    <span className="astronomy-icon">🌙</span>
                    <span className="astronomy-label">Moon Phase</span>
                    <span className="astronomy-value">{astronomy.astronomy.astro.moon_phase}</span>
                  </div>
                  <div className="astronomy-item">
                    <span className="astronomy-icon">🌕</span>
                    <span className="astronomy-label">Illumination</span>
                    <span className="astronomy-value">{astronomy.astronomy.astro.moon_illumination}%</span>
                  </div>
                </div>
              </div>
            )}

            {forecast && forecast.forecast && (
              <div className="forecast-section">
                <h3 className="section-title">3-Day Forecast</h3>
                <div className="forecast-grid">
                  {forecast.forecast.forecastday.map((day, index) => (
                    <div key={index} className="forecast-card">
                      <p className="forecast-date">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      <img src={day.day.condition.icon} alt={day.day.condition.text} className="forecast-icon" />
                      <p className="forecast-temp">
                        <span className="temp-high">{Math.round(day.day.maxtemp_c)}°</span>
                        <span className="temp-low">{Math.round(day.day.mintemp_c)}°</span>
                      </p>
                      <p className="forecast-condition">{day.day.condition.text}</p>
                      <p className="forecast-rain">💧 {day.day.daily_chance_of_rain}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {forecast && forecast.alerts && forecast.alerts.alert && forecast.alerts.alert.length > 0 && (
              <div className="alerts-section">
                <h3 className="section-title">⚠️ Weather Alerts</h3>
                {forecast.alerts.alert.map((alert, index) => (
                  <div key={index} className="alert-card">
                    <p className="alert-headline">{alert.headline}</p>
                    <p className="alert-event">{alert.event}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
