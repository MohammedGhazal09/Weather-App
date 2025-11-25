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
          params: { key: API_KEY, q: searchCity, days: 14, alerts: 'yes' }
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

  // Air Quality Index description
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

  // UV Index description (WHO Standard)
  const getUvLabel = (uv) => {
    if (uv === null || uv === undefined) return { label: 'Unknown', class: '' };
    if (uv <= 2) return { label: 'Low', class: 'uv-low', desc: 'No protection needed' };
    if (uv <= 5) return { label: 'Moderate', class: 'uv-moderate', desc: 'Seek shade during midday' };
    if (uv <= 7) return { label: 'High', class: 'uv-high', desc: 'Reduce sun exposure' };
    if (uv <= 10) return { label: 'Very High', class: 'uv-very-high', desc: 'Extra protection needed' };
    return { label: 'Extreme', class: 'uv-extreme', desc: 'Avoid sun exposure' };
  };

  // Humidity description
  const getHumidityLabel = (humidity) => {
    if (humidity === null || humidity === undefined) return { label: 'Unknown', class: '' };
    if (humidity < 30) return { label: 'Dry', class: 'humidity-dry', desc: 'Low moisture, may cause discomfort' };
    if (humidity <= 50) return { label: 'Comfortable', class: 'humidity-comfortable', desc: 'Ideal humidity level' };
    if (humidity <= 70) return { label: 'Moderate', class: 'humidity-moderate', desc: 'Slightly humid' };
    return { label: 'Humid', class: 'humidity-humid', desc: 'High moisture, may feel sticky' };
  };

  // Wind Speed description (Beaufort Scale simplified)
  const getWindLabel = (windKph) => {
    if (windKph === null || windKph === undefined) return { label: 'Unknown', class: '' };
    if (windKph < 1) return { label: 'Calm', class: 'wind-calm', desc: 'Smoke rises vertically' };
    if (windKph <= 11) return { label: 'Light', class: 'wind-light', desc: 'Light breeze felt on face' };
    if (windKph <= 28) return { label: 'Moderate', class: 'wind-moderate', desc: 'Leaves and small twigs move' };
    if (windKph <= 49) return { label: 'Fresh', class: 'wind-fresh', desc: 'Small trees begin to sway' };
    if (windKph <= 74) return { label: 'Strong', class: 'wind-strong', desc: 'Large branches in motion' };
    return { label: 'Gale', class: 'wind-gale', desc: 'Difficult to walk against wind' };
  };

  // Visibility description
  const getVisibilityLabel = (visKm) => {
    if (visKm === null || visKm === undefined) return { label: 'Unknown', class: '' };
    if (visKm < 1) return { label: 'Very Poor', class: 'vis-very-poor', desc: 'Dense fog or heavy precipitation' };
    if (visKm < 4) return { label: 'Poor', class: 'vis-poor', desc: 'Fog or mist present' };
    if (visKm < 10) return { label: 'Moderate', class: 'vis-moderate', desc: 'Light haze possible' };
    return { label: 'Good', class: 'vis-good', desc: 'Clear conditions' };
  };

  // Pressure description
  const getPressureLabel = (pressureMb) => {
    if (pressureMb === null || pressureMb === undefined) return { label: 'Unknown', class: '' };
    if (pressureMb < 1000) return { label: 'Low', class: 'pressure-low', desc: 'Storm or rain likely' };
    if (pressureMb <= 1020) return { label: 'Normal', class: 'pressure-normal', desc: 'Stable conditions' };
    return { label: 'High', class: 'pressure-high', desc: 'Fair weather expected' };
  };

  // Cloud Cover description
  const getCloudLabel = (cloud) => {
    if (cloud === null || cloud === undefined) return { label: 'Unknown', class: '' };
    if (cloud <= 10) return { label: 'Clear', class: 'cloud-clear', desc: 'Sunny skies' };
    if (cloud <= 25) return { label: 'Mostly Clear', class: 'cloud-mostly-clear', desc: 'Few clouds' };
    if (cloud <= 50) return { label: 'Partly Cloudy', class: 'cloud-partly', desc: 'Mix of sun and clouds' };
    if (cloud <= 75) return { label: 'Mostly Cloudy', class: 'cloud-mostly', desc: 'Clouds dominant' };
    return { label: 'Overcast', class: 'cloud-overcast', desc: 'Full cloud cover' };
  };

  // Precipitation description
  const getPrecipLabel = (precipMm) => {
    if (precipMm === null || precipMm === undefined) return { label: 'Unknown', class: '' };
    if (precipMm === 0) return { label: 'None', class: 'precip-none', desc: 'No precipitation' };
    if (precipMm < 2.5) return { label: 'Light', class: 'precip-light', desc: 'Light rain/drizzle' };
    if (precipMm < 7.5) return { label: 'Moderate', class: 'precip-moderate', desc: 'Steady precipitation' };
    return { label: 'Heavy', class: 'precip-heavy', desc: 'Intense precipitation' };
  };

  // Feels Like description
  const getFeelsLikeLabel = (actual, feelsLike) => {
    if (actual === null || actual === undefined || feelsLike === null || feelsLike === undefined) return { label: '', class: '' };
    const diff = feelsLike - actual;
    if (Math.abs(diff) <= 2) return { label: 'Similar', class: 'feels-similar', desc: 'Feels close to actual' };
    if (diff > 2) return { label: 'Warmer', class: 'feels-warmer', desc: 'Feels warmer due to humidity' };
    return { label: 'Colder', class: 'feels-colder', desc: 'Feels colder due to wind' };
  };

  // Dew Point description
  const getDewPointLabel = (dewPoint) => {
    if (dewPoint === null || dewPoint === undefined) return { label: 'Unknown', class: '' };
    if (dewPoint < 10) return { label: 'Dry', class: 'dew-dry', desc: 'Very comfortable' };
    if (dewPoint < 16) return { label: 'Comfortable', class: 'dew-comfortable', desc: 'Pleasant conditions' };
    if (dewPoint < 21) return { label: 'Slightly Humid', class: 'dew-slight', desc: 'Somewhat noticeable' };
    if (dewPoint < 24) return { label: 'Humid', class: 'dew-humid', desc: 'Muggy, uncomfortable' };
    return { label: 'Oppressive', class: 'dew-oppressive', desc: 'Very uncomfortable' };
  };

  // Gust description
  const getGustLabel = (gustKph, windKph) => {
    if (gustKph === null || gustKph === undefined || windKph === null || windKph === undefined) return { label: 'Unknown', class: '' };
    const ratio = gustKph / Math.max(windKph, 1);
    if (ratio < 1.3) return { label: 'Steady', class: 'gust-steady', desc: 'Consistent winds' };
    if (ratio < 1.6) return { label: 'Gusty', class: 'gust-gusty', desc: 'Moderate gusts' };
    return { label: 'Very Gusty', class: 'gust-very', desc: 'Strong sudden gusts' };
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
              <div>
                <h2 className="city-name">
                  {weather.location.name}, {weather.location.country}
                </h2>
                <p className="location-info">
                  {weather.location.region} • Lat: {weather.location.lat}° Lon: {weather.location.lon}°
                </p>
                <p className="local-time">Local Time: {weather.location.localtime}</p>
              </div>
              <img
                src={weather.current.condition.icon}
                alt={weather.current.condition.text}
                className="weather-icon"
              />
            </div>
            
            <div className="weather-main">
              <p className="temperature">{Math.round(weather.current.temp_c)}°C</p>
              <p className="temperature-f">({Math.round(weather.current.temp_f)}°F)</p>
              <p className="description">{weather.current.condition.text}</p>
              <div className={`feels-badge ${getFeelsLikeLabel(weather.current.temp_c, weather.current.feelslike_c).class}`}>
                Feels {getFeelsLikeLabel(weather.current.temp_c, weather.current.feelslike_c).label}: {Math.round(weather.current.feelslike_c)}°C
              </div>
            </div>

            {/* Atmospheric Conditions */}
            <div className="section-container">
              <h3 className="section-title">🌡️ Atmospheric Conditions</h3>
              <div className="weather-details-grid">
                <div className="detail-card">
                  <span className="detail-icon">💧</span>
                  <span className="detail-label">Humidity</span>
                  <span className="detail-value">{weather.current.humidity}%</span>
                  <span className={`detail-badge ${getHumidityLabel(weather.current.humidity).class}`}>
                    {getHumidityLabel(weather.current.humidity).label}
                  </span>
                  <span className="detail-desc">{getHumidityLabel(weather.current.humidity).desc}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-icon">🌡️</span>
                  <span className="detail-label">Dew Point</span>
                  <span className="detail-value">{weather.current.dewpoint_c != null ? `${weather.current.dewpoint_c}°C` : 'N/A'}</span>
                  <span className={`detail-badge ${getDewPointLabel(weather.current.dewpoint_c).class}`}>
                    {getDewPointLabel(weather.current.dewpoint_c).label}
                  </span>
                  <span className="detail-desc">{getDewPointLabel(weather.current.dewpoint_c).desc}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-icon">📊</span>
                  <span className="detail-label">Pressure</span>
                  <span className="detail-value">{weather.current.pressure_mb} hPa</span>
                  <span className={`detail-badge ${getPressureLabel(weather.current.pressure_mb).class}`}>
                    {getPressureLabel(weather.current.pressure_mb).label}
                  </span>
                  <span className="detail-desc">{getPressureLabel(weather.current.pressure_mb).desc}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-icon">☁️</span>
                  <span className="detail-label">Cloud Cover</span>
                  <span className="detail-value">{weather.current.cloud}%</span>
                  <span className={`detail-badge ${getCloudLabel(weather.current.cloud).class}`}>
                    {getCloudLabel(weather.current.cloud).label}
                  </span>
                  <span className="detail-desc">{getCloudLabel(weather.current.cloud).desc}</span>
                </div>
              </div>
            </div>

            {/* Wind Conditions */}
            <div className="section-container wind-section">
              <h3 className="section-title">💨 Wind Conditions</h3>
              <div className="weather-details-grid">
                <div className="detail-card">
                  <span className="detail-icon">🌬️</span>
                  <span className="detail-label">Wind Speed</span>
                  <span className="detail-value">{weather.current.wind_kph} km/h</span>
                  <span className="detail-sub">({weather.current.wind_mph} mph)</span>
                  <span className={`detail-badge ${getWindLabel(weather.current.wind_kph).class}`}>
                    {getWindLabel(weather.current.wind_kph).label}
                  </span>
                  <span className="detail-desc">{getWindLabel(weather.current.wind_kph).desc}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-icon">🧭</span>
                  <span className="detail-label">Wind Direction</span>
                  <span className="detail-value">{weather.current.wind_dir}</span>
                  <span className="detail-sub">{weather.current.wind_degree}°</span>
                </div>
                <div className="detail-card">
                  <span className="detail-icon">💥</span>
                  <span className="detail-label">Wind Gust</span>
                  <span className="detail-value">{weather.current.gust_kph} km/h</span>
                  <span className={`detail-badge ${getGustLabel(weather.current.gust_kph, weather.current.wind_kph).class}`}>
                    {getGustLabel(weather.current.gust_kph, weather.current.wind_kph).label}
                  </span>
                  <span className="detail-desc">{getGustLabel(weather.current.gust_kph, weather.current.wind_kph).desc}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-icon">👁️</span>
                  <span className="detail-label">Visibility</span>
                  <span className="detail-value">{weather.current.vis_km} km</span>
                  <span className={`detail-badge ${getVisibilityLabel(weather.current.vis_km).class}`}>
                    {getVisibilityLabel(weather.current.vis_km).label}
                  </span>
                  <span className="detail-desc">{getVisibilityLabel(weather.current.vis_km).desc}</span>
                </div>
              </div>
            </div>

            {/* UV & Precipitation */}
            <div className="section-container">
              <h3 className="section-title">☀️ UV & Precipitation</h3>
              <div className="weather-details-grid">
                <div className="detail-card">
                  <span className="detail-icon">🌞</span>
                  <span className="detail-label">UV Index</span>
                  <span className="detail-value">{weather.current.uv}</span>
                  <span className={`detail-badge ${getUvLabel(weather.current.uv).class}`}>
                    {getUvLabel(weather.current.uv).label}
                  </span>
                  <span className="detail-desc">{getUvLabel(weather.current.uv).desc}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-icon">🌧️</span>
                  <span className="detail-label">Precipitation</span>
                  <span className="detail-value">{weather.current.precip_mm} mm</span>
                  <span className={`detail-badge ${getPrecipLabel(weather.current.precip_mm).class}`}>
                    {getPrecipLabel(weather.current.precip_mm).label}
                  </span>
                  <span className="detail-desc">{getPrecipLabel(weather.current.precip_mm).desc}</span>
                </div>
              </div>
            </div>

            {weather.current.air_quality && (
              <div className="aqi-section">
                <h3 className="section-title">🌬️ Air Quality Index</h3>
                <div className={`aqi-badge ${getAqiClass(weather.current.air_quality['us-epa-index'])}`}>
                  {getAqiLabel(weather.current.air_quality['us-epa-index'])}
                </div>
                <div className="aqi-grid">
                  <div className="aqi-item">
                    <span className="aqi-label">PM2.5</span>
                    <span className="aqi-value">{weather.current.air_quality.pm2_5 != null ? weather.current.air_quality.pm2_5.toFixed(1) : 'N/A'} µg/m³</span>
                    <span className="aqi-desc">Fine particles</span>
                  </div>
                  <div className="aqi-item">
                    <span className="aqi-label">PM10</span>
                    <span className="aqi-value">{weather.current.air_quality.pm10 != null ? weather.current.air_quality.pm10.toFixed(1) : 'N/A'} µg/m³</span>
                    <span className="aqi-desc">Coarse particles</span>
                  </div>
                  <div className="aqi-item">
                    <span className="aqi-label">O₃ (Ozone)</span>
                    <span className="aqi-value">{weather.current.air_quality.o3 != null ? weather.current.air_quality.o3.toFixed(1) : 'N/A'} µg/m³</span>
                    <span className="aqi-desc">Ground-level ozone</span>
                  </div>
                  <div className="aqi-item">
                    <span className="aqi-label">NO₂</span>
                    <span className="aqi-value">{weather.current.air_quality.no2 != null ? weather.current.air_quality.no2.toFixed(1) : 'N/A'} µg/m³</span>
                    <span className="aqi-desc">Nitrogen dioxide</span>
                  </div>
                  <div className="aqi-item">
                    <span className="aqi-label">SO₂</span>
                    <span className="aqi-value">{weather.current.air_quality.so2 != null ? weather.current.air_quality.so2.toFixed(1) : 'N/A'} µg/m³</span>
                    <span className="aqi-desc">Sulfur dioxide</span>
                  </div>
                  <div className="aqi-item">
                    <span className="aqi-label">CO</span>
                    <span className="aqi-value">{weather.current.air_quality.co != null ? weather.current.air_quality.co.toFixed(1) : 'N/A'} µg/m³</span>
                    <span className="aqi-desc">Carbon monoxide</span>
                  </div>
                </div>
              </div>
            )}

            {astronomy && (
              <div className="astronomy-section">
                <h3 className="section-title">🌌 Sun & Moon</h3>
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
                    <span className="astronomy-label">Moonrise</span>
                    <span className="astronomy-value">{astronomy.astronomy.astro.moonrise || 'N/A'}</span>
                  </div>
                  <div className="astronomy-item">
                    <span className="astronomy-icon">🌑</span>
                    <span className="astronomy-label">Moonset</span>
                    <span className="astronomy-value">{astronomy.astronomy.astro.moonset || 'N/A'}</span>
                  </div>
                  <div className="astronomy-item">
                    <span className="astronomy-icon">🌓</span>
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
                <h3 className="section-title">📅 14-Day Forecast</h3>
                <div className="forecast-scroll">
                  {forecast.forecast.forecastday.map((day, index) => (
                    <div key={index} className="forecast-card-detailed">
                      <p className="forecast-date">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      <img src={day.day.condition.icon} alt={day.day.condition.text} className="forecast-icon" />
                      <p className="forecast-temp">
                        <span className="temp-high">{Math.round(day.day.maxtemp_c)}°</span>
                        <span className="temp-low">{Math.round(day.day.mintemp_c)}°</span>
                      </p>
                      <p className="forecast-condition">{day.day.condition.text}</p>
                      <div className="forecast-details">
                        <div className="forecast-detail-item">
                          <span>💧 Rain</span>
                          <span>{day.day.daily_chance_of_rain}%</span>
                        </div>
                        <div className="forecast-detail-item">
                          <span>❄️ Snow</span>
                          <span>{day.day.daily_chance_of_snow}%</span>
                        </div>
                        <div className="forecast-detail-item">
                          <span>💨 Wind</span>
                          <span>{day.day.maxwind_kph} km/h</span>
                        </div>
                        <div className="forecast-detail-item">
                          <span>💧 Humidity</span>
                          <span>{day.day.avghumidity}%</span>
                        </div>
                        <div className="forecast-detail-item">
                          <span>☀️ UV</span>
                          <span className={getUvLabel(day.day.uv).class}>{day.day.uv}</span>
                        </div>
                        <div className="forecast-detail-item">
                          <span>🌧️ Precip</span>
                          <span>{day.day.totalprecip_mm} mm</span>
                        </div>
                        <div className="forecast-detail-item">
                          <span>👁️ Visibility</span>
                          <span>{day.day.avgvis_km} km</span>
                        </div>
                      </div>
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
                    {alert.desc && <p className="alert-desc">{alert.desc}</p>}
                    {alert.effective && <p className="alert-time">Effective: {alert.effective}</p>}
                    {alert.expires && <p className="alert-time">Expires: {alert.expires}</p>}
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
