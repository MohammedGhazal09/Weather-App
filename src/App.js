import { useState, useEffect, useCallback } from 'react';
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
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('weatherAppTheme');
      return savedTheme || 'light';
    } catch {
      return 'light';
    }
  });
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  const API_KEY = '16e76914aa244ae3bc8141253252511';
  const BASE_URL = 'https://api.weatherapi.com/v1';

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('weatherAppTheme', theme);
    } catch {
      // localStorage may be unavailable in some environments
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Fetch weather by coordinates
  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    setError('');
    setSuggestions([]);

    try {
      const coordQuery = `${lat},${lon}`;
      const [currentRes, forecastRes, astronomyRes] = await Promise.all([
        axios.get(`${BASE_URL}/current.json`, {
          params: { key: API_KEY, q: coordQuery, aqi: 'yes' }
        }),
        axios.get(`${BASE_URL}/forecast.json`, {
          params: { key: API_KEY, q: coordQuery, days: 14, alerts: 'yes' }
        }),
        axios.get(`${BASE_URL}/astronomy.json`, {
          params: { key: API_KEY, q: coordQuery, dt: new Date().toISOString().split('T')[0] }
        })
      ]);

      setWeather(currentRes.data);
      setForecast(forecastRes.data);
      setAstronomy(astronomyRes.data);
      setCity(currentRes.data.location.name);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('Location not found. Please try searching for a city.');
      } else {
        setError('Failed to fetch weather data. Please try again.');
      }
      setWeather(null);
      setForecast(null);
      setAstronomy(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    setLocationLoading(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLocationLoading(false);
      // Fallback to Riyadh
      fetchWeatherData('Riyadh');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
        setLocationLoading(false);
      },
      (err) => {
        let errorMessage = 'Unable to get your location. ';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage += 'Location permission denied.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage += 'Location information unavailable.';
            break;
          case err.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
        }
        setLocationError(errorMessage);
        setLocationLoading(false);
        // Fallback to Riyadh
        fetchWeatherData('Riyadh');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes cache
      }
    );
  }, [fetchWeatherByCoords]);

  useEffect(() => {
    // Try to get user's location on initial load
    getCurrentLocation();
  }, [getCurrentLocation]);

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

  // Temperature description
  const getTempLabel = (tempC) => {
    if (tempC === null || tempC === undefined) return { label: 'Unknown', class: '', desc: '' };
    if (tempC < -10) return { label: 'Freezing', class: 'temp-freezing', desc: 'Extreme cold, frostbite risk' };
    if (tempC < 0) return { label: 'Very Cold', class: 'temp-very-cold', desc: 'Below freezing point' };
    if (tempC < 10) return { label: 'Cold', class: 'temp-cold', desc: 'Winter clothing needed' };
    if (tempC < 18) return { label: 'Cool', class: 'temp-cool', desc: 'Light jacket recommended' };
    if (tempC < 24) return { label: 'Comfortable', class: 'temp-comfortable', desc: 'Ideal temperature range' };
    if (tempC < 30) return { label: 'Warm', class: 'temp-warm', desc: 'Light clothing appropriate' };
    if (tempC < 35) return { label: 'Hot', class: 'temp-hot', desc: 'Stay hydrated' };
    if (tempC < 40) return { label: 'Very Hot', class: 'temp-very-hot', desc: 'Heat stress risk' };
    return { label: 'Extreme Heat', class: 'temp-extreme', desc: 'Dangerous heat, stay indoors' };
  };

  // Air Quality Index description with health impacts
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

  const getAqiHealth = (aqi) => {
    if (!aqi || aqi < 1 || aqi > 6) return '';
    const health = [
      'Air quality is satisfactory, poses little or no health risk',
      'Acceptable quality, moderate health concern for sensitive individuals',
      'Members of sensitive groups may experience health effects',
      'Everyone may begin to experience health effects',
      'Health alert: everyone may experience serious health effects',
      'Health emergency: entire population is likely to be affected'
    ];
    return health[aqi - 1];
  };

  // PM2.5 specific health levels
  const getPM25Label = (pm25) => {
    if (pm25 === null || pm25 === undefined) return { label: 'Unknown', class: '', desc: '' };
    if (pm25 <= 12) return { label: 'Good', class: 'pm-good', desc: 'Little to no risk' };
    if (pm25 <= 35.4) return { label: 'Moderate', class: 'pm-moderate', desc: 'Acceptable for most' };
    if (pm25 <= 55.4) return { label: 'Unhealthy (Sensitive)', class: 'pm-sensitive', desc: 'Sensitive groups at risk' };
    if (pm25 <= 150.4) return { label: 'Unhealthy', class: 'pm-unhealthy', desc: 'Everyone may experience effects' };
    if (pm25 <= 250.4) return { label: 'Very Unhealthy', class: 'pm-very-unhealthy', desc: 'Serious health effects' };
    return { label: 'Hazardous', class: 'pm-hazardous', desc: 'Emergency conditions' };
  };

  // Ozone health levels
  const getOzoneLabel = (o3) => {
    if (o3 === null || o3 === undefined) return { label: 'Unknown', class: '', desc: '' };
    if (o3 <= 54) return { label: 'Good', class: 'o3-good', desc: 'No health impacts' };
    if (o3 <= 70) return { label: 'Moderate', class: 'o3-moderate', desc: 'Unusually sensitive may react' };
    if (o3 <= 85) return { label: 'Unhealthy (Sensitive)', class: 'o3-sensitive', desc: 'Reduce prolonged outdoor exertion' };
    if (o3 <= 105) return { label: 'Unhealthy', class: 'o3-unhealthy', desc: 'Avoid prolonged outdoor exertion' };
    return { label: 'Very Unhealthy', class: 'o3-very-unhealthy', desc: 'Avoid all outdoor exertion' };
  };

  // NO2 health levels
  const getNO2Label = (no2) => {
    if (no2 === null || no2 === undefined) return { label: 'Unknown', class: '', desc: '' };
    if (no2 <= 53) return { label: 'Good', class: 'no2-good', desc: 'Safe levels' };
    if (no2 <= 100) return { label: 'Moderate', class: 'no2-moderate', desc: 'Generally acceptable' };
    if (no2 <= 360) return { label: 'Unhealthy (Sensitive)', class: 'no2-sensitive', desc: 'May worsen respiratory issues' };
    if (no2 <= 649) return { label: 'Unhealthy', class: 'no2-unhealthy', desc: 'Respiratory irritation likely' };
    return { label: 'Very Unhealthy', class: 'no2-very-unhealthy', desc: 'Serious respiratory effects' };
  };

  // SO2 health levels
  const getSO2Label = (so2) => {
    if (so2 === null || so2 === undefined) return { label: 'Unknown', class: '', desc: '' };
    if (so2 <= 35) return { label: 'Good', class: 'so2-good', desc: 'No health concern' };
    if (so2 <= 75) return { label: 'Moderate', class: 'so2-moderate', desc: 'Acceptable for most' };
    if (so2 <= 185) return { label: 'Unhealthy (Sensitive)', class: 'so2-sensitive', desc: 'Asthmatics may react' };
    if (so2 <= 304) return { label: 'Unhealthy', class: 'so2-unhealthy', desc: 'Breathing difficulties possible' };
    return { label: 'Very Unhealthy', class: 'so2-very-unhealthy', desc: 'Serious respiratory effects' };
  };

  // CO health levels
  const getCOLabel = (co) => {
    if (co === null || co === undefined) return { label: 'Unknown', class: '', desc: '' };
    if (co <= 4400) return { label: 'Good', class: 'co-good', desc: 'Safe levels' };
    if (co <= 9400) return { label: 'Moderate', class: 'co-moderate', desc: 'Generally safe' };
    if (co <= 12400) return { label: 'Unhealthy (Sensitive)', class: 'co-sensitive', desc: 'Heart patients may be affected' };
    if (co <= 15400) return { label: 'Unhealthy', class: 'co-unhealthy', desc: 'May affect cardiovascular health' };
    return { label: 'Very Unhealthy', class: 'co-very-unhealthy', desc: 'Significant health risk' };
  };

  // UV Index description (WHO Standard)
  const getUvLabel = (uv) => {
    if (uv === null || uv === undefined) return { label: 'Unknown', class: '', desc: '', protection: '' };
    if (uv <= 2) return { label: 'Low', class: 'uv-low', desc: 'No protection needed', protection: 'Wear sunglasses on bright days' };
    if (uv <= 5) return { label: 'Moderate', class: 'uv-moderate', desc: 'Seek shade during midday', protection: 'Apply SPF 30+ sunscreen, wear hat' };
    if (uv <= 7) return { label: 'High', class: 'uv-high', desc: 'Reduce sun exposure 10am-4pm', protection: 'SPF 30+ sunscreen, protective clothing required' };
    if (uv <= 10) return { label: 'Very High', class: 'uv-very-high', desc: 'Extra protection essential', protection: 'SPF 50+ sunscreen, avoid sun 10am-4pm' };
    return { label: 'Extreme', class: 'uv-extreme', desc: 'Unprotected skin burns quickly', protection: 'Stay indoors during peak hours, maximum protection' };
  };

  // Humidity description with health impacts
  const getHumidityLabel = (humidity) => {
    if (humidity === null || humidity === undefined) return { label: 'Unknown', class: '', desc: '', health: '' };
    if (humidity < 25) return { label: 'Very Dry', class: 'humidity-very-dry', desc: 'Extremely low moisture', health: 'May cause dry skin, eyes, and respiratory irritation' };
    if (humidity < 30) return { label: 'Dry', class: 'humidity-dry', desc: 'Low moisture levels', health: 'Moisturizer and hydration recommended' };
    if (humidity <= 50) return { label: 'Comfortable', class: 'humidity-comfortable', desc: 'Ideal humidity range', health: 'Optimal for health and comfort' };
    if (humidity <= 60) return { label: 'Slightly Humid', class: 'humidity-slight', desc: 'Slightly elevated moisture', health: 'Generally comfortable for most people' };
    if (humidity <= 70) return { label: 'Humid', class: 'humidity-humid', desc: 'Noticeable humidity', health: 'May feel sticky, mold growth possible' };
    if (humidity <= 80) return { label: 'Very Humid', class: 'humidity-very-humid', desc: 'High moisture content', health: 'Discomfort likely, stay hydrated' };
    return { label: 'Oppressive', class: 'humidity-oppressive', desc: 'Extremely high humidity', health: 'Heat exhaustion risk, limit outdoor activity' };
  };

  // Wind Speed description (Beaufort Scale)
  const getWindLabel = (windKph) => {
    if (windKph === null || windKph === undefined) return { label: 'Unknown', class: '', desc: '', beaufort: '' };
    if (windKph < 1) return { label: 'Calm', class: 'wind-calm', desc: 'Smoke rises vertically', beaufort: 'Beaufort 0' };
    if (windKph <= 5) return { label: 'Light Air', class: 'wind-light-air', desc: 'Smoke drifts with wind', beaufort: 'Beaufort 1' };
    if (windKph <= 11) return { label: 'Light Breeze', class: 'wind-light', desc: 'Wind felt on face, leaves rustle', beaufort: 'Beaufort 2' };
    if (windKph <= 19) return { label: 'Gentle Breeze', class: 'wind-gentle', desc: 'Leaves and small twigs move', beaufort: 'Beaufort 3' };
    if (windKph <= 28) return { label: 'Moderate Breeze', class: 'wind-moderate', desc: 'Small branches move, raises dust', beaufort: 'Beaufort 4' };
    if (windKph <= 38) return { label: 'Fresh Breeze', class: 'wind-fresh', desc: 'Small trees sway', beaufort: 'Beaufort 5' };
    if (windKph <= 49) return { label: 'Strong Breeze', class: 'wind-strong-breeze', desc: 'Large branches move, umbrellas difficult', beaufort: 'Beaufort 6' };
    if (windKph <= 61) return { label: 'Near Gale', class: 'wind-near-gale', desc: 'Whole trees sway, difficult to walk', beaufort: 'Beaufort 7' };
    if (windKph <= 74) return { label: 'Gale', class: 'wind-gale', desc: 'Twigs break off trees', beaufort: 'Beaufort 8' };
    if (windKph <= 88) return { label: 'Strong Gale', class: 'wind-strong-gale', desc: 'Light structural damage possible', beaufort: 'Beaufort 9' };
    if (windKph <= 102) return { label: 'Storm', class: 'wind-storm', desc: 'Trees uprooted, considerable damage', beaufort: 'Beaufort 10' };
    if (windKph <= 117) return { label: 'Violent Storm', class: 'wind-violent', desc: 'Widespread damage', beaufort: 'Beaufort 11' };
    return { label: 'Hurricane Force', class: 'wind-hurricane', desc: 'Devastating damage', beaufort: 'Beaufort 12+' };
  };

  // Visibility description with driving/aviation impact
  const getVisibilityLabel = (visKm) => {
    if (visKm === null || visKm === undefined) return { label: 'Unknown', class: '', desc: '', safety: '' };
    if (visKm < 0.05) return { label: 'Dense Fog', class: 'vis-dense-fog', desc: 'Near zero visibility', safety: 'Extremely dangerous for travel' };
    if (visKm < 0.2) return { label: 'Thick Fog', class: 'vis-thick-fog', desc: 'Visibility under 200m', safety: 'Roads likely closed, avoid travel' };
    if (visKm < 0.5) return { label: 'Moderate Fog', class: 'vis-mod-fog', desc: 'Visibility under 500m', safety: 'Reduce speed significantly, use fog lights' };
    if (visKm < 1) return { label: 'Light Fog', class: 'vis-light-fog', desc: 'Visibility under 1km', safety: 'Drive with caution, low beams' };
    if (visKm < 2) return { label: 'Mist', class: 'vis-mist', desc: 'Visibility 1-2km', safety: 'Reduced visibility, stay alert' };
    if (visKm < 4) return { label: 'Haze', class: 'vis-haze', desc: 'Visibility 2-4km', safety: 'Light haze, drive normally' };
    if (visKm < 10) return { label: 'Moderate', class: 'vis-moderate', desc: 'Visibility 4-10km', safety: 'Good driving conditions' };
    if (visKm < 20) return { label: 'Good', class: 'vis-good', desc: 'Visibility 10-20km', safety: 'Clear conditions for travel' };
    return { label: 'Excellent', class: 'vis-excellent', desc: 'Visibility over 20km', safety: 'Crystal clear conditions' };
  };

  // Pressure description with weather prediction
  const getPressureLabel = (pressureMb) => {
    if (pressureMb === null || pressureMb === undefined) return { label: 'Unknown', class: '', desc: '', forecast: '' };
    if (pressureMb < 980) return { label: 'Very Low', class: 'pressure-very-low', desc: 'Storm conditions likely', forecast: 'Expect severe weather, strong winds' };
    if (pressureMb < 1000) return { label: 'Low', class: 'pressure-low', desc: 'Unsettled weather', forecast: 'Rain or storms likely approaching' };
    if (pressureMb < 1010) return { label: 'Below Normal', class: 'pressure-below', desc: 'Slightly unstable', forecast: 'Cloudy with possible precipitation' };
    if (pressureMb <= 1020) return { label: 'Normal', class: 'pressure-normal', desc: 'Stable conditions', forecast: 'Fair weather expected' };
    if (pressureMb <= 1030) return { label: 'Above Normal', class: 'pressure-above', desc: 'Stable high pressure', forecast: 'Clear and dry conditions' };
    return { label: 'High', class: 'pressure-high', desc: 'Very stable atmosphere', forecast: 'Extended fair weather likely' };
  };

  // Cloud Cover description
  const getCloudLabel = (cloud) => {
    if (cloud === null || cloud === undefined) return { label: 'Unknown', class: '', desc: '', type: '' };
    if (cloud <= 5) return { label: 'Clear', class: 'cloud-clear', desc: 'Virtually cloudless sky', type: 'SKC (Sky Clear)' };
    if (cloud <= 25) return { label: 'Few Clouds', class: 'cloud-few', desc: '1-2 oktas coverage', type: 'FEW' };
    if (cloud <= 50) return { label: 'Scattered', class: 'cloud-scattered', desc: '3-4 oktas coverage', type: 'SCT (Scattered)' };
    if (cloud <= 75) return { label: 'Broken', class: 'cloud-broken', desc: '5-7 oktas coverage', type: 'BKN (Broken)' };
    if (cloud <= 95) return { label: 'Mostly Cloudy', class: 'cloud-mostly', desc: '7-8 oktas coverage', type: 'BKN-OVC' };
    return { label: 'Overcast', class: 'cloud-overcast', desc: 'Complete cloud coverage', type: 'OVC (Overcast)' };
  };

  // Precipitation description with intensity
  const getPrecipLabel = (precipMm) => {
    if (precipMm === null || precipMm === undefined) return { label: 'Unknown', class: '', desc: '', intensity: '' };
    if (precipMm === 0) return { label: 'None', class: 'precip-none', desc: 'No precipitation', intensity: 'Dry conditions' };
    if (precipMm < 0.5) return { label: 'Trace', class: 'precip-trace', desc: 'Barely measurable', intensity: 'Very light drizzle' };
    if (precipMm < 2.5) return { label: 'Light', class: 'precip-light', desc: 'Light precipitation', intensity: 'Drizzle or light rain' };
    if (precipMm < 7.5) return { label: 'Moderate', class: 'precip-moderate', desc: 'Steady precipitation', intensity: 'Moderate rain, umbrella needed' };
    if (precipMm < 15) return { label: 'Heavy', class: 'precip-heavy', desc: 'Heavy precipitation', intensity: 'Heavy rain, flooding possible' };
    if (precipMm < 30) return { label: 'Very Heavy', class: 'precip-very-heavy', desc: 'Intense precipitation', intensity: 'Severe rain, flash flood risk' };
    return { label: 'Extreme', class: 'precip-extreme', desc: 'Torrential precipitation', intensity: 'Dangerous flooding likely' };
  };

  // Feels Like description with cause
  const getFeelsLikeLabel = (actual, feelsLike) => {
    if (actual === null || actual === undefined || feelsLike === null || feelsLike === undefined) return { label: '', class: '', desc: '', cause: '' };
    const diff = feelsLike - actual;
    if (Math.abs(diff) <= 1) return { label: 'Accurate', class: 'feels-accurate', desc: 'Feels as shown', cause: 'Minimal wind and humidity effect' };
    if (Math.abs(diff) <= 3) return { label: 'Similar', class: 'feels-similar', desc: 'Close to actual', cause: 'Minor environmental factors' };
    if (diff > 3 && diff <= 6) return { label: 'Warmer', class: 'feels-warmer', desc: 'Feels warmer than actual', cause: 'High humidity trapping heat' };
    if (diff > 6) return { label: 'Much Warmer', class: 'feels-much-warmer', desc: 'Significantly warmer', cause: 'Extreme humidity - heat index warning' };
    if (diff < -3 && diff >= -6) return { label: 'Colder', class: 'feels-colder', desc: 'Feels colder than actual', cause: 'Wind chill effect' };
    return { label: 'Much Colder', class: 'feels-much-colder', desc: 'Significantly colder', cause: 'Strong wind chill - frostbite risk' };
  };

  // Dew Point description with comfort
  const getDewPointLabel = (dewPoint) => {
    if (dewPoint === null || dewPoint === undefined) return { label: 'Unknown', class: '', desc: '', comfort: '' };
    if (dewPoint < 4) return { label: 'Very Dry', class: 'dew-very-dry', desc: 'Extremely dry air', comfort: 'May irritate skin and airways' };
    if (dewPoint < 10) return { label: 'Dry', class: 'dew-dry', desc: 'Dry and pleasant', comfort: 'Very comfortable conditions' };
    if (dewPoint < 13) return { label: 'Comfortable', class: 'dew-comfortable', desc: 'Comfortable humidity', comfort: 'Ideal for most activities' };
    if (dewPoint < 16) return { label: 'Pleasant', class: 'dew-pleasant', desc: 'Pleasant conditions', comfort: 'Comfortable for outdoor activities' };
    if (dewPoint < 18) return { label: 'Slightly Humid', class: 'dew-slight', desc: 'Becoming noticeable', comfort: 'May feel slightly muggy' };
    if (dewPoint < 21) return { label: 'Humid', class: 'dew-humid', desc: 'Humid conditions', comfort: 'Uncomfortable for some people' };
    if (dewPoint < 24) return { label: 'Very Humid', class: 'dew-very-humid', desc: 'Very humid air', comfort: 'Oppressive, sweating ineffective' };
    return { label: 'Tropical', class: 'dew-tropical', desc: 'Tropical humidity levels', comfort: 'Severely uncomfortable, heat risk' };
  };

  // Gust description with impact
  const getGustLabel = (gustKph, windKph) => {
    if (gustKph === null || gustKph === undefined || windKph === null || windKph === undefined) return { label: 'Unknown', class: '', desc: '', impact: '' };
    const ratio = gustKph / Math.max(windKph, 1);
    const gustSpeed = gustKph;
    if (ratio < 1.2) return { label: 'Steady', class: 'gust-steady', desc: 'Consistent wind flow', impact: 'Predictable wind conditions' };
    if (ratio < 1.4) return { label: 'Light Gusts', class: 'gust-light', desc: 'Minor wind variations', impact: 'Occasional stronger bursts' };
    if (ratio < 1.6 && gustSpeed < 50) return { label: 'Gusty', class: 'gust-gusty', desc: 'Noticeable gusts', impact: 'May affect balance, loose items' };
    if (ratio < 1.8 && gustSpeed < 70) return { label: 'Very Gusty', class: 'gust-very', desc: 'Strong sudden gusts', impact: 'Difficult conditions for outdoor activities' };
    if (gustSpeed < 90) return { label: 'Dangerous Gusts', class: 'gust-dangerous', desc: 'Potentially dangerous', impact: 'Risk of property damage, stay alert' };
    return { label: 'Extreme Gusts', class: 'gust-extreme', desc: 'Extremely dangerous', impact: 'Seek shelter immediately' };
  };

  // Moon Phase description
  const getMoonPhaseLabel = (phase) => {
    if (!phase) return { desc: '', illuminationDesc: '' };
    const phases = {
      'New Moon': { desc: 'Moon not visible from Earth', illuminationDesc: '0% illuminated - best for stargazing' },
      'Waxing Crescent': { desc: 'Growing crescent in western sky', illuminationDesc: '1-49% illuminated - evening visibility' },
      'First Quarter': { desc: 'Half moon visible', illuminationDesc: '50% illuminated - rises at noon' },
      'Waxing Gibbous': { desc: 'More than half illuminated', illuminationDesc: '51-99% illuminated - bright evenings' },
      'Full Moon': { desc: 'Fully illuminated face', illuminationDesc: '100% illuminated - rises at sunset' },
      'Waning Gibbous': { desc: 'Decreasing from full', illuminationDesc: 'Decreasing - rises after sunset' },
      'Last Quarter': { desc: 'Half moon, opposite side lit', illuminationDesc: '50% illuminated - rises at midnight' },
      'Waning Crescent': { desc: 'Thin crescent before new moon', illuminationDesc: 'Decreasing - early morning visibility' }
    };
    return phases[phase] || { desc: phase, illuminationDesc: '' };
  };

  // Daily Weather Summary Generator
  const getDailySummary = (day) => {
    const maxTemp = day.day.maxtemp_c;
    const minTemp = day.day.mintemp_c;
    const rainChance = day.day.daily_chance_of_rain;
    const condition = day.day.condition.text.toLowerCase();
    const uv = day.day.uv;
    
    let summary = '';
    
    // Temperature summary with range
    if (maxTemp >= 35) summary += 'Hot day ahead (' + Math.round(minTemp) + '°-' + Math.round(maxTemp) + '°C). ';
    else if (maxTemp >= 28) summary += 'Warm conditions (' + Math.round(minTemp) + '°-' + Math.round(maxTemp) + '°C). ';
    else if (maxTemp >= 20) summary += 'Pleasant temps (' + Math.round(minTemp) + '°-' + Math.round(maxTemp) + '°C). ';
    else if (maxTemp >= 10) summary += 'Cool day (' + Math.round(minTemp) + '°-' + Math.round(maxTemp) + '°C). ';
    else summary += 'Cold conditions (' + Math.round(minTemp) + '°-' + Math.round(maxTemp) + '°C). ';
    
    // Condition summary
    if (condition.includes('rain') || condition.includes('shower')) summary += 'Expect wet conditions. ';
    else if (condition.includes('cloud')) summary += 'Cloudy skies expected. ';
    else if (condition.includes('sun') || condition.includes('clear')) summary += 'Clear skies. ';
    
    // Rain summary
    if (rainChance >= 70) summary += 'High rain chance (' + rainChance + '%). ';
    else if (rainChance >= 40) summary += 'Moderate rain chance (' + rainChance + '%). ';
    else if (rainChance >= 20) summary += 'Slight rain chance (' + rainChance + '%). ';
    
    // UV summary
    if (uv >= 8) summary += 'Extreme UV!';
    else if (uv >= 6) summary += 'High UV.';
    
    return summary || 'Typical conditions for the day.';
  };

  return (
    <div className={`app ${theme}`}>
      <div className="container">
        <div className="header-controls">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
            <span className="theme-label">{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>
          <button 
            className="location-button" 
            onClick={getCurrentLocation}
            disabled={locationLoading}
            aria-label="Get current location"
          >
            {locationLoading ? '⏳' : '📍'}
            <span className="location-label">
              {locationLoading ? 'Locating...' : 'My Location'}
            </span>
          </button>
        </div>

        <h1 className="title">Weather App</h1>
        <p className="date">{formatDate()}</p>

        {locationError && <p className="location-notice">{locationError}</p>}
        
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
                <p className="timezone-info">Timezone: {weather.location.tz_id}</p>
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
              <span className={`temp-badge ${getTempLabel(weather.current.temp_c).class}`}>
                {getTempLabel(weather.current.temp_c).label}
              </span>
              <p className="temp-advice">{getTempLabel(weather.current.temp_c).desc}</p>
              <p className="description">{weather.current.condition.text}</p>
              <div className={`feels-badge ${getFeelsLikeLabel(weather.current.temp_c, weather.current.feelslike_c).class}`}>
                Feels {getFeelsLikeLabel(weather.current.temp_c, weather.current.feelslike_c).label}: {Math.round(weather.current.feelslike_c)}°C ({Math.round(weather.current.feelslike_f)}°F)
              </div>
              <p className="feels-cause">{getFeelsLikeLabel(weather.current.temp_c, weather.current.feelslike_c).cause}</p>
              <p className="last-updated">Last Updated: {weather.current.last_updated}</p>
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
                  <span className="detail-health">{getHumidityLabel(weather.current.humidity).health}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-icon">🌡️</span>
                  <span className="detail-label">Dew Point</span>
                  <span className="detail-value">{weather.current.dewpoint_c != null ? `${weather.current.dewpoint_c}°C` : 'N/A'}</span>
                  <span className="detail-sub">{weather.current.dewpoint_f != null ? `(${weather.current.dewpoint_f}°F)` : ''}</span>
                  <span className={`detail-badge ${getDewPointLabel(weather.current.dewpoint_c).class}`}>
                    {getDewPointLabel(weather.current.dewpoint_c).label}
                  </span>
                  <span className="detail-desc">{getDewPointLabel(weather.current.dewpoint_c).desc}</span>
                  <span className="detail-comfort">{getDewPointLabel(weather.current.dewpoint_c).comfort}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-icon">📊</span>
                  <span className="detail-label">Barometric Pressure</span>
                  <span className="detail-value">{weather.current.pressure_mb} hPa</span>
                  <span className="detail-sub">({weather.current.pressure_in} inHg)</span>
                  <span className={`detail-badge ${getPressureLabel(weather.current.pressure_mb).class}`}>
                    {getPressureLabel(weather.current.pressure_mb).label}
                  </span>
                  <span className="detail-desc">{getPressureLabel(weather.current.pressure_mb).desc}</span>
                  <span className="detail-forecast">{getPressureLabel(weather.current.pressure_mb).forecast}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-icon">☁️</span>
                  <span className="detail-label">Cloud Cover</span>
                  <span className="detail-value">{weather.current.cloud}%</span>
                  <span className={`detail-badge ${getCloudLabel(weather.current.cloud).class}`}>
                    {getCloudLabel(weather.current.cloud).label}
                  </span>
                  <span className="detail-desc">{getCloudLabel(weather.current.cloud).desc}</span>
                  <span className="detail-type">Aviation: {getCloudLabel(weather.current.cloud).type}</span>
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
                  <span className="detail-beaufort">{getWindLabel(weather.current.wind_kph).beaufort}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-icon">🧭</span>
                  <span className="detail-label">Wind Direction</span>
                  <span className="detail-value">{weather.current.wind_dir}</span>
                  <span className="detail-sub">{weather.current.wind_degree}° from North</span>
                  <span className="detail-desc">Wind blowing from the {weather.current.wind_dir} direction</span>
                </div>
                <div className="detail-card">
                  <span className="detail-icon">💥</span>
                  <span className="detail-label">Wind Gust</span>
                  <span className="detail-value">{weather.current.gust_kph} km/h</span>
                  <span className="detail-sub">({weather.current.gust_mph} mph)</span>
                  <span className={`detail-badge ${getGustLabel(weather.current.gust_kph, weather.current.wind_kph).class}`}>
                    {getGustLabel(weather.current.gust_kph, weather.current.wind_kph).label}
                  </span>
                  <span className="detail-desc">{getGustLabel(weather.current.gust_kph, weather.current.wind_kph).desc}</span>
                  <span className="detail-impact">{getGustLabel(weather.current.gust_kph, weather.current.wind_kph).impact}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-icon">👁️</span>
                  <span className="detail-label">Visibility</span>
                  <span className="detail-value">{weather.current.vis_km} km</span>
                  <span className="detail-sub">({weather.current.vis_miles} miles)</span>
                  <span className={`detail-badge ${getVisibilityLabel(weather.current.vis_km).class}`}>
                    {getVisibilityLabel(weather.current.vis_km).label}
                  </span>
                  <span className="detail-desc">{getVisibilityLabel(weather.current.vis_km).desc}</span>
                  <span className="detail-safety">{getVisibilityLabel(weather.current.vis_km).safety}</span>
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
                  <span className="detail-protection">{getUvLabel(weather.current.uv).protection}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-icon">🌧️</span>
                  <span className="detail-label">Precipitation</span>
                  <span className="detail-value">{weather.current.precip_mm} mm</span>
                  <span className="detail-sub">({weather.current.precip_in} in)</span>
                  <span className={`detail-badge ${getPrecipLabel(weather.current.precip_mm).class}`}>
                    {getPrecipLabel(weather.current.precip_mm).label}
                  </span>
                  <span className="detail-desc">{getPrecipLabel(weather.current.precip_mm).desc}</span>
                  <span className="detail-intensity">{getPrecipLabel(weather.current.precip_mm).intensity}</span>
                </div>
              </div>
            </div>

            {weather.current.air_quality && (
              <div className="aqi-section">
                <h3 className="section-title">🌬️ Air Quality Index</h3>
                <div className={`aqi-badge ${getAqiClass(weather.current.air_quality['us-epa-index'])}`}>
                  {getAqiLabel(weather.current.air_quality['us-epa-index'])}
                </div>
                <p className="aqi-health-impact">{getAqiHealth(weather.current.air_quality['us-epa-index'])}</p>
                <div className="aqi-grid">
                  <div className="aqi-item">
                    <span className="aqi-label">PM2.5 (Fine Particles)</span>
                    <span className="aqi-value">{weather.current.air_quality.pm2_5 != null ? weather.current.air_quality.pm2_5.toFixed(1) : 'N/A'} µg/m³</span>
                    <span className={`aqi-item-badge ${getPM25Label(weather.current.air_quality.pm2_5).class}`}>
                      {getPM25Label(weather.current.air_quality.pm2_5).label}
                    </span>
                    <span className="aqi-desc">{getPM25Label(weather.current.air_quality.pm2_5).desc}</span>
                  </div>
                  <div className="aqi-item">
                    <span className="aqi-label">PM10 (Coarse Particles)</span>
                    <span className="aqi-value">{weather.current.air_quality.pm10 != null ? weather.current.air_quality.pm10.toFixed(1) : 'N/A'} µg/m³</span>
                    <span className="aqi-desc">Dust, pollen, and mold spores</span>
                  </div>
                  <div className="aqi-item">
                    <span className="aqi-label">O₃ (Ground-level Ozone)</span>
                    <span className="aqi-value">{weather.current.air_quality.o3 != null ? weather.current.air_quality.o3.toFixed(1) : 'N/A'} µg/m³</span>
                    <span className={`aqi-item-badge ${getOzoneLabel(weather.current.air_quality.o3).class}`}>
                      {getOzoneLabel(weather.current.air_quality.o3).label}
                    </span>
                    <span className="aqi-desc">{getOzoneLabel(weather.current.air_quality.o3).desc}</span>
                  </div>
                  <div className="aqi-item">
                    <span className="aqi-label">NO₂ (Nitrogen Dioxide)</span>
                    <span className="aqi-value">{weather.current.air_quality.no2 != null ? weather.current.air_quality.no2.toFixed(1) : 'N/A'} µg/m³</span>
                    <span className={`aqi-item-badge ${getNO2Label(weather.current.air_quality.no2).class}`}>
                      {getNO2Label(weather.current.air_quality.no2).label}
                    </span>
                    <span className="aqi-desc">{getNO2Label(weather.current.air_quality.no2).desc}</span>
                  </div>
                  <div className="aqi-item">
                    <span className="aqi-label">SO₂ (Sulfur Dioxide)</span>
                    <span className="aqi-value">{weather.current.air_quality.so2 != null ? weather.current.air_quality.so2.toFixed(1) : 'N/A'} µg/m³</span>
                    <span className={`aqi-item-badge ${getSO2Label(weather.current.air_quality.so2).class}`}>
                      {getSO2Label(weather.current.air_quality.so2).label}
                    </span>
                    <span className="aqi-desc">{getSO2Label(weather.current.air_quality.so2).desc}</span>
                  </div>
                  <div className="aqi-item">
                    <span className="aqi-label">CO (Carbon Monoxide)</span>
                    <span className="aqi-value">{weather.current.air_quality.co != null ? weather.current.air_quality.co.toFixed(1) : 'N/A'} µg/m³</span>
                    <span className={`aqi-item-badge ${getCOLabel(weather.current.air_quality.co).class}`}>
                      {getCOLabel(weather.current.air_quality.co).label}
                    </span>
                    <span className="aqi-desc">{getCOLabel(weather.current.air_quality.co).desc}</span>
                  </div>
                </div>
                {weather.current.air_quality['gb-defra-index'] && (
                  <p className="aqi-extra">UK DEFRA Index: {weather.current.air_quality['gb-defra-index']}</p>
                )}
              </div>
            )}

            {astronomy && (
              <div className="astronomy-section">
                <h3 className="section-title">🌌 Sun & Moon Astronomy</h3>
                <div className="astronomy-grid">
                  <div className="astronomy-item">
                    <span className="astronomy-icon">🌅</span>
                    <span className="astronomy-label">Sunrise</span>
                    <span className="astronomy-value">{astronomy.astronomy.astro.sunrise}</span>
                    <span className="astronomy-desc">Beginning of civil twilight</span>
                  </div>
                  <div className="astronomy-item">
                    <span className="astronomy-icon">🌇</span>
                    <span className="astronomy-label">Sunset</span>
                    <span className="astronomy-value">{astronomy.astronomy.astro.sunset}</span>
                    <span className="astronomy-desc">End of civil twilight</span>
                  </div>
                  <div className="astronomy-item">
                    <span className="astronomy-icon">🌙</span>
                    <span className="astronomy-label">Moonrise</span>
                    <span className="astronomy-value">{astronomy.astronomy.astro.moonrise || 'N/A'}</span>
                    <span className="astronomy-desc">Moon appears above horizon</span>
                  </div>
                  <div className="astronomy-item">
                    <span className="astronomy-icon">🌑</span>
                    <span className="astronomy-label">Moonset</span>
                    <span className="astronomy-value">{astronomy.astronomy.astro.moonset || 'N/A'}</span>
                    <span className="astronomy-desc">Moon drops below horizon</span>
                  </div>
                  <div className="astronomy-item astronomy-item-wide">
                    <span className="astronomy-icon">🌓</span>
                    <span className="astronomy-label">Moon Phase</span>
                    <span className="astronomy-value">{astronomy.astronomy.astro.moon_phase}</span>
                    <span className="astronomy-desc">{getMoonPhaseLabel(astronomy.astronomy.astro.moon_phase).desc}</span>
                  </div>
                  <div className="astronomy-item">
                    <span className="astronomy-icon">🌕</span>
                    <span className="astronomy-label">Moon Illumination</span>
                    <span className="astronomy-value">{astronomy.astronomy.astro.moon_illumination}%</span>
                    <span className="astronomy-desc">{getMoonPhaseLabel(astronomy.astronomy.astro.moon_phase).illuminationDesc}</span>
                  </div>
                </div>
              </div>
            )}

            {forecast && forecast.forecast && (
              <div className="forecast-section">
                <h3 className="section-title">📅 14-Day Extended Forecast</h3>
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
                      <span className={`forecast-temp-badge ${getTempLabel(day.day.maxtemp_c).class}`}>
                        {getTempLabel(day.day.maxtemp_c).label}
                      </span>
                      <p className="forecast-condition">{day.day.condition.text}</p>
                      <p className="forecast-summary">{getDailySummary(day)}</p>
                      <div className="forecast-details">
                        <div className="forecast-detail-item">
                          <span>💧 Rain Chance</span>
                          <span>{day.day.daily_chance_of_rain}%</span>
                        </div>
                        <div className="forecast-detail-item">
                          <span>❄️ Snow Chance</span>
                          <span>{day.day.daily_chance_of_snow}%</span>
                        </div>
                        <div className="forecast-detail-item">
                          <span>💨 Max Wind</span>
                          <span>{day.day.maxwind_kph} km/h</span>
                        </div>
                        <div className="forecast-detail-item">
                          <span>💧 Avg Humidity</span>
                          <span>{day.day.avghumidity}%</span>
                        </div>
                        <div className="forecast-detail-item">
                          <span>☀️ UV Index</span>
                          <span className={getUvLabel(day.day.uv).class}>{day.day.uv} ({getUvLabel(day.day.uv).label})</span>
                        </div>
                        <div className="forecast-detail-item">
                          <span>🌧️ Total Precip</span>
                          <span>{day.day.totalprecip_mm} mm</span>
                        </div>
                        <div className="forecast-detail-item">
                          <span>❄️ Total Snow</span>
                          <span>{day.day.totalsnow_cm} cm</span>
                        </div>
                        <div className="forecast-detail-item">
                          <span>👁️ Avg Visibility</span>
                          <span>{day.day.avgvis_km} km</span>
                        </div>
                        {day.astro && (
                          <>
                            <div className="forecast-detail-item">
                              <span>🌅 Sunrise</span>
                              <span>{day.astro.sunrise}</span>
                            </div>
                            <div className="forecast-detail-item">
                              <span>🌇 Sunset</span>
                              <span>{day.astro.sunset}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {forecast && forecast.alerts && forecast.alerts.alert && forecast.alerts.alert.length > 0 && (
              <div className="alerts-section">
                <h3 className="section-title">⚠️ Weather Alerts & Warnings</h3>
                {forecast.alerts.alert.map((alert, index) => (
                  <div key={index} className="alert-card">
                    <p className="alert-headline">{alert.headline}</p>
                    <p className="alert-event">{alert.event}</p>
                    {alert.severity && <p className="alert-severity">Severity: {alert.severity}</p>}
                    {alert.urgency && <p className="alert-urgency">Urgency: {alert.urgency}</p>}
                    {alert.areas && <p className="alert-areas">Affected Areas: {alert.areas}</p>}
                    {alert.category && <p className="alert-category">Category: {alert.category}</p>}
                    {alert.certainty && <p className="alert-certainty">Certainty: {alert.certainty}</p>}
                    {alert.desc && <p className="alert-desc">{alert.desc}</p>}
                    {alert.instruction && <p className="alert-instruction">Instructions: {alert.instruction}</p>}
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
