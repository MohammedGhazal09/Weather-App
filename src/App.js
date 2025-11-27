import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

// Translations object
const translations = {
  en: {
    title: 'Weather App',
    searchPlaceholder: 'Enter city name...',
    search: 'Search',
    searching: 'Searching...',
    dark: 'Dark',
    light: 'Light',
    myLocation: 'My Location',
    locating: 'Locating...',
    switchToArabic: 'العربية',
    switchToEnglish: 'English',
    failedToFetch: 'Failed to fetch weather data. Please try again.',
    cityNotFound: 'City not found. Please check the city name.',
    locationNotFound: 'Location not found. Please try searching for a city.',
    enterCity: 'Please enter a city name',
    geolocationNotSupported: 'Geolocation is not supported by your browser',
    locationPermissionDenied: 'Location permission denied.',
    locationUnavailable: 'Location information unavailable.',
    locationTimeout: 'Location request timed out.',
    unknownError: 'An unknown error occurred.',
    unableToGetLocation: 'Unable to get your location. ',
    localTime: 'Local Time',
    timezone: 'Timezone',
    lastUpdated: 'Last Updated',
    atmosphericConditions: '🌡️ Atmospheric Conditions',
    windConditions: '💨 Wind Conditions',
    uvPrecipitation: '☀️ UV & Precipitation',
    airQualityIndex: '🌬️ Air Quality Index',
    sunMoonAstronomy: '🌌 Sun & Moon Astronomy',
    extendedForecast: '📅 14-Day Extended Forecast',
    weatherAlerts: '⚠️ Weather Alerts & Warnings',
    humidity: 'Humidity',
    dewPoint: 'Dew Point',
    pressure: 'Barometric Pressure',
    cloudCover: 'Cloud Cover',
    windSpeed: 'Wind Speed',
    windDirection: 'Wind Direction',
    windGust: 'Wind Gust',
    visibility: 'Visibility',
    uvIndex: 'UV Index',
    precipitation: 'Precipitation',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    moonrise: 'Moonrise',
    moonset: 'Moonset',
    moonPhase: 'Moon Phase',
    moonIllumination: 'Moon Illumination',
    rainChance: '💧 Rain Chance',
    snowChance: '❄️ Snow Chance',
    maxWind: '💨 Max Wind',
    avgHumidity: '💧 Avg Humidity',
    totalPrecip: '🌧️ Total Precip',
    totalSnow: '❄️ Total Snow',
    avgVisibility: '👁️ Avg Visibility',
    severity: 'Severity',
    urgency: 'Urgency',
    affectedAreas: 'Affected Areas',
    category: 'Category',
    certainty: 'Certainty',
    instructions: 'Instructions',
    effective: 'Effective',
    expires: 'Expires',
    ukDefraIndex: 'UK DEFRA Index',
    fineParticles: 'PM2.5 (Fine Particles)',
    coarseParticles: 'PM10 (Coarse Particles)',
    ozone: 'O₃ (Ground-level Ozone)',
    nitrogenDioxide: 'NO₂ (Nitrogen Dioxide)',
    sulfurDioxide: 'SO₂ (Sulfur Dioxide)',
    carbonMonoxide: 'CO (Carbon Monoxide)',
    aviation: 'Aviation',
    feels: 'Feels',
    lat: 'Lat',
    lon: 'Lon',
    beginningCivilTwilight: 'Beginning of civil twilight',
    endCivilTwilight: 'End of civil twilight',
    moonAppearsAbove: 'Moon appears above horizon',
    moonDropsBelow: 'Moon drops below horizon',
    windBlowingFrom: 'Wind blowing from the',
    direction: 'direction',
    fromNorth: 'from North',
    // Temperature descriptions
    tempFreezing: 'Freezing',
    tempVeryCold: 'Very Cold',
    tempCold: 'Cold',
    tempCool: 'Cool',
    tempComfortable: 'Comfortable',
    tempWarm: 'Warm',
    tempHot: 'Hot',
    tempVeryHot: 'Very Hot',
    tempExtreme: 'Extreme Heat',
    tempDescFreezing: 'Extreme cold, frostbite risk',
    tempDescVeryCold: 'Below freezing point',
    tempDescCold: 'Winter clothing needed',
    tempDescCool: 'Light jacket recommended',
    tempDescComfortable: 'Ideal temperature range',
    tempDescWarm: 'Light clothing appropriate',
    tempDescHot: 'Stay hydrated',
    tempDescVeryHot: 'Heat stress risk',
    tempDescExtreme: 'Dangerous heat, stay indoors',
    // Humidity descriptions
    humidityVeryDry: 'Very Dry',
    humidityDry: 'Dry',
    humidityComfortable: 'Comfortable',
    humiditySlightlyHumid: 'Slightly Humid',
    humidityHumid: 'Humid',
    humidityVeryHumid: 'Very Humid',
    humidityOppressive: 'Oppressive',
    // Wind descriptions
    windCalm: 'Calm',
    windLightAir: 'Light Air',
    windLightBreeze: 'Light Breeze',
    windGentleBreeze: 'Gentle Breeze',
    windModerateBreeze: 'Moderate Breeze',
    windFreshBreeze: 'Fresh Breeze',
    windStrongBreeze: 'Strong Breeze',
    windNearGale: 'Near Gale',
    windGale: 'Gale',
    windStrongGale: 'Strong Gale',
    windStorm: 'Storm',
    windViolentStorm: 'Violent Storm',
    windHurricane: 'Hurricane Force',
    // AQI descriptions
    aqiGood: 'Good',
    aqiModerate: 'Moderate',
    aqiSensitive: 'Unhealthy for Sensitive',
    aqiUnhealthy: 'Unhealthy',
    aqiVeryUnhealthy: 'Very Unhealthy',
    aqiHazardous: 'Hazardous',
    // UV descriptions
    uvLow: 'Low',
    uvModerate: 'Moderate',
    uvHigh: 'High',
    uvVeryHigh: 'Very High',
    uvExtreme: 'Extreme',
    // Visibility descriptions
    visDenseFog: 'Dense Fog',
    visThickFog: 'Thick Fog',
    visModerateFog: 'Moderate Fog',
    visLightFog: 'Light Fog',
    visMist: 'Mist',
    visHaze: 'Haze',
    visModerate: 'Moderate',
    visGood: 'Good',
    visExcellent: 'Excellent',
    // Pressure descriptions
    pressureVeryLow: 'Very Low',
    pressureLow: 'Low',
    pressureBelowNormal: 'Below Normal',
    pressureNormal: 'Normal',
    pressureAboveNormal: 'Above Normal',
    pressureHigh: 'High',
    // Weather summary helpers
    hotDay: 'Hot day ahead',
    warmConditions: 'Warm conditions',
    pleasantTemps: 'Pleasant temps',
    coolDay: 'Cool day',
    coldConditions: 'Cold conditions',
    expectWet: 'Expect wet conditions.',
    cloudySkies: 'Cloudy skies expected.',
    clearSkies: 'Clear skies.',
    highRainChance: 'High rain chance',
    moderateRainChance: 'Moderate rain chance',
    slightRainChance: 'Slight rain chance',
    extremeUV: 'Extreme UV!',
    highUV: 'High UV.',
    typicalConditions: 'Typical conditions for the day.',
    unknown: 'Unknown',
  },
  ar: {
    title: 'تطبيق الطقس',
    searchPlaceholder: 'أدخل اسم المدينة...',
    search: 'بحث',
    searching: 'جاري البحث...',
    dark: 'داكن',
    light: 'فاتح',
    myLocation: 'موقعي',
    locating: 'جاري التحديد...',
    switchToArabic: 'العربية',
    switchToEnglish: 'English',
    failedToFetch: 'فشل في جلب بيانات الطقس. يرجى المحاولة مرة أخرى.',
    cityNotFound: 'المدينة غير موجودة. يرجى التحقق من اسم المدينة.',
    locationNotFound: 'الموقع غير موجود. يرجى البحث عن مدينة.',
    enterCity: 'يرجى إدخال اسم المدينة',
    geolocationNotSupported: 'تحديد الموقع غير مدعوم في متصفحك',
    locationPermissionDenied: 'تم رفض إذن الموقع.',
    locationUnavailable: 'معلومات الموقع غير متاحة.',
    locationTimeout: 'انتهت مهلة طلب الموقع.',
    unknownError: 'حدث خطأ غير معروف.',
    unableToGetLocation: 'تعذر الحصول على موقعك. ',
    localTime: 'التوقيت المحلي',
    timezone: 'المنطقة الزمنية',
    lastUpdated: 'آخر تحديث',
    atmosphericConditions: '🌡️ الأحوال الجوية',
    windConditions: '💨 أحوال الرياح',
    uvPrecipitation: '☀️ الأشعة فوق البنفسجية والهطول',
    airQualityIndex: '🌬️ مؤشر جودة الهواء',
    sunMoonAstronomy: '🌌 الشمس والقمر',
    extendedForecast: '📅 توقعات 14 يوم',
    weatherAlerts: '⚠️ تنبيهات الطقس',
    humidity: 'الرطوبة',
    dewPoint: 'نقطة الندى',
    pressure: 'الضغط الجوي',
    cloudCover: 'الغطاء السحابي',
    windSpeed: 'سرعة الرياح',
    windDirection: 'اتجاه الرياح',
    windGust: 'هبوب الرياح',
    visibility: 'الرؤية',
    uvIndex: 'مؤشر الأشعة فوق البنفسجية',
    precipitation: 'الهطول',
    sunrise: 'شروق الشمس',
    sunset: 'غروب الشمس',
    moonrise: 'طلوع القمر',
    moonset: 'غروب القمر',
    moonPhase: 'مرحلة القمر',
    moonIllumination: 'إضاءة القمر',
    rainChance: '💧 احتمال المطر',
    snowChance: '❄️ احتمال الثلج',
    maxWind: '💨 أقصى رياح',
    avgHumidity: '💧 متوسط الرطوبة',
    totalPrecip: '🌧️ إجمالي الهطول',
    totalSnow: '❄️ إجمالي الثلج',
    avgVisibility: '👁️ متوسط الرؤية',
    severity: 'الشدة',
    urgency: 'الإلحاح',
    affectedAreas: 'المناطق المتأثرة',
    category: 'الفئة',
    certainty: 'اليقين',
    instructions: 'التعليمات',
    effective: 'ساري من',
    expires: 'ينتهي في',
    ukDefraIndex: 'مؤشر DEFRA البريطاني',
    fineParticles: 'PM2.5 (الجسيمات الدقيقة)',
    coarseParticles: 'PM10 (الجسيمات الخشنة)',
    ozone: 'O₃ (الأوزون الأرضي)',
    nitrogenDioxide: 'NO₂ (ثاني أكسيد النيتروجين)',
    sulfurDioxide: 'SO₂ (ثاني أكسيد الكبريت)',
    carbonMonoxide: 'CO (أول أكسيد الكربون)',
    aviation: 'الطيران',
    feels: 'يشعر',
    lat: 'خط العرض',
    lon: 'خط الطول',
    beginningCivilTwilight: 'بداية الشفق المدني',
    endCivilTwilight: 'نهاية الشفق المدني',
    moonAppearsAbove: 'القمر يظهر فوق الأفق',
    moonDropsBelow: 'القمر ينزل تحت الأفق',
    windBlowingFrom: 'الرياح تهب من',
    direction: 'الاتجاه',
    fromNorth: 'من الشمال',
    // Temperature descriptions
    tempFreezing: 'متجمد',
    tempVeryCold: 'بارد جداً',
    tempCold: 'بارد',
    tempCool: 'معتدل البرودة',
    tempComfortable: 'مريح',
    tempWarm: 'دافئ',
    tempHot: 'حار',
    tempVeryHot: 'حار جداً',
    tempExtreme: 'حرارة شديدة',
    tempDescFreezing: 'برودة شديدة، خطر قضمة الصقيع',
    tempDescVeryCold: 'تحت نقطة التجمد',
    tempDescCold: 'ملابس شتوية مطلوبة',
    tempDescCool: 'سترة خفيفة مستحسنة',
    tempDescComfortable: 'نطاق درجة حرارة مثالي',
    tempDescWarm: 'ملابس خفيفة مناسبة',
    tempDescHot: 'حافظ على الترطيب',
    tempDescVeryHot: 'خطر الإجهاد الحراري',
    tempDescExtreme: 'حرارة خطيرة، ابق في الداخل',
    // Humidity descriptions
    humidityVeryDry: 'جاف جداً',
    humidityDry: 'جاف',
    humidityComfortable: 'مريح',
    humiditySlightlyHumid: 'رطب قليلاً',
    humidityHumid: 'رطب',
    humidityVeryHumid: 'رطب جداً',
    humidityOppressive: 'خانق',
    // Wind descriptions
    windCalm: 'هادئ',
    windLightAir: 'نسيم خفيف جداً',
    windLightBreeze: 'نسيم خفيف',
    windGentleBreeze: 'نسيم لطيف',
    windModerateBreeze: 'نسيم معتدل',
    windFreshBreeze: 'نسيم منعش',
    windStrongBreeze: 'نسيم قوي',
    windNearGale: 'قريب من العاصفة',
    windGale: 'عاصفة',
    windStrongGale: 'عاصفة قوية',
    windStorm: 'عاصفة شديدة',
    windViolentStorm: 'عاصفة عنيفة',
    windHurricane: 'قوة إعصار',
    // AQI descriptions
    aqiGood: 'جيد',
    aqiModerate: 'معتدل',
    aqiSensitive: 'غير صحي للحساسين',
    aqiUnhealthy: 'غير صحي',
    aqiVeryUnhealthy: 'غير صحي جداً',
    aqiHazardous: 'خطير',
    // UV descriptions
    uvLow: 'منخفض',
    uvModerate: 'معتدل',
    uvHigh: 'مرتفع',
    uvVeryHigh: 'مرتفع جداً',
    uvExtreme: 'شديد',
    // Visibility descriptions
    visDenseFog: 'ضباب كثيف',
    visThickFog: 'ضباب سميك',
    visModerateFog: 'ضباب معتدل',
    visLightFog: 'ضباب خفيف',
    visMist: 'رذاذ',
    visHaze: 'غبش',
    visModerate: 'معتدل',
    visGood: 'جيد',
    visExcellent: 'ممتاز',
    // Pressure descriptions
    pressureVeryLow: 'منخفض جداً',
    pressureLow: 'منخفض',
    pressureBelowNormal: 'أقل من الطبيعي',
    pressureNormal: 'طبيعي',
    pressureAboveNormal: 'أعلى من الطبيعي',
    pressureHigh: 'مرتفع',
    // Weather summary helpers
    hotDay: 'يوم حار قادم',
    warmConditions: 'أجواء دافئة',
    pleasantTemps: 'درجات حرارة لطيفة',
    coolDay: 'يوم بارد',
    coldConditions: 'أجواء باردة',
    expectWet: 'توقع أجواء ممطرة.',
    cloudySkies: 'سماء غائمة متوقعة.',
    clearSkies: 'سماء صافية.',
    highRainChance: 'احتمال مطر عالي',
    moderateRainChance: 'احتمال مطر معتدل',
    slightRainChance: 'احتمال مطر خفيف',
    extremeUV: 'أشعة UV شديدة!',
    highUV: 'أشعة UV مرتفعة.',
    typicalConditions: 'أجواء نموذجية لهذا اليوم.',
    unknown: 'غير معروف',
  }
};

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
  const [language, setLanguage] = useState(() => {
    try {
      const savedLang = localStorage.getItem('weatherAppLanguage');
      return savedLang || 'en';
    } catch {
      return 'en';
    }
  });
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  const API_KEY = '16e76914aa244ae3bc8141253252511';
  const BASE_URL = 'https://api.weatherapi.com/v1';
  
  // Get translation helper - wrapped in useCallback to prevent unnecessary rerenders
  const t = useCallback((key) => translations[language][key] || translations.en[key] || key, [language]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('weatherAppTheme', theme);
    } catch {
      // localStorage may be unavailable in some environments
    }
  }, [theme]);

  // Apply language direction
  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
    try {
      localStorage.setItem('weatherAppLanguage', language);
    } catch {
      // localStorage may be unavailable in some environments
    }
  }, [language]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'en' ? 'ar' : 'en');
  };

  // Fetch weather by city
  const fetchWeatherData = useCallback(async (searchCity) => {
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
        setError(t('cityNotFound'));
      } else {
        setError(t('failedToFetch'));
      }
      setWeather(null);
      setForecast(null);
      setAstronomy(null);
    } finally {
      setLoading(false);
    }
  }, [t]);

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
        setError(t('locationNotFound'));
      } else {
        setError(t('failedToFetch'));
      }
      setWeather(null);
      setForecast(null);
      setAstronomy(null);
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    setLocationLoading(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError(t('geolocationNotSupported'));
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
        let errorMessage = t('unableToGetLocation');
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage += t('locationPermissionDenied');
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage += t('locationUnavailable');
            break;
          case err.TIMEOUT:
            errorMessage += t('locationTimeout');
            break;
          default:
            errorMessage += t('unknownError');
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
  }, [fetchWeatherByCoords, fetchWeatherData, t]);

  useEffect(() => {
    // Try to get user's location on initial load
    getCurrentLocation();
  }, [getCurrentLocation]);

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
      setError(t('enterCity'));
      return;
    }
    fetchWeatherData(city);
  };

  const formatDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', options);
  };

  // Temperature description
  const getTempLabel = (tempC) => {
    if (tempC === null || tempC === undefined) return { label: t('unknown'), class: '', desc: '' };
    if (tempC < -10) return { label: t('tempFreezing'), class: 'temp-freezing', desc: t('tempDescFreezing') };
    if (tempC < 0) return { label: t('tempVeryCold'), class: 'temp-very-cold', desc: t('tempDescVeryCold') };
    if (tempC < 10) return { label: t('tempCold'), class: 'temp-cold', desc: t('tempDescCold') };
    if (tempC < 18) return { label: t('tempCool'), class: 'temp-cool', desc: t('tempDescCool') };
    if (tempC < 24) return { label: t('tempComfortable'), class: 'temp-comfortable', desc: t('tempDescComfortable') };
    if (tempC < 30) return { label: t('tempWarm'), class: 'temp-warm', desc: t('tempDescWarm') };
    if (tempC < 35) return { label: t('tempHot'), class: 'temp-hot', desc: t('tempDescHot') };
    if (tempC < 40) return { label: t('tempVeryHot'), class: 'temp-very-hot', desc: t('tempDescVeryHot') };
    return { label: t('tempExtreme'), class: 'temp-extreme', desc: t('tempDescExtreme') };
  };

  // Air Quality Index description with health impacts
  const getAqiLabel = (aqi) => {
    if (!aqi || aqi < 1 || aqi > 6) return t('unknown');
    const labels = [t('aqiGood'), t('aqiModerate'), t('aqiSensitive'), t('aqiUnhealthy'), t('aqiVeryUnhealthy'), t('aqiHazardous')];
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
    if (maxTemp >= 35) summary += t('hotDay') + ' (' + Math.round(minTemp) + '°-' + Math.round(maxTemp) + '°C). ';
    else if (maxTemp >= 28) summary += t('warmConditions') + ' (' + Math.round(minTemp) + '°-' + Math.round(maxTemp) + '°C). ';
    else if (maxTemp >= 20) summary += t('pleasantTemps') + ' (' + Math.round(minTemp) + '°-' + Math.round(maxTemp) + '°C). ';
    else if (maxTemp >= 10) summary += t('coolDay') + ' (' + Math.round(minTemp) + '°-' + Math.round(maxTemp) + '°C). ';
    else summary += t('coldConditions') + ' (' + Math.round(minTemp) + '°-' + Math.round(maxTemp) + '°C). ';
    
    // Condition summary
    if (condition.includes('rain') || condition.includes('shower')) summary += t('expectWet') + ' ';
    else if (condition.includes('cloud')) summary += t('cloudySkies') + ' ';
    else if (condition.includes('sun') || condition.includes('clear')) summary += t('clearSkies') + ' ';
    
    // Rain summary
    if (rainChance >= 70) summary += t('highRainChance') + ' (' + rainChance + '%). ';
    else if (rainChance >= 40) summary += t('moderateRainChance') + ' (' + rainChance + '%). ';
    else if (rainChance >= 20) summary += t('slightRainChance') + ' (' + rainChance + '%). ';
    
    // UV summary
    if (uv >= 8) summary += t('extremeUV');
    else if (uv >= 6) summary += t('highUV');
    
    return summary || t('typicalConditions');
  };

  return (
    <div className={`app ${theme}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container">
        <div className="header-controls">
          <button 
            className="language-toggle" 
            onClick={toggleLanguage}
            aria-label={`Switch to ${language === 'en' ? 'Arabic' : 'English'}`}
          >
            🌐
            <span className="language-label">{language === 'en' ? t('switchToArabic') : t('switchToEnglish')}</span>
          </button>
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
            <span className="theme-label">{theme === 'light' ? t('dark') : t('light')}</span>
          </button>
          <button 
            className="location-button" 
            onClick={getCurrentLocation}
            disabled={locationLoading}
            aria-label="Get current location"
          >
            {locationLoading ? '⏳' : '📍'}
            <span className="location-label">
              {locationLoading ? t('locating') : t('myLocation')}
            </span>
          </button>
        </div>

        <h1 className="title">{t('title')}</h1>
        <p className="date">{formatDate()}</p>

        {locationError && <p className="location-notice">{locationError}</p>}
        
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
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
            {loading ? t('searching') : t('search')}
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
                  {weather.location.region} • {t('lat')}: {weather.location.lat}° {t('lon')}: {weather.location.lon}°
                </p>
                <p className="local-time">{t('localTime')}: {weather.location.localtime}</p>
                <p className="timezone-info">{t('timezone')}: {weather.location.tz_id}</p>
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
                {t('feels')} {getFeelsLikeLabel(weather.current.temp_c, weather.current.feelslike_c).label}: {Math.round(weather.current.feelslike_c)}°C ({Math.round(weather.current.feelslike_f)}°F)
              </div>
              <p className="feels-cause">{getFeelsLikeLabel(weather.current.temp_c, weather.current.feelslike_c).cause}</p>
              <p className="last-updated">{t('lastUpdated')}: {weather.current.last_updated}</p>
            </div>

            {/* Atmospheric Conditions */}
            <div className="section-container">
              <h3 className="section-title">{t('atmosphericConditions')}</h3>
              <div className="weather-details-grid">
                <div className="detail-card">
                  <span className="detail-icon">💧</span>
                  <span className="detail-label">{t('humidity')}</span>
                  <span className="detail-value">{weather.current.humidity}%</span>
                  <span className={`detail-badge ${getHumidityLabel(weather.current.humidity).class}`}>
                    {getHumidityLabel(weather.current.humidity).label}
                  </span>
                  <span className="detail-desc">{getHumidityLabel(weather.current.humidity).desc}</span>
                  <span className="detail-health">{getHumidityLabel(weather.current.humidity).health}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-icon">🌡️</span>
                  <span className="detail-label">{t('dewPoint')}</span>
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
                  <span className="detail-label">{t('pressure')}</span>
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
                  <span className="detail-label">{t('cloudCover')}</span>
                  <span className="detail-value">{weather.current.cloud}%</span>
                  <span className={`detail-badge ${getCloudLabel(weather.current.cloud).class}`}>
                    {getCloudLabel(weather.current.cloud).label}
                  </span>
                  <span className="detail-desc">{getCloudLabel(weather.current.cloud).desc}</span>
                  <span className="detail-type">{t('aviation')}: {getCloudLabel(weather.current.cloud).type}</span>
                </div>
              </div>
            </div>

            {/* Wind Conditions */}
            <div className="section-container wind-section">
              <h3 className="section-title">{t('windConditions')}</h3>
              <div className="weather-details-grid">
                <div className="detail-card">
                  <span className="detail-icon">🌬️</span>
                  <span className="detail-label">{t('windSpeed')}</span>
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
                  <span className="detail-label">{t('windDirection')}</span>
                  <span className="detail-value">{weather.current.wind_dir}</span>
                  <span className="detail-sub">{weather.current.wind_degree}° {t('fromNorth')}</span>
                  <span className="detail-desc">{t('windBlowingFrom')} {weather.current.wind_dir} {t('direction')}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-icon">💥</span>
                  <span className="detail-label">{t('windGust')}</span>
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
                  <span className="detail-label">{t('visibility')}</span>
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
              <h3 className="section-title">{t('uvPrecipitation')}</h3>
              <div className="weather-details-grid">
                <div className="detail-card">
                  <span className="detail-icon">🌞</span>
                  <span className="detail-label">{t('uvIndex')}</span>
                  <span className="detail-value">{weather.current.uv}</span>
                  <span className={`detail-badge ${getUvLabel(weather.current.uv).class}`}>
                    {getUvLabel(weather.current.uv).label}
                  </span>
                  <span className="detail-desc">{getUvLabel(weather.current.uv).desc}</span>
                  <span className="detail-protection">{getUvLabel(weather.current.uv).protection}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-icon">🌧️</span>
                  <span className="detail-label">{t('precipitation')}</span>
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
                <h3 className="section-title">{t('airQualityIndex')}</h3>
                <div className={`aqi-badge ${getAqiClass(weather.current.air_quality['us-epa-index'])}`}>
                  {getAqiLabel(weather.current.air_quality['us-epa-index'])}
                </div>
                <p className="aqi-health-impact">{getAqiHealth(weather.current.air_quality['us-epa-index'])}</p>
                <div className="aqi-grid">
                  <div className="aqi-item">
                    <span className="aqi-label">{t('fineParticles')}</span>
                    <span className="aqi-value">{weather.current.air_quality.pm2_5 != null ? weather.current.air_quality.pm2_5.toFixed(1) : 'N/A'} µg/m³</span>
                    <span className={`aqi-item-badge ${getPM25Label(weather.current.air_quality.pm2_5).class}`}>
                      {getPM25Label(weather.current.air_quality.pm2_5).label}
                    </span>
                    <span className="aqi-desc">{getPM25Label(weather.current.air_quality.pm2_5).desc}</span>
                  </div>
                  <div className="aqi-item">
                    <span className="aqi-label">{t('coarseParticles')}</span>
                    <span className="aqi-value">{weather.current.air_quality.pm10 != null ? weather.current.air_quality.pm10.toFixed(1) : 'N/A'} µg/m³</span>
                    <span className="aqi-desc">Dust, pollen, and mold spores</span>
                  </div>
                  <div className="aqi-item">
                    <span className="aqi-label">{t('ozone')}</span>
                    <span className="aqi-value">{weather.current.air_quality.o3 != null ? weather.current.air_quality.o3.toFixed(1) : 'N/A'} µg/m³</span>
                    <span className={`aqi-item-badge ${getOzoneLabel(weather.current.air_quality.o3).class}`}>
                      {getOzoneLabel(weather.current.air_quality.o3).label}
                    </span>
                    <span className="aqi-desc">{getOzoneLabel(weather.current.air_quality.o3).desc}</span>
                  </div>
                  <div className="aqi-item">
                    <span className="aqi-label">{t('nitrogenDioxide')}</span>
                    <span className="aqi-value">{weather.current.air_quality.no2 != null ? weather.current.air_quality.no2.toFixed(1) : 'N/A'} µg/m³</span>
                    <span className={`aqi-item-badge ${getNO2Label(weather.current.air_quality.no2).class}`}>
                      {getNO2Label(weather.current.air_quality.no2).label}
                    </span>
                    <span className="aqi-desc">{getNO2Label(weather.current.air_quality.no2).desc}</span>
                  </div>
                  <div className="aqi-item">
                    <span className="aqi-label">{t('sulfurDioxide')}</span>
                    <span className="aqi-value">{weather.current.air_quality.so2 != null ? weather.current.air_quality.so2.toFixed(1) : 'N/A'} µg/m³</span>
                    <span className={`aqi-item-badge ${getSO2Label(weather.current.air_quality.so2).class}`}>
                      {getSO2Label(weather.current.air_quality.so2).label}
                    </span>
                    <span className="aqi-desc">{getSO2Label(weather.current.air_quality.so2).desc}</span>
                  </div>
                  <div className="aqi-item">
                    <span className="aqi-label">{t('carbonMonoxide')}</span>
                    <span className="aqi-value">{weather.current.air_quality.co != null ? weather.current.air_quality.co.toFixed(1) : 'N/A'} µg/m³</span>
                    <span className={`aqi-item-badge ${getCOLabel(weather.current.air_quality.co).class}`}>
                      {getCOLabel(weather.current.air_quality.co).label}
                    </span>
                    <span className="aqi-desc">{getCOLabel(weather.current.air_quality.co).desc}</span>
                  </div>
                </div>
                {weather.current.air_quality['gb-defra-index'] && (
                  <p className="aqi-extra">{t('ukDefraIndex')}: {weather.current.air_quality['gb-defra-index']}</p>
                )}
              </div>
            )}

            {astronomy && (
              <div className="astronomy-section">
                <h3 className="section-title">{t('sunMoonAstronomy')}</h3>
                <div className="astronomy-grid">
                  <div className="astronomy-item">
                    <span className="astronomy-icon">🌅</span>
                    <span className="astronomy-label">{t('sunrise')}</span>
                    <span className="astronomy-value">{astronomy.astronomy.astro.sunrise}</span>
                    <span className="astronomy-desc">{t('beginningCivilTwilight')}</span>
                  </div>
                  <div className="astronomy-item">
                    <span className="astronomy-icon">🌇</span>
                    <span className="astronomy-label">{t('sunset')}</span>
                    <span className="astronomy-value">{astronomy.astronomy.astro.sunset}</span>
                    <span className="astronomy-desc">{t('endCivilTwilight')}</span>
                  </div>
                  <div className="astronomy-item">
                    <span className="astronomy-icon">🌙</span>
                    <span className="astronomy-label">{t('moonrise')}</span>
                    <span className="astronomy-value">{astronomy.astronomy.astro.moonrise || 'N/A'}</span>
                    <span className="astronomy-desc">{t('moonAppearsAbove')}</span>
                  </div>
                  <div className="astronomy-item">
                    <span className="astronomy-icon">🌑</span>
                    <span className="astronomy-label">{t('moonset')}</span>
                    <span className="astronomy-value">{astronomy.astronomy.astro.moonset || 'N/A'}</span>
                    <span className="astronomy-desc">{t('moonDropsBelow')}</span>
                  </div>
                  <div className="astronomy-item astronomy-item-wide">
                    <span className="astronomy-icon">🌓</span>
                    <span className="astronomy-label">{t('moonPhase')}</span>
                    <span className="astronomy-value">{astronomy.astronomy.astro.moon_phase}</span>
                    <span className="astronomy-desc">{getMoonPhaseLabel(astronomy.astronomy.astro.moon_phase).desc}</span>
                  </div>
                  <div className="astronomy-item">
                    <span className="astronomy-icon">🌕</span>
                    <span className="astronomy-label">{t('moonIllumination')}</span>
                    <span className="astronomy-value">{astronomy.astronomy.astro.moon_illumination}%</span>
                    <span className="astronomy-desc">{getMoonPhaseLabel(astronomy.astronomy.astro.moon_phase).illuminationDesc}</span>
                  </div>
                </div>
              </div>
            )}

            {forecast && forecast.forecast && (
              <div className="forecast-section">
                <h3 className="section-title">{t('extendedForecast')}</h3>
                <div className="forecast-scroll">
                  {forecast.forecast.forecastday.map((day, index) => (
                    <div key={index} className="forecast-card-detailed">
                      <p className="forecast-date">
                        {new Date(day.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
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
                          <span>{t('rainChance')}</span>
                          <span>{day.day.daily_chance_of_rain}%</span>
                        </div>
                        <div className="forecast-detail-item">
                          <span>{t('snowChance')}</span>
                          <span>{day.day.daily_chance_of_snow}%</span>
                        </div>
                        <div className="forecast-detail-item">
                          <span>{t('maxWind')}</span>
                          <span>{day.day.maxwind_kph} km/h</span>
                        </div>
                        <div className="forecast-detail-item">
                          <span>{t('avgHumidity')}</span>
                          <span>{day.day.avghumidity}%</span>
                        </div>
                        <div className="forecast-detail-item">
                          <span>☀️ {t('uvIndex')}</span>
                          <span className={getUvLabel(day.day.uv).class}>{day.day.uv} ({getUvLabel(day.day.uv).label})</span>
                        </div>
                        <div className="forecast-detail-item">
                          <span>{t('totalPrecip')}</span>
                          <span>{day.day.totalprecip_mm} mm</span>
                        </div>
                        <div className="forecast-detail-item">
                          <span>{t('totalSnow')}</span>
                          <span>{day.day.totalsnow_cm} cm</span>
                        </div>
                        <div className="forecast-detail-item">
                          <span>{t('avgVisibility')}</span>
                          <span>{day.day.avgvis_km} km</span>
                        </div>
                        {day.astro && (
                          <>
                            <div className="forecast-detail-item">
                              <span>🌅 {t('sunrise')}</span>
                              <span>{day.astro.sunrise}</span>
                            </div>
                            <div className="forecast-detail-item">
                              <span>🌇 {t('sunset')}</span>
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
                <h3 className="section-title">{t('weatherAlerts')}</h3>
                {forecast.alerts.alert.map((alert, index) => (
                  <div key={index} className="alert-card">
                    <p className="alert-headline">{alert.headline}</p>
                    <p className="alert-event">{alert.event}</p>
                    {alert.severity && <p className="alert-severity">{t('severity')}: {alert.severity}</p>}
                    {alert.urgency && <p className="alert-urgency">{t('urgency')}: {alert.urgency}</p>}
                    {alert.areas && <p className="alert-areas">{t('affectedAreas')}: {alert.areas}</p>}
                    {alert.category && <p className="alert-category">{t('category')}: {alert.category}</p>}
                    {alert.certainty && <p className="alert-certainty">{t('certainty')}: {alert.certainty}</p>}
                    {alert.desc && <p className="alert-desc">{alert.desc}</p>}
                    {alert.instruction && <p className="alert-instruction">{t('instructions')}: {alert.instruction}</p>}
                    {alert.effective && <p className="alert-time">{t('effective')}: {alert.effective}</p>}
                    {alert.expires && <p className="alert-time">{t('expires')}: {alert.expires}</p>}
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
