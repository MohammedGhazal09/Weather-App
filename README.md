# Weather App

A modern, responsive weather application built with React that allows users to search for weather information in any city worldwide.

## Features

- 🔍 Search weather by city name
- 🌡️ Display current temperature in Celsius
- 💧 Show humidity levels
- 💨 Wind speed information
- 🎯 "Feels like" temperature
- 📊 Atmospheric pressure data
- 🎨 Beautiful gradient UI design
- 📱 Fully responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenWeatherMap API key (get one free at [openweathermap.org](https://openweathermap.org/api))

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

3. Create a `.env` file in the root directory and add your OpenWeatherMap API key:
```
REACT_APP_WEATHER_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm start
```

The app will open in your browser at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## API

This app uses the [OpenWeatherMap API](https://openweathermap.org/api) to fetch weather data. You need a free API key to use this application.

## Technologies Used

- React 19
- Axios for API calls
- CSS3 with modern features (Grid, Flexbox, Gradients)
- OpenWeatherMap API

## License

This project is open source and available under the [MIT License](LICENSE).