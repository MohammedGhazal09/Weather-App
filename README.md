# Weather App

A comprehensive, scientific weather application built with React that provides detailed meteorological data for any city worldwide.

## Features

### Current Weather
- 🌡️ Temperature in Celsius and Fahrenheit
- 🎯 "Feels like" temperature with comfort assessment
- 💧 Humidity with comfort level description
- 🌡️ Dew point with comfort analysis
- ☁️ Cloud cover percentage with sky condition description

### Atmospheric Conditions
- 📊 Barometric pressure with weather prediction
- 👁️ Visibility with clarity assessment
- 💨 Wind speed with Beaufort scale description
- 🧭 Wind direction and degree
- 💥 Wind gust analysis

### UV & Precipitation
- ☀️ UV Index with WHO safety recommendations
- 🌧️ Precipitation levels with intensity description

### Air Quality (Comprehensive)
- 🌬️ US EPA Air Quality Index with health description
- PM2.5 (Fine particles)
- PM10 (Coarse particles)
- O₃ (Ground-level ozone)
- NO₂ (Nitrogen dioxide)
- SO₂ (Sulfur dioxide)
- CO (Carbon monoxide)

### Astronomy
- 🌅 Sunrise and sunset times
- 🌙 Moonrise and moonset times
- 🌓 Moon phase
- 🌕 Moon illumination percentage

### Extended Forecast
- 📅 14-day weather forecast
- Daily high/low temperatures
- Chance of rain and snow
- Maximum wind speeds
- Average humidity and visibility
- UV index per day
- Total precipitation

### Additional Features
- ⚠️ Weather alerts with full details
- 🔍 City search with autocomplete
- 📍 Location coordinates display
- 🕐 Local time for searched city
- 📱 Fully responsive design

## Scientific Descriptions

All weather metrics include descriptive labels to help users understand conditions:
- **UV Index**: Low → Moderate → High → Very High → Extreme
- **Humidity**: Dry → Comfortable → Moderate → Humid
- **Wind**: Calm → Light → Moderate → Fresh → Strong → Gale
- **Visibility**: Very Poor → Poor → Moderate → Good
- **Pressure**: Low (storm likely) → Normal → High (fair weather)
- **Precipitation**: None → Light → Moderate → Heavy
- **Air Quality**: Good → Moderate → Unhealthy for Sensitive → Unhealthy → Very Unhealthy → Hazardous

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Weather-App.git
cd Weather-App
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open in your browser at [http://localhost:3000](http://localhost:3000).

The app loads with Riyadh weather by default, but you can search for any city worldwide.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## API

This app uses the [WeatherAPI.com](https://www.weatherapi.com/) to fetch comprehensive weather data including:
- Current weather conditions with air quality
- 14-day extended forecast with alerts
- Astronomy data (sun and moon)
- City search autocomplete

## Technologies Used

- React 19
- Axios for API calls
- CSS3 with modern features (Grid, Flexbox, Gradients)
- WeatherAPI.com

## License

This project is open source and available under the [MIT License](LICENSE).