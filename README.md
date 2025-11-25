# Weather App

A modern, responsive weather application built with React that allows users to search for weather information in any city worldwide.

## Features

- 🔍 Search weather by city name with autocomplete suggestions
- 🌡️ Display current temperature in Celsius
- 💧 Show humidity levels
- 💨 Wind speed information
- 🎯 "Feels like" temperature
- 🌤️ UV Index
- 🌬️ Air Quality Index (AQI) with detailed PM2.5/PM10 levels
- 🌅 Sunrise and sunset times
- 🌙 Moon phase and illumination
- 📅 3-day weather forecast
- ⚠️ Weather alerts
- 🎨 Beautiful gradient UI design
- 📱 Fully responsive design

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

This app uses the [WeatherAPI.com](https://www.weatherapi.com/) to fetch weather data including:
- Current weather conditions
- 3-day forecast
- Air quality data
- Astronomy data (sunrise, sunset, moon phase)
- Weather alerts
- City search autocomplete

## Technologies Used

- React 19
- Axios for API calls
- CSS3 with modern features (Grid, Flexbox, Gradients)
- WeatherAPI.com

## License

This project is open source and available under the [MIT License](LICENSE).