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
    // Info tooltip explanations
    infoDewPoint: 'Dew point is the temperature at which air becomes saturated with water vapor. Higher dew points feel more humid and uncomfortable.',
    infoPressure: 'Barometric pressure measures atmospheric weight. Low pressure often brings storms; high pressure usually means clear skies.',
    infoUvIndex: 'UV Index measures ultraviolet radiation from the sun. Higher values mean greater risk of skin damage and sunburn.',
    infoPm25: 'PM2.5 are tiny particles (≤2.5 micrometers) that can penetrate deep into lungs and bloodstream. Sources include vehicle exhaust and smoke.',
    infoPm10: 'PM10 are larger particles (≤10 micrometers) from dust, pollen, and mold. They can irritate airways and worsen respiratory conditions.',
    infoOzone: 'Ground-level ozone (O₃) is created when sunlight reacts with pollutants. It can trigger asthma and reduce lung function.',
    infoNo2: 'Nitrogen dioxide (NO₂) comes from vehicle engines and power plants. It inflames airways and worsens asthma symptoms.',
    infoSo2: 'Sulfur dioxide (SO₂) is produced by burning fossil fuels. It irritates the respiratory system and contributes to acid rain.',
    infoCo: 'Carbon monoxide (CO) is an odorless gas from incomplete combustion. It reduces oxygen delivery to organs and can be fatal at high levels.',
    infoDefra: 'UK DEFRA Index is the UK\'s official air quality scale from 1-10. It combines multiple pollutants into a single health-based rating.',
    infoAqi: 'Air Quality Index (AQI) measures overall air pollution. Higher numbers indicate worse air quality and greater health risks.',
    infoVisibility: 'Visibility is the maximum distance at which objects can be clearly seen. It\'s affected by fog, rain, dust, and pollution.',
    infoHumidity: 'Relative humidity is the percentage of water vapor in the air compared to the maximum possible. High humidity makes heat feel worse.',
    infoCloudCover: 'Cloud cover percentage indicates how much of the sky is obscured by clouds. Aviation codes (SKC, FEW, SCT, BKN, OVC) are used by pilots.',
    infoWindGust: 'Wind gusts are brief increases in wind speed above the sustained wind. Large differences between gusts and sustained winds can be dangerous.',
    infoPrecipitation: 'Precipitation is any form of water falling from clouds, including rain, snow, sleet, and hail. Measured in millimeters or inches.',
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
    // Aria labels for accessibility
    switchToArabicAria: 'Switch to Arabic',
    switchToEnglishAria: 'Switch to English',
    switchToDarkMode: 'Switch to dark mode',
    switchToLightMode: 'Switch to light mode',
    getCurrentLocation: 'Get current location',
    // Detailed AQI health descriptions
    aqiHealthGood: 'Air quality is satisfactory, poses little or no health risk',
    aqiHealthModerate: 'Acceptable quality, moderate health concern for sensitive individuals',
    aqiHealthSensitive: 'Members of sensitive groups may experience health effects',
    aqiHealthUnhealthy: 'Everyone may begin to experience health effects',
    aqiHealthVeryUnhealthy: 'Health alert: everyone may experience serious health effects',
    aqiHealthHazardous: 'Health emergency: entire population is likely to be affected',
    // PM2.5 descriptions
    pm25Good: 'Good',
    pm25Moderate: 'Moderate',
    pm25Sensitive: 'Unhealthy (Sensitive)',
    pm25Unhealthy: 'Unhealthy',
    pm25VeryUnhealthy: 'Very Unhealthy',
    pm25Hazardous: 'Hazardous',
    pm25DescGood: 'Little to no risk',
    pm25DescModerate: 'Acceptable for most',
    pm25DescSensitive: 'Sensitive groups at risk',
    pm25DescUnhealthy: 'Everyone may experience effects',
    pm25DescVeryUnhealthy: 'Serious health effects',
    pm25DescHazardous: 'Emergency conditions',
    // PM10 description
    pm10Desc: 'Dust, pollen, and mold spores',
    // Ozone descriptions
    o3Good: 'Good',
    o3Moderate: 'Moderate',
    o3Sensitive: 'Unhealthy (Sensitive)',
    o3Unhealthy: 'Unhealthy',
    o3VeryUnhealthy: 'Very Unhealthy',
    o3DescGood: 'No health impacts',
    o3DescModerate: 'Unusually sensitive may react',
    o3DescSensitive: 'Reduce prolonged outdoor exertion',
    o3DescUnhealthy: 'Avoid prolonged outdoor exertion',
    o3DescVeryUnhealthy: 'Avoid all outdoor exertion',
    // NO2 descriptions
    no2Good: 'Good',
    no2Moderate: 'Moderate',
    no2Sensitive: 'Unhealthy (Sensitive)',
    no2Unhealthy: 'Unhealthy',
    no2VeryUnhealthy: 'Very Unhealthy',
    no2DescGood: 'Safe levels',
    no2DescModerate: 'Generally acceptable',
    no2DescSensitive: 'May worsen respiratory issues',
    no2DescUnhealthy: 'Respiratory irritation likely',
    no2DescVeryUnhealthy: 'Serious respiratory effects',
    // SO2 descriptions
    so2Good: 'Good',
    so2Moderate: 'Moderate',
    so2Sensitive: 'Unhealthy (Sensitive)',
    so2Unhealthy: 'Unhealthy',
    so2VeryUnhealthy: 'Very Unhealthy',
    so2DescGood: 'No health concern',
    so2DescModerate: 'Acceptable for most',
    so2DescSensitive: 'Asthmatics may react',
    so2DescUnhealthy: 'Breathing difficulties possible',
    so2DescVeryUnhealthy: 'Serious respiratory effects',
    // CO descriptions
    coGood: 'Good',
    coModerate: 'Moderate',
    coSensitive: 'Unhealthy (Sensitive)',
    coUnhealthy: 'Unhealthy',
    coVeryUnhealthy: 'Very Unhealthy',
    coDescGood: 'Safe levels',
    coDescModerate: 'Generally safe',
    coDescSensitive: 'Heart patients may be affected',
    coDescUnhealthy: 'May affect cardiovascular health',
    coDescVeryUnhealthy: 'Significant health risk',
    // UV detailed descriptions
    uvDescLow: 'No protection needed',
    uvDescModerate: 'Seek shade during midday',
    uvDescHigh: 'Reduce sun exposure 10am-4pm',
    uvDescVeryHigh: 'Extra protection essential',
    uvDescExtreme: 'Unprotected skin burns quickly',
    uvProtectionLow: 'Wear sunglasses on bright days',
    uvProtectionModerate: 'Apply SPF 30+ sunscreen, wear hat',
    uvProtectionHigh: 'SPF 30+ sunscreen, protective clothing required',
    uvProtectionVeryHigh: 'SPF 50+ sunscreen, avoid sun 10am-4pm',
    uvProtectionExtreme: 'Stay indoors during peak hours, maximum protection',
    // Humidity detailed descriptions
    humidityDescVeryDry: 'Extremely low moisture',
    humidityDescDry: 'Low moisture levels',
    humidityDescComfortable: 'Ideal humidity range',
    humidityDescSlightlyHumid: 'Slightly elevated moisture',
    humidityDescHumid: 'Noticeable humidity',
    humidityDescVeryHumid: 'High moisture content',
    humidityDescOppressive: 'Extremely high humidity',
    humidityHealthVeryDry: 'May cause dry skin, eyes, and respiratory irritation',
    humidityHealthDry: 'Moisturizer and hydration recommended',
    humidityHealthComfortable: 'Optimal for health and comfort',
    humidityHealthSlightlyHumid: 'Generally comfortable for most people',
    humidityHealthHumid: 'May feel sticky, mold growth possible',
    humidityHealthVeryHumid: 'Discomfort likely, stay hydrated',
    humidityHealthOppressive: 'Heat exhaustion risk, limit outdoor activity',
    // Wind detailed descriptions
    windDescCalm: 'Smoke rises vertically',
    windDescLightAir: 'Smoke drifts with wind',
    windDescLightBreeze: 'Wind felt on face, leaves rustle',
    windDescGentleBreeze: 'Leaves and small twigs move',
    windDescModerateBreeze: 'Small branches move, raises dust',
    windDescFreshBreeze: 'Small trees sway',
    windDescStrongBreeze: 'Large branches move, umbrellas difficult',
    windDescNearGale: 'Whole trees sway, difficult to walk',
    windDescGale: 'Twigs break off trees',
    windDescStrongGale: 'Light structural damage possible',
    windDescStorm: 'Trees uprooted, considerable damage',
    windDescViolentStorm: 'Widespread damage',
    windDescHurricane: 'Devastating damage',
    // Beaufort scale labels
    beaufort0: 'Beaufort 0',
    beaufort1: 'Beaufort 1',
    beaufort2: 'Beaufort 2',
    beaufort3: 'Beaufort 3',
    beaufort4: 'Beaufort 4',
    beaufort5: 'Beaufort 5',
    beaufort6: 'Beaufort 6',
    beaufort7: 'Beaufort 7',
    beaufort8: 'Beaufort 8',
    beaufort9: 'Beaufort 9',
    beaufort10: 'Beaufort 10',
    beaufort11: 'Beaufort 11',
    beaufort12: 'Beaufort 12+',
    // Visibility detailed descriptions
    visDescDenseFog: 'Near zero visibility',
    visDescThickFog: 'Visibility under 200m',
    visDescModerateFog: 'Visibility under 500m',
    visDescLightFog: 'Visibility under 1km',
    visDescMist: 'Visibility 1-2km',
    visDescHaze: 'Visibility 2-4km',
    visDescModerate: 'Visibility 4-10km',
    visDescGood: 'Visibility 10-20km',
    visDescExcellent: 'Visibility over 20km',
    visSafetyDenseFog: 'Extremely dangerous for travel',
    visSafetyThickFog: 'Roads likely closed, avoid travel',
    visSafetyModerateFog: 'Reduce speed significantly, use fog lights',
    visSafetyLightFog: 'Drive with caution, low beams',
    visSafetyMist: 'Reduced visibility, stay alert',
    visSafetyHaze: 'Light haze, drive normally',
    visSafetyModerate: 'Good driving conditions',
    visSafetyGood: 'Clear conditions for travel',
    visSafetyExcellent: 'Crystal clear conditions',
    // Pressure detailed descriptions
    pressureDescVeryLow: 'Storm conditions likely',
    pressureDescLow: 'Unsettled weather',
    pressureDescBelowNormal: 'Slightly unstable',
    pressureDescNormal: 'Stable conditions',
    pressureDescAboveNormal: 'Stable high pressure',
    pressureDescHigh: 'Very stable atmosphere',
    pressureForecastVeryLow: 'Expect severe weather, strong winds',
    pressureForecastLow: 'Rain or storms likely approaching',
    pressureForecastBelowNormal: 'Cloudy with possible precipitation',
    pressureForecastNormal: 'Fair weather expected',
    pressureForecastAboveNormal: 'Clear and dry conditions',
    pressureForecastHigh: 'Extended fair weather likely',
    // Cloud descriptions
    cloudClear: 'Clear',
    cloudFew: 'Few Clouds',
    cloudScattered: 'Scattered',
    cloudBroken: 'Broken',
    cloudMostly: 'Mostly Cloudy',
    cloudOvercast: 'Overcast',
    cloudDescClear: 'Virtually cloudless sky',
    cloudDescFew: '1-2 oktas coverage',
    cloudDescScattered: '3-4 oktas coverage',
    cloudDescBroken: '5-7 oktas coverage',
    cloudDescMostly: '7-8 oktas coverage',
    cloudDescOvercast: 'Complete cloud coverage',
    cloudTypeClear: 'SKC (Sky Clear)',
    cloudTypeFew: 'FEW',
    cloudTypeScattered: 'SCT (Scattered)',
    cloudTypeBroken: 'BKN (Broken)',
    cloudTypeMostly: 'BKN-OVC',
    cloudTypeOvercast: 'OVC (Overcast)',
    // Precipitation descriptions
    precipNone: 'None',
    precipTrace: 'Trace',
    precipLight: 'Light',
    precipModerate: 'Moderate',
    precipHeavy: 'Heavy',
    precipVeryHeavy: 'Very Heavy',
    precipExtreme: 'Extreme',
    precipDescNone: 'No precipitation',
    precipDescTrace: 'Barely measurable',
    precipDescLight: 'Light precipitation',
    precipDescModerate: 'Steady precipitation',
    precipDescHeavy: 'Heavy precipitation',
    precipDescVeryHeavy: 'Intense precipitation',
    precipDescExtreme: 'Torrential precipitation',
    precipIntensityNone: 'Dry conditions',
    precipIntensityTrace: 'Very light drizzle',
    precipIntensityLight: 'Drizzle or light rain',
    precipIntensityModerate: 'Moderate rain, umbrella needed',
    precipIntensityHeavy: 'Heavy rain, flooding possible',
    precipIntensityVeryHeavy: 'Severe rain, flash flood risk',
    precipIntensityExtreme: 'Dangerous flooding likely',
    // Feels Like descriptions
    feelsAccurate: 'Accurate',
    feelsSimilar: 'Similar',
    feelsWarmer: 'Warmer',
    feelsMuchWarmer: 'Much Warmer',
    feelsColder: 'Colder',
    feelsMuchColder: 'Much Colder',
    feelsDescAccurate: 'Feels as shown',
    feelsDescSimilar: 'Close to actual',
    feelsDescWarmer: 'Feels warmer than actual',
    feelsDescMuchWarmer: 'Significantly warmer',
    feelsDescColder: 'Feels colder than actual',
    feelsDescMuchColder: 'Significantly colder',
    feelsCauseAccurate: 'Minimal wind and humidity effect',
    feelsCauseSimilar: 'Minor environmental factors',
    feelsCauseWarmer: 'High humidity trapping heat',
    feelsCauseMuchWarmer: 'Extreme humidity - heat index warning',
    feelsCauseColder: 'Wind chill effect',
    feelsCauseMuchColder: 'Strong wind chill - frostbite risk',
    // Dew Point descriptions
    dewVeryDry: 'Very Dry',
    dewDry: 'Dry',
    dewComfortable: 'Comfortable',
    dewPleasant: 'Pleasant',
    dewSlightlyHumid: 'Slightly Humid',
    dewHumid: 'Humid',
    dewVeryHumid: 'Very Humid',
    dewTropical: 'Tropical',
    dewDescVeryDry: 'Extremely dry air',
    dewDescDry: 'Dry and pleasant',
    dewDescComfortable: 'Comfortable humidity',
    dewDescPleasant: 'Pleasant conditions',
    dewDescSlightlyHumid: 'Becoming noticeable',
    dewDescHumid: 'Humid conditions',
    dewDescVeryHumid: 'Very humid air',
    dewDescTropical: 'Tropical humidity levels',
    dewComfortVeryDry: 'May irritate skin and airways',
    dewComfortDry: 'Very comfortable conditions',
    dewComfortComfortable: 'Ideal for most activities',
    dewComfortPleasant: 'Comfortable for outdoor activities',
    dewComfortSlightlyHumid: 'May feel slightly muggy',
    dewComfortHumid: 'Uncomfortable for some people',
    dewComfortVeryHumid: 'Oppressive, sweating ineffective',
    dewComfortTropical: 'Severely uncomfortable, heat risk',
    // Gust descriptions
    gustSteady: 'Steady',
    gustLight: 'Light Gusts',
    gustGusty: 'Gusty',
    gustVery: 'Very Gusty',
    gustDangerous: 'Dangerous Gusts',
    gustExtreme: 'Extreme Gusts',
    gustDescSteady: 'Consistent wind flow',
    gustDescLight: 'Minor wind variations',
    gustDescGusty: 'Noticeable gusts',
    gustDescVery: 'Strong sudden gusts',
    gustDescDangerous: 'Potentially dangerous',
    gustDescExtreme: 'Extremely dangerous',
    gustImpactSteady: 'Predictable wind conditions',
    gustImpactLight: 'Occasional stronger bursts',
    gustImpactGusty: 'May affect balance, loose items',
    gustImpactVery: 'Difficult conditions for outdoor activities',
    gustImpactDangerous: 'Risk of property damage, stay alert',
    gustImpactExtreme: 'Seek shelter immediately',
    // Moon Phase descriptions
    moonNewMoon: 'New Moon',
    moonWaxingCrescent: 'Waxing Crescent',
    moonFirstQuarter: 'First Quarter',
    moonWaxingGibbous: 'Waxing Gibbous',
    moonFullMoon: 'Full Moon',
    moonWaningGibbous: 'Waning Gibbous',
    moonLastQuarter: 'Last Quarter',
    moonWaningCrescent: 'Waning Crescent',
    moonDescNewMoon: 'Moon not visible from Earth',
    moonDescWaxingCrescent: 'Growing crescent in western sky',
    moonDescFirstQuarter: 'Half moon visible',
    moonDescWaxingGibbous: 'More than half illuminated',
    moonDescFullMoon: 'Fully illuminated face',
    moonDescWaningGibbous: 'Decreasing from full',
    moonDescLastQuarter: 'Half moon, opposite side lit',
    moonDescWaningCrescent: 'Thin crescent before new moon',
    moonIllumNewMoon: '0% illuminated - best for stargazing',
    moonIllumWaxingCrescent: '1-49% illuminated - evening visibility',
    moonIllumFirstQuarter: '50% illuminated - rises at noon',
    moonIllumWaxingGibbous: '51-99% illuminated - bright evenings',
    moonIllumFullMoon: '100% illuminated - rises at sunset',
    moonIllumWaningGibbous: 'Decreasing - rises after sunset',
    moonIllumLastQuarter: '50% illuminated - rises at midnight',
    moonIllumWaningCrescent: 'Decreasing - early morning visibility',
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
    // Info tooltip explanations (Arabic)
    infoDewPoint: 'نقطة الندى هي درجة الحرارة التي يصبح فيها الهواء مشبعاً ببخار الماء. نقاط الندى الأعلى تشعرك برطوبة أكثر وعدم راحة.',
    infoPressure: 'الضغط الجوي يقيس وزن الغلاف الجوي. الضغط المنخفض غالباً يجلب العواصف؛ الضغط المرتفع عادة يعني سماء صافية.',
    infoUvIndex: 'مؤشر الأشعة فوق البنفسجية يقيس الإشعاع فوق البنفسجي من الشمس. القيم الأعلى تعني خطر أكبر على الجلد وحروق الشمس.',
    infoPm25: 'PM2.5 جسيمات دقيقة (≤2.5 ميكرومتر) تخترق الرئتين ومجرى الدم. مصادرها عوادم السيارات والدخان.',
    infoPm10: 'PM10 جسيمات أكبر (≤10 ميكرومتر) من الغبار وحبوب اللقاح والعفن. تهيج الممرات الهوائية وتزيد مشاكل التنفس.',
    infoOzone: 'الأوزون الأرضي (O₃) يتكون عندما يتفاعل ضوء الشمس مع الملوثات. يمكن أن يثير الربو ويقلل وظائف الرئة.',
    infoNo2: 'ثاني أكسيد النيتروجين (NO₂) يأتي من محركات السيارات ومحطات الطاقة. يلهب الممرات الهوائية ويزيد أعراض الربو.',
    infoSo2: 'ثاني أكسيد الكبريت (SO₂) ينتج من حرق الوقود الأحفوري. يهيج الجهاز التنفسي ويساهم في المطر الحمضي.',
    infoCo: 'أول أكسيد الكربون (CO) غاز عديم الرائحة من الاحتراق غير الكامل. يقلل توصيل الأكسجين للأعضاء ويمكن أن يكون قاتلاً بمستويات عالية.',
    infoDefra: 'مؤشر DEFRA البريطاني هو مقياس جودة الهواء الرسمي في المملكة المتحدة من 1-10. يجمع ملوثات متعددة في تصنيف صحي واحد.',
    infoAqi: 'مؤشر جودة الهواء (AQI) يقيس تلوث الهواء الإجمالي. الأرقام الأعلى تشير إلى جودة هواء أسوأ ومخاطر صحية أكبر.',
    infoVisibility: 'الرؤية هي أقصى مسافة يمكن رؤية الأشياء بوضوح. تتأثر بالضباب والمطر والغبار والتلوث.',
    infoHumidity: 'الرطوبة النسبية هي نسبة بخار الماء في الهواء مقارنة بالحد الأقصى الممكن. الرطوبة العالية تجعل الحرارة تبدو أسوأ.',
    infoCloudCover: 'نسبة الغطاء السحابي تشير إلى مقدار السماء المحجوب بالغيوم. رموز الطيران (SKC, FEW, SCT, BKN, OVC) يستخدمها الطيارون.',
    infoWindGust: 'هبوب الرياح هي زيادات قصيرة في سرعة الرياح فوق الرياح المستمرة. الفروق الكبيرة بين الهبوب والرياح المستمرة يمكن أن تكون خطيرة.',
    infoPrecipitation: 'الهطول هو أي شكل من الماء الساقط من الغيوم، بما في ذلك المطر والثلج والصقيع والبَرَد. يُقاس بالملليمتر أو البوصات.',
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
    // Aria labels for accessibility
    switchToArabicAria: 'التبديل إلى العربية',
    switchToEnglishAria: 'التبديل إلى الإنجليزية',
    switchToDarkMode: 'التبديل إلى الوضع الداكن',
    switchToLightMode: 'التبديل إلى الوضع الفاتح',
    getCurrentLocation: 'الحصول على الموقع الحالي',
    // Detailed AQI health descriptions
    aqiHealthGood: 'جودة الهواء مرضية، لا تشكل خطراً صحياً يُذكر',
    aqiHealthModerate: 'جودة مقبولة، قلق صحي معتدل للأفراد الحساسين',
    aqiHealthSensitive: 'قد تتأثر المجموعات الحساسة صحياً',
    aqiHealthUnhealthy: 'قد يبدأ الجميع في الشعور بتأثيرات صحية',
    aqiHealthVeryUnhealthy: 'تحذير صحي: قد يعاني الجميع من تأثيرات صحية خطيرة',
    aqiHealthHazardous: 'طوارئ صحية: من المرجح تأثر جميع السكان',
    // PM2.5 descriptions
    pm25Good: 'جيد',
    pm25Moderate: 'معتدل',
    pm25Sensitive: 'غير صحي (للحساسين)',
    pm25Unhealthy: 'غير صحي',
    pm25VeryUnhealthy: 'غير صحي جداً',
    pm25Hazardous: 'خطير',
    pm25DescGood: 'خطر ضئيل أو معدوم',
    pm25DescModerate: 'مقبول لمعظم الناس',
    pm25DescSensitive: 'المجموعات الحساسة في خطر',
    pm25DescUnhealthy: 'قد يتأثر الجميع',
    pm25DescVeryUnhealthy: 'تأثيرات صحية خطيرة',
    pm25DescHazardous: 'حالة طوارئ',
    // PM10 description
    pm10Desc: 'الغبار وحبوب اللقاح وجراثيم العفن',
    // Ozone descriptions
    o3Good: 'جيد',
    o3Moderate: 'معتدل',
    o3Sensitive: 'غير صحي (للحساسين)',
    o3Unhealthy: 'غير صحي',
    o3VeryUnhealthy: 'غير صحي جداً',
    o3DescGood: 'لا تأثيرات صحية',
    o3DescModerate: 'قد يتفاعل الحساسون بشكل غير معتاد',
    o3DescSensitive: 'قلل من الجهد الخارجي المطول',
    o3DescUnhealthy: 'تجنب الجهد الخارجي المطول',
    o3DescVeryUnhealthy: 'تجنب أي جهد خارجي',
    // NO2 descriptions
    no2Good: 'جيد',
    no2Moderate: 'معتدل',
    no2Sensitive: 'غير صحي (للحساسين)',
    no2Unhealthy: 'غير صحي',
    no2VeryUnhealthy: 'غير صحي جداً',
    no2DescGood: 'مستويات آمنة',
    no2DescModerate: 'مقبول بشكل عام',
    no2DescSensitive: 'قد يفاقم مشاكل الجهاز التنفسي',
    no2DescUnhealthy: 'تهيج تنفسي محتمل',
    no2DescVeryUnhealthy: 'تأثيرات تنفسية خطيرة',
    // SO2 descriptions
    so2Good: 'جيد',
    so2Moderate: 'معتدل',
    so2Sensitive: 'غير صحي (للحساسين)',
    so2Unhealthy: 'غير صحي',
    so2VeryUnhealthy: 'غير صحي جداً',
    so2DescGood: 'لا قلق صحي',
    so2DescModerate: 'مقبول لمعظم الناس',
    so2DescSensitive: 'قد يتفاعل مرضى الربو',
    so2DescUnhealthy: 'صعوبات في التنفس محتملة',
    so2DescVeryUnhealthy: 'تأثيرات تنفسية خطيرة',
    // CO descriptions
    coGood: 'جيد',
    coModerate: 'معتدل',
    coSensitive: 'غير صحي (للحساسين)',
    coUnhealthy: 'غير صحي',
    coVeryUnhealthy: 'غير صحي جداً',
    coDescGood: 'مستويات آمنة',
    coDescModerate: 'آمن بشكل عام',
    coDescSensitive: 'قد يتأثر مرضى القلب',
    coDescUnhealthy: 'قد يؤثر على صحة القلب والأوعية الدموية',
    coDescVeryUnhealthy: 'خطر صحي كبير',
    // UV detailed descriptions
    uvDescLow: 'لا حاجة للحماية',
    uvDescModerate: 'ابحث عن الظل وقت الظهيرة',
    uvDescHigh: 'قلل التعرض للشمس من 10 صباحاً إلى 4 مساءً',
    uvDescVeryHigh: 'الحماية الإضافية ضرورية',
    uvDescExtreme: 'البشرة غير المحمية تحترق بسرعة',
    uvProtectionLow: 'ارتدِ نظارات شمسية في الأيام المشمسة',
    uvProtectionModerate: 'استخدم واقي شمس SPF 30+ وارتدِ قبعة',
    uvProtectionHigh: 'واقي شمس SPF 30+ والملابس الواقية ضرورية',
    uvProtectionVeryHigh: 'واقي شمس SPF 50+، تجنب الشمس من 10 صباحاً إلى 4 مساءً',
    uvProtectionExtreme: 'ابق في الداخل خلال ساعات الذروة، أقصى حماية',
    // Humidity detailed descriptions
    humidityDescVeryDry: 'رطوبة منخفضة للغاية',
    humidityDescDry: 'مستويات رطوبة منخفضة',
    humidityDescComfortable: 'نطاق رطوبة مثالي',
    humidityDescSlightlyHumid: 'رطوبة مرتفعة قليلاً',
    humidityDescHumid: 'رطوبة ملحوظة',
    humidityDescVeryHumid: 'محتوى رطوبة عالي',
    humidityDescOppressive: 'رطوبة عالية للغاية',
    humidityHealthVeryDry: 'قد تسبب جفاف الجلد والعيون وتهيج الجهاز التنفسي',
    humidityHealthDry: 'يُنصح باستخدام مرطب والترطيب',
    humidityHealthComfortable: 'مثالي للصحة والراحة',
    humidityHealthSlightlyHumid: 'مريح بشكل عام لمعظم الناس',
    humidityHealthHumid: 'قد تشعر بالالتصاق، نمو العفن محتمل',
    humidityHealthVeryHumid: 'عدم الراحة محتمل، حافظ على الترطيب',
    humidityHealthOppressive: 'خطر الإنهاك الحراري، قلل النشاط الخارجي',
    // Wind detailed descriptions
    windDescCalm: 'الدخان يرتفع عمودياً',
    windDescLightAir: 'الدخان ينجرف مع الرياح',
    windDescLightBreeze: 'الرياح محسوسة على الوجه، الأوراق تحفحف',
    windDescGentleBreeze: 'الأوراق والأغصان الصغيرة تتحرك',
    windDescModerateBreeze: 'الفروع الصغيرة تتحرك، يثير الغبار',
    windDescFreshBreeze: 'الأشجار الصغيرة تتمايل',
    windDescStrongBreeze: 'الفروع الكبيرة تتحرك، صعوبة في استخدام المظلات',
    windDescNearGale: 'الأشجار كلها تتمايل، صعوبة في المشي',
    windDescGale: 'الأغصان تنكسر من الأشجار',
    windDescStrongGale: 'أضرار هيكلية طفيفة محتملة',
    windDescStorm: 'الأشجار تقتلع، أضرار كبيرة',
    windDescViolentStorm: 'أضرار واسعة النطاق',
    windDescHurricane: 'أضرار مدمرة',
    // Beaufort scale labels
    beaufort0: 'بيوفورت 0',
    beaufort1: 'بيوفورت 1',
    beaufort2: 'بيوفورت 2',
    beaufort3: 'بيوفورت 3',
    beaufort4: 'بيوفورت 4',
    beaufort5: 'بيوفورت 5',
    beaufort6: 'بيوفورت 6',
    beaufort7: 'بيوفورت 7',
    beaufort8: 'بيوفورت 8',
    beaufort9: 'بيوفورت 9',
    beaufort10: 'بيوفورت 10',
    beaufort11: 'بيوفورت 11',
    beaufort12: '+بيوفورت 12',
    // Visibility detailed descriptions
    visDescDenseFog: 'رؤية شبه معدومة',
    visDescThickFog: 'الرؤية أقل من 200 متر',
    visDescModerateFog: 'الرؤية أقل من 500 متر',
    visDescLightFog: 'الرؤية أقل من 1 كم',
    visDescMist: 'الرؤية 1-2 كم',
    visDescHaze: 'الرؤية 2-4 كم',
    visDescModerate: 'الرؤية 4-10 كم',
    visDescGood: 'الرؤية 10-20 كم',
    visDescExcellent: 'الرؤية أكثر من 20 كم',
    visSafetyDenseFog: 'خطير للغاية للسفر',
    visSafetyThickFog: 'الطرق مغلقة على الأرجح، تجنب السفر',
    visSafetyModerateFog: 'خفض السرعة بشكل كبير، استخدم أضواء الضباب',
    visSafetyLightFog: 'قُد بحذر، استخدم الأضواء المنخفضة',
    visSafetyMist: 'رؤية منخفضة، ابق متيقظاً',
    visSafetyHaze: 'غبش خفيف، قُد بشكل طبيعي',
    visSafetyModerate: 'ظروف قيادة جيدة',
    visSafetyGood: 'ظروف صافية للسفر',
    visSafetyExcellent: 'ظروف صافية تماماً',
    // Pressure detailed descriptions
    pressureDescVeryLow: 'ظروف عاصفة محتملة',
    pressureDescLow: 'طقس غير مستقر',
    pressureDescBelowNormal: 'غير مستقر قليلاً',
    pressureDescNormal: 'ظروف مستقرة',
    pressureDescAboveNormal: 'ضغط عالي مستقر',
    pressureDescHigh: 'غلاف جوي مستقر جداً',
    pressureForecastVeryLow: 'توقع طقس قاسي، رياح قوية',
    pressureForecastLow: 'أمطار أو عواصف قادمة على الأرجح',
    pressureForecastBelowNormal: 'غائم مع احتمال هطول',
    pressureForecastNormal: 'طقس جيد متوقع',
    pressureForecastAboveNormal: 'ظروف صافية وجافة',
    pressureForecastHigh: 'طقس جيد ممتد على الأرجح',
    // Cloud descriptions
    cloudClear: 'صافي',
    cloudFew: 'سحب قليلة',
    cloudScattered: 'سحب متفرقة',
    cloudBroken: 'سحب متقطعة',
    cloudMostly: 'غائم في الغالب',
    cloudOvercast: 'ملبد بالغيوم',
    cloudDescClear: 'سماء بلا غيوم تقريباً',
    cloudDescFew: 'تغطية 1-2 أوكتا',
    cloudDescScattered: 'تغطية 3-4 أوكتا',
    cloudDescBroken: 'تغطية 5-7 أوكتا',
    cloudDescMostly: 'تغطية 7-8 أوكتا',
    cloudDescOvercast: 'تغطية سحابية كاملة',
    cloudTypeClear: 'SKC (سماء صافية)',
    cloudTypeFew: 'FEW',
    cloudTypeScattered: 'SCT (متفرقة)',
    cloudTypeBroken: 'BKN (متقطعة)',
    cloudTypeMostly: 'BKN-OVC',
    cloudTypeOvercast: 'OVC (ملبدة)',
    // Precipitation descriptions
    precipNone: 'لا هطول',
    precipTrace: 'أثر',
    precipLight: 'خفيف',
    precipModerate: 'معتدل',
    precipHeavy: 'غزير',
    precipVeryHeavy: 'غزير جداً',
    precipExtreme: 'شديد',
    precipDescNone: 'لا هطول',
    precipDescTrace: 'بالكاد قابل للقياس',
    precipDescLight: 'هطول خفيف',
    precipDescModerate: 'هطول مستقر',
    precipDescHeavy: 'هطول غزير',
    precipDescVeryHeavy: 'هطول شديد',
    precipDescExtreme: 'هطول منهمر',
    precipIntensityNone: 'ظروف جافة',
    precipIntensityTrace: 'رذاذ خفيف جداً',
    precipIntensityLight: 'رذاذ أو مطر خفيف',
    precipIntensityModerate: 'مطر معتدل، مظلة مطلوبة',
    precipIntensityHeavy: 'مطر غزير، فيضان محتمل',
    precipIntensityVeryHeavy: 'مطر شديد، خطر فيضان مفاجئ',
    precipIntensityExtreme: 'فيضان خطير محتمل',
    // Feels Like descriptions
    feelsAccurate: 'دقيق',
    feelsSimilar: 'مشابه',
    feelsWarmer: 'أدفأ',
    feelsMuchWarmer: 'أدفأ بكثير',
    feelsColder: 'أبرد',
    feelsMuchColder: 'أبرد بكثير',
    feelsDescAccurate: 'يشعر كما هو موضح',
    feelsDescSimilar: 'قريب من الفعلي',
    feelsDescWarmer: 'يشعر بأنه أدفأ من الفعلي',
    feelsDescMuchWarmer: 'أدفأ بشكل ملحوظ',
    feelsDescColder: 'يشعر بأنه أبرد من الفعلي',
    feelsDescMuchColder: 'أبرد بشكل ملحوظ',
    feelsCauseAccurate: 'تأثير الرياح والرطوبة ضئيل',
    feelsCauseSimilar: 'عوامل بيئية طفيفة',
    feelsCauseWarmer: 'الرطوبة العالية تحبس الحرارة',
    feelsCauseMuchWarmer: 'رطوبة شديدة - تحذير مؤشر الحرارة',
    feelsCauseColder: 'تأثير برودة الرياح',
    feelsCauseMuchColder: 'برودة رياح قوية - خطر قضمة الصقيع',
    // Dew Point descriptions
    dewVeryDry: 'جاف جداً',
    dewDry: 'جاف',
    dewComfortable: 'مريح',
    dewPleasant: 'لطيف',
    dewSlightlyHumid: 'رطب قليلاً',
    dewHumid: 'رطب',
    dewVeryHumid: 'رطب جداً',
    dewTropical: 'استوائي',
    dewDescVeryDry: 'هواء جاف للغاية',
    dewDescDry: 'جاف ولطيف',
    dewDescComfortable: 'رطوبة مريحة',
    dewDescPleasant: 'ظروف لطيفة',
    dewDescSlightlyHumid: 'أصبحت ملحوظة',
    dewDescHumid: 'ظروف رطبة',
    dewDescVeryHumid: 'هواء رطب جداً',
    dewDescTropical: 'مستويات رطوبة استوائية',
    dewComfortVeryDry: 'قد يهيج الجلد والمجاري الهوائية',
    dewComfortDry: 'ظروف مريحة جداً',
    dewComfortComfortable: 'مثالي لمعظم الأنشطة',
    dewComfortPleasant: 'مريح للأنشطة الخارجية',
    dewComfortSlightlyHumid: 'قد تشعر بالرطوبة قليلاً',
    dewComfortHumid: 'غير مريح لبعض الناس',
    dewComfortVeryHumid: 'خانق، التعرق غير فعال',
    dewComfortTropical: 'غير مريح بشدة، خطر حراري',
    // Gust descriptions
    gustSteady: 'مستقر',
    gustLight: 'هبوب خفيفة',
    gustGusty: 'متقلب',
    gustVery: 'متقلب جداً',
    gustDangerous: 'هبوب خطيرة',
    gustExtreme: 'هبوب شديدة',
    gustDescSteady: 'تدفق رياح ثابت',
    gustDescLight: 'تغيرات طفيفة في الرياح',
    gustDescGusty: 'هبوب ملحوظة',
    gustDescVery: 'هبوب قوية مفاجئة',
    gustDescDangerous: 'خطيرة محتملاً',
    gustDescExtreme: 'خطيرة للغاية',
    gustImpactSteady: 'ظروف رياح يمكن التنبؤ بها',
    gustImpactLight: 'اندفاعات أقوى عرضية',
    gustImpactGusty: 'قد تؤثر على التوازن والأشياء السائبة',
    gustImpactVery: 'ظروف صعبة للأنشطة الخارجية',
    gustImpactDangerous: 'خطر تلف الممتلكات، ابق متيقظاً',
    gustImpactExtreme: 'ابحث عن مأوى فوراً',
    // Moon Phase descriptions
    moonNewMoon: 'قمر جديد',
    moonWaxingCrescent: 'هلال متزايد',
    moonFirstQuarter: 'الربع الأول',
    moonWaxingGibbous: 'أحدب متزايد',
    moonFullMoon: 'بدر',
    moonWaningGibbous: 'أحدب متناقص',
    moonLastQuarter: 'الربع الأخير',
    moonWaningCrescent: 'هلال متناقص',
    moonDescNewMoon: 'القمر غير مرئي من الأرض',
    moonDescWaxingCrescent: 'هلال متزايد في السماء الغربية',
    moonDescFirstQuarter: 'نصف القمر مرئي',
    moonDescWaxingGibbous: 'أكثر من نصف مضيء',
    moonDescFullMoon: 'وجه مضيء بالكامل',
    moonDescWaningGibbous: 'يتناقص من البدر',
    moonDescLastQuarter: 'نصف القمر، الجانب المقابل مضيء',
    moonDescWaningCrescent: 'هلال رفيع قبل القمر الجديد',
    moonIllumNewMoon: 'إضاءة 0% - الأفضل لمراقبة النجوم',
    moonIllumWaxingCrescent: 'إضاءة 1-49% - رؤية مسائية',
    moonIllumFirstQuarter: 'إضاءة 50% - يشرق عند الظهر',
    moonIllumWaxingGibbous: 'إضاءة 51-99% - أمسيات مشرقة',
    moonIllumFullMoon: 'إضاءة 100% - يشرق عند الغروب',
    moonIllumWaningGibbous: 'يتناقص - يشرق بعد الغروب',
    moonIllumLastQuarter: 'إضاءة 50% - يشرق عند منتصف الليل',
    moonIllumWaningCrescent: 'يتناقص - رؤية صباحية مبكرة',
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

  // Info Tooltip component
  const InfoTooltip = ({ infoKey }) => (
    <span className="info-tooltip">
      <span className="info-icon">ⓘ</span>
      <span className="tooltip-text">{t(infoKey)}</span>
    </span>
  );

  // Fetch weather by city - using error codes to avoid t dependency
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
      // Use error keys that will be translated in the render
      if (err.response && err.response.status === 400) {
        setError('ERROR_CITY_NOT_FOUND');
      } else {
        setError('ERROR_FAILED_TO_FETCH');
      }
      setWeather(null);
      setForecast(null);
      setAstronomy(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch weather by coordinates - using error codes to avoid t dependency
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
      // Use error keys that will be translated in the render
      if (err.response && err.response.status === 400) {
        setError('ERROR_LOCATION_NOT_FOUND');
      } else {
        setError('ERROR_FAILED_TO_FETCH');
      }
      setWeather(null);
      setForecast(null);
      setAstronomy(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user's current location - using error codes to avoid t dependency
  const getCurrentLocation = useCallback(() => {
    setLocationLoading(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('ERROR_GEOLOCATION_NOT_SUPPORTED');
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
        // Use error codes that will be translated in the render
        let errorCode = 'ERROR_UNABLE_TO_GET_LOCATION';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorCode = 'ERROR_PERMISSION_DENIED';
            break;
          case err.POSITION_UNAVAILABLE:
            errorCode = 'ERROR_POSITION_UNAVAILABLE';
            break;
          case err.TIMEOUT:
            errorCode = 'ERROR_TIMEOUT';
            break;
          default:
            errorCode = 'ERROR_UNKNOWN';
        }
        setLocationError(errorCode);
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
  }, [fetchWeatherByCoords, fetchWeatherData]);

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
      setError('ERROR_ENTER_CITY');
      return;
    }
    fetchWeatherData(city);
  };

  // Helper function to translate error codes
  const getErrorMessage = (errorCode) => {
    const errorMap = {
      'ERROR_CITY_NOT_FOUND': t('cityNotFound'),
      'ERROR_FAILED_TO_FETCH': t('failedToFetch'),
      'ERROR_LOCATION_NOT_FOUND': t('locationNotFound'),
      'ERROR_GEOLOCATION_NOT_SUPPORTED': t('geolocationNotSupported'),
      'ERROR_UNABLE_TO_GET_LOCATION': t('unableToGetLocation'),
      'ERROR_PERMISSION_DENIED': t('unableToGetLocation') + t('locationPermissionDenied'),
      'ERROR_POSITION_UNAVAILABLE': t('unableToGetLocation') + t('locationUnavailable'),
      'ERROR_TIMEOUT': t('unableToGetLocation') + t('locationTimeout'),
      'ERROR_UNKNOWN': t('unableToGetLocation') + t('unknownError'),
      'ERROR_ENTER_CITY': t('enterCity'),
    };
    return errorMap[errorCode] || errorCode;
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
      t('aqiHealthGood'),
      t('aqiHealthModerate'),
      t('aqiHealthSensitive'),
      t('aqiHealthUnhealthy'),
      t('aqiHealthVeryUnhealthy'),
      t('aqiHealthHazardous')
    ];
    return health[aqi - 1];
  };

  // PM2.5 specific health levels
  const getPM25Label = (pm25) => {
    if (pm25 === null || pm25 === undefined) return { label: t('unknown'), class: '', desc: '' };
    if (pm25 <= 12) return { label: t('pm25Good'), class: 'pm-good', desc: t('pm25DescGood') };
    if (pm25 <= 35.4) return { label: t('pm25Moderate'), class: 'pm-moderate', desc: t('pm25DescModerate') };
    if (pm25 <= 55.4) return { label: t('pm25Sensitive'), class: 'pm-sensitive', desc: t('pm25DescSensitive') };
    if (pm25 <= 150.4) return { label: t('pm25Unhealthy'), class: 'pm-unhealthy', desc: t('pm25DescUnhealthy') };
    if (pm25 <= 250.4) return { label: t('pm25VeryUnhealthy'), class: 'pm-very-unhealthy', desc: t('pm25DescVeryUnhealthy') };
    return { label: t('pm25Hazardous'), class: 'pm-hazardous', desc: t('pm25DescHazardous') };
  };

  // Ozone health levels
  const getOzoneLabel = (o3) => {
    if (o3 === null || o3 === undefined) return { label: t('unknown'), class: '', desc: '' };
    if (o3 <= 54) return { label: t('o3Good'), class: 'o3-good', desc: t('o3DescGood') };
    if (o3 <= 70) return { label: t('o3Moderate'), class: 'o3-moderate', desc: t('o3DescModerate') };
    if (o3 <= 85) return { label: t('o3Sensitive'), class: 'o3-sensitive', desc: t('o3DescSensitive') };
    if (o3 <= 105) return { label: t('o3Unhealthy'), class: 'o3-unhealthy', desc: t('o3DescUnhealthy') };
    return { label: t('o3VeryUnhealthy'), class: 'o3-very-unhealthy', desc: t('o3DescVeryUnhealthy') };
  };

  // NO2 health levels
  const getNO2Label = (no2) => {
    if (no2 === null || no2 === undefined) return { label: t('unknown'), class: '', desc: '' };
    if (no2 <= 53) return { label: t('no2Good'), class: 'no2-good', desc: t('no2DescGood') };
    if (no2 <= 100) return { label: t('no2Moderate'), class: 'no2-moderate', desc: t('no2DescModerate') };
    if (no2 <= 360) return { label: t('no2Sensitive'), class: 'no2-sensitive', desc: t('no2DescSensitive') };
    if (no2 <= 649) return { label: t('no2Unhealthy'), class: 'no2-unhealthy', desc: t('no2DescUnhealthy') };
    return { label: t('no2VeryUnhealthy'), class: 'no2-very-unhealthy', desc: t('no2DescVeryUnhealthy') };
  };

  // SO2 health levels
  const getSO2Label = (so2) => {
    if (so2 === null || so2 === undefined) return { label: t('unknown'), class: '', desc: '' };
    if (so2 <= 35) return { label: t('so2Good'), class: 'so2-good', desc: t('so2DescGood') };
    if (so2 <= 75) return { label: t('so2Moderate'), class: 'so2-moderate', desc: t('so2DescModerate') };
    if (so2 <= 185) return { label: t('so2Sensitive'), class: 'so2-sensitive', desc: t('so2DescSensitive') };
    if (so2 <= 304) return { label: t('so2Unhealthy'), class: 'so2-unhealthy', desc: t('so2DescUnhealthy') };
    return { label: t('so2VeryUnhealthy'), class: 'so2-very-unhealthy', desc: t('so2DescVeryUnhealthy') };
  };

  // CO health levels
  const getCOLabel = (co) => {
    if (co === null || co === undefined) return { label: t('unknown'), class: '', desc: '' };
    if (co <= 4400) return { label: t('coGood'), class: 'co-good', desc: t('coDescGood') };
    if (co <= 9400) return { label: t('coModerate'), class: 'co-moderate', desc: t('coDescModerate') };
    if (co <= 12400) return { label: t('coSensitive'), class: 'co-sensitive', desc: t('coDescSensitive') };
    if (co <= 15400) return { label: t('coUnhealthy'), class: 'co-unhealthy', desc: t('coDescUnhealthy') };
    return { label: t('coVeryUnhealthy'), class: 'co-very-unhealthy', desc: t('coDescVeryUnhealthy') };
  };

  // UV Index description (WHO Standard)
  const getUvLabel = (uv) => {
    if (uv === null || uv === undefined) return { label: t('unknown'), class: '', desc: '', protection: '' };
    if (uv <= 2) return { label: t('uvLow'), class: 'uv-low', desc: t('uvDescLow'), protection: t('uvProtectionLow') };
    if (uv <= 5) return { label: t('uvModerate'), class: 'uv-moderate', desc: t('uvDescModerate'), protection: t('uvProtectionModerate') };
    if (uv <= 7) return { label: t('uvHigh'), class: 'uv-high', desc: t('uvDescHigh'), protection: t('uvProtectionHigh') };
    if (uv <= 10) return { label: t('uvVeryHigh'), class: 'uv-very-high', desc: t('uvDescVeryHigh'), protection: t('uvProtectionVeryHigh') };
    return { label: t('uvExtreme'), class: 'uv-extreme', desc: t('uvDescExtreme'), protection: t('uvProtectionExtreme') };
  };

  // Humidity description with health impacts
  const getHumidityLabel = (humidity) => {
    if (humidity === null || humidity === undefined) return { label: t('unknown'), class: '', desc: '', health: '' };
    if (humidity < 25) return { label: t('humidityVeryDry'), class: 'humidity-very-dry', desc: t('humidityDescVeryDry'), health: t('humidityHealthVeryDry') };
    if (humidity < 30) return { label: t('humidityDry'), class: 'humidity-dry', desc: t('humidityDescDry'), health: t('humidityHealthDry') };
    if (humidity <= 50) return { label: t('humidityComfortable'), class: 'humidity-comfortable', desc: t('humidityDescComfortable'), health: t('humidityHealthComfortable') };
    if (humidity <= 60) return { label: t('humiditySlightlyHumid'), class: 'humidity-slight', desc: t('humidityDescSlightlyHumid'), health: t('humidityHealthSlightlyHumid') };
    if (humidity <= 70) return { label: t('humidityHumid'), class: 'humidity-humid', desc: t('humidityDescHumid'), health: t('humidityHealthHumid') };
    if (humidity <= 80) return { label: t('humidityVeryHumid'), class: 'humidity-very-humid', desc: t('humidityDescVeryHumid'), health: t('humidityHealthVeryHumid') };
    return { label: t('humidityOppressive'), class: 'humidity-oppressive', desc: t('humidityDescOppressive'), health: t('humidityHealthOppressive') };
  };

  // Wind Speed description (Beaufort Scale)
  const getWindLabel = (windKph) => {
    if (windKph === null || windKph === undefined) return { label: t('unknown'), class: '', desc: '', beaufort: '' };
    if (windKph < 1) return { label: t('windCalm'), class: 'wind-calm', desc: t('windDescCalm'), beaufort: t('beaufort0') };
    if (windKph <= 5) return { label: t('windLightAir'), class: 'wind-light-air', desc: t('windDescLightAir'), beaufort: t('beaufort1') };
    if (windKph <= 11) return { label: t('windLightBreeze'), class: 'wind-light', desc: t('windDescLightBreeze'), beaufort: t('beaufort2') };
    if (windKph <= 19) return { label: t('windGentleBreeze'), class: 'wind-gentle', desc: t('windDescGentleBreeze'), beaufort: t('beaufort3') };
    if (windKph <= 28) return { label: t('windModerateBreeze'), class: 'wind-moderate', desc: t('windDescModerateBreeze'), beaufort: t('beaufort4') };
    if (windKph <= 38) return { label: t('windFreshBreeze'), class: 'wind-fresh', desc: t('windDescFreshBreeze'), beaufort: t('beaufort5') };
    if (windKph <= 49) return { label: t('windStrongBreeze'), class: 'wind-strong-breeze', desc: t('windDescStrongBreeze'), beaufort: t('beaufort6') };
    if (windKph <= 61) return { label: t('windNearGale'), class: 'wind-near-gale', desc: t('windDescNearGale'), beaufort: t('beaufort7') };
    if (windKph <= 74) return { label: t('windGale'), class: 'wind-gale', desc: t('windDescGale'), beaufort: t('beaufort8') };
    if (windKph <= 88) return { label: t('windStrongGale'), class: 'wind-strong-gale', desc: t('windDescStrongGale'), beaufort: t('beaufort9') };
    if (windKph <= 102) return { label: t('windStorm'), class: 'wind-storm', desc: t('windDescStorm'), beaufort: t('beaufort10') };
    if (windKph <= 117) return { label: t('windViolentStorm'), class: 'wind-violent', desc: t('windDescViolentStorm'), beaufort: t('beaufort11') };
    return { label: t('windHurricane'), class: 'wind-hurricane', desc: t('windDescHurricane'), beaufort: t('beaufort12') };
  };

  // Visibility description with driving/aviation impact
  const getVisibilityLabel = (visKm) => {
    if (visKm === null || visKm === undefined) return { label: t('unknown'), class: '', desc: '', safety: '' };
    if (visKm < 0.05) return { label: t('visDenseFog'), class: 'vis-dense-fog', desc: t('visDescDenseFog'), safety: t('visSafetyDenseFog') };
    if (visKm < 0.2) return { label: t('visThickFog'), class: 'vis-thick-fog', desc: t('visDescThickFog'), safety: t('visSafetyThickFog') };
    if (visKm < 0.5) return { label: t('visModerateFog'), class: 'vis-mod-fog', desc: t('visDescModerateFog'), safety: t('visSafetyModerateFog') };
    if (visKm < 1) return { label: t('visLightFog'), class: 'vis-light-fog', desc: t('visDescLightFog'), safety: t('visSafetyLightFog') };
    if (visKm < 2) return { label: t('visMist'), class: 'vis-mist', desc: t('visDescMist'), safety: t('visSafetyMist') };
    if (visKm < 4) return { label: t('visHaze'), class: 'vis-haze', desc: t('visDescHaze'), safety: t('visSafetyHaze') };
    if (visKm < 10) return { label: t('visModerate'), class: 'vis-moderate', desc: t('visDescModerate'), safety: t('visSafetyModerate') };
    if (visKm < 20) return { label: t('visGood'), class: 'vis-good', desc: t('visDescGood'), safety: t('visSafetyGood') };
    return { label: t('visExcellent'), class: 'vis-excellent', desc: t('visDescExcellent'), safety: t('visSafetyExcellent') };
  };

  // Pressure description with weather prediction
  const getPressureLabel = (pressureMb) => {
    if (pressureMb === null || pressureMb === undefined) return { label: t('unknown'), class: '', desc: '', forecast: '' };
    if (pressureMb < 980) return { label: t('pressureVeryLow'), class: 'pressure-very-low', desc: t('pressureDescVeryLow'), forecast: t('pressureForecastVeryLow') };
    if (pressureMb < 1000) return { label: t('pressureLow'), class: 'pressure-low', desc: t('pressureDescLow'), forecast: t('pressureForecastLow') };
    if (pressureMb < 1010) return { label: t('pressureBelowNormal'), class: 'pressure-below', desc: t('pressureDescBelowNormal'), forecast: t('pressureForecastBelowNormal') };
    if (pressureMb <= 1020) return { label: t('pressureNormal'), class: 'pressure-normal', desc: t('pressureDescNormal'), forecast: t('pressureForecastNormal') };
    if (pressureMb <= 1030) return { label: t('pressureAboveNormal'), class: 'pressure-above', desc: t('pressureDescAboveNormal'), forecast: t('pressureForecastAboveNormal') };
    return { label: t('pressureHigh'), class: 'pressure-high', desc: t('pressureDescHigh'), forecast: t('pressureForecastHigh') };
  };

  // Cloud Cover description
  const getCloudLabel = (cloud) => {
    if (cloud === null || cloud === undefined) return { label: t('unknown'), class: '', desc: '', type: '' };
    if (cloud <= 5) return { label: t('cloudClear'), class: 'cloud-clear', desc: t('cloudDescClear'), type: t('cloudTypeClear') };
    if (cloud <= 25) return { label: t('cloudFew'), class: 'cloud-few', desc: t('cloudDescFew'), type: t('cloudTypeFew') };
    if (cloud <= 50) return { label: t('cloudScattered'), class: 'cloud-scattered', desc: t('cloudDescScattered'), type: t('cloudTypeScattered') };
    if (cloud <= 75) return { label: t('cloudBroken'), class: 'cloud-broken', desc: t('cloudDescBroken'), type: t('cloudTypeBroken') };
    if (cloud <= 95) return { label: t('cloudMostly'), class: 'cloud-mostly', desc: t('cloudDescMostly'), type: t('cloudTypeMostly') };
    return { label: t('cloudOvercast'), class: 'cloud-overcast', desc: t('cloudDescOvercast'), type: t('cloudTypeOvercast') };
  };

  // Precipitation description with intensity
  const getPrecipLabel = (precipMm) => {
    if (precipMm === null || precipMm === undefined) return { label: t('unknown'), class: '', desc: '', intensity: '' };
    if (precipMm === 0) return { label: t('precipNone'), class: 'precip-none', desc: t('precipDescNone'), intensity: t('precipIntensityNone') };
    if (precipMm < 0.5) return { label: t('precipTrace'), class: 'precip-trace', desc: t('precipDescTrace'), intensity: t('precipIntensityTrace') };
    if (precipMm < 2.5) return { label: t('precipLight'), class: 'precip-light', desc: t('precipDescLight'), intensity: t('precipIntensityLight') };
    if (precipMm < 7.5) return { label: t('precipModerate'), class: 'precip-moderate', desc: t('precipDescModerate'), intensity: t('precipIntensityModerate') };
    if (precipMm < 15) return { label: t('precipHeavy'), class: 'precip-heavy', desc: t('precipDescHeavy'), intensity: t('precipIntensityHeavy') };
    if (precipMm < 30) return { label: t('precipVeryHeavy'), class: 'precip-very-heavy', desc: t('precipDescVeryHeavy'), intensity: t('precipIntensityVeryHeavy') };
    return { label: t('precipExtreme'), class: 'precip-extreme', desc: t('precipDescExtreme'), intensity: t('precipIntensityExtreme') };
  };

  // Feels Like description with cause
  const getFeelsLikeLabel = (actual, feelsLike) => {
    if (actual === null || actual === undefined || feelsLike === null || feelsLike === undefined) return { label: '', class: '', desc: '', cause: '' };
    const diff = feelsLike - actual;
    if (Math.abs(diff) <= 1) return { label: t('feelsAccurate'), class: 'feels-accurate', desc: t('feelsDescAccurate'), cause: t('feelsCauseAccurate') };
    if (Math.abs(diff) <= 3) return { label: t('feelsSimilar'), class: 'feels-similar', desc: t('feelsDescSimilar'), cause: t('feelsCauseSimilar') };
    if (diff > 3 && diff <= 6) return { label: t('feelsWarmer'), class: 'feels-warmer', desc: t('feelsDescWarmer'), cause: t('feelsCauseWarmer') };
    if (diff > 6) return { label: t('feelsMuchWarmer'), class: 'feels-much-warmer', desc: t('feelsDescMuchWarmer'), cause: t('feelsCauseMuchWarmer') };
    if (diff < -3 && diff >= -6) return { label: t('feelsColder'), class: 'feels-colder', desc: t('feelsDescColder'), cause: t('feelsCauseColder') };
    return { label: t('feelsMuchColder'), class: 'feels-much-colder', desc: t('feelsDescMuchColder'), cause: t('feelsCauseMuchColder') };
  };

  // Dew Point description with comfort
  const getDewPointLabel = (dewPoint) => {
    if (dewPoint === null || dewPoint === undefined) return { label: t('unknown'), class: '', desc: '', comfort: '' };
    if (dewPoint < 4) return { label: t('dewVeryDry'), class: 'dew-very-dry', desc: t('dewDescVeryDry'), comfort: t('dewComfortVeryDry') };
    if (dewPoint < 10) return { label: t('dewDry'), class: 'dew-dry', desc: t('dewDescDry'), comfort: t('dewComfortDry') };
    if (dewPoint < 13) return { label: t('dewComfortable'), class: 'dew-comfortable', desc: t('dewDescComfortable'), comfort: t('dewComfortComfortable') };
    if (dewPoint < 16) return { label: t('dewPleasant'), class: 'dew-pleasant', desc: t('dewDescPleasant'), comfort: t('dewComfortPleasant') };
    if (dewPoint < 18) return { label: t('dewSlightlyHumid'), class: 'dew-slight', desc: t('dewDescSlightlyHumid'), comfort: t('dewComfortSlightlyHumid') };
    if (dewPoint < 21) return { label: t('dewHumid'), class: 'dew-humid', desc: t('dewDescHumid'), comfort: t('dewComfortHumid') };
    if (dewPoint < 24) return { label: t('dewVeryHumid'), class: 'dew-very-humid', desc: t('dewDescVeryHumid'), comfort: t('dewComfortVeryHumid') };
    return { label: t('dewTropical'), class: 'dew-tropical', desc: t('dewDescTropical'), comfort: t('dewComfortTropical') };
  };

  // Gust description with impact
  const getGustLabel = (gustKph, windKph) => {
    if (gustKph === null || gustKph === undefined || windKph === null || windKph === undefined) return { label: t('unknown'), class: '', desc: '', impact: '' };
    const ratio = gustKph / Math.max(windKph, 1);
    const gustSpeed = gustKph;
    if (ratio < 1.2) return { label: t('gustSteady'), class: 'gust-steady', desc: t('gustDescSteady'), impact: t('gustImpactSteady') };
    if (ratio < 1.4) return { label: t('gustLight'), class: 'gust-light', desc: t('gustDescLight'), impact: t('gustImpactLight') };
    if (ratio < 1.6 && gustSpeed < 50) return { label: t('gustGusty'), class: 'gust-gusty', desc: t('gustDescGusty'), impact: t('gustImpactGusty') };
    if (ratio < 1.8 && gustSpeed < 70) return { label: t('gustVery'), class: 'gust-very', desc: t('gustDescVery'), impact: t('gustImpactVery') };
    if (gustSpeed < 90) return { label: t('gustDangerous'), class: 'gust-dangerous', desc: t('gustDescDangerous'), impact: t('gustImpactDangerous') };
    return { label: t('gustExtreme'), class: 'gust-extreme', desc: t('gustDescExtreme'), impact: t('gustImpactExtreme') };
  };

  // Moon Phase description
  const getMoonPhaseLabel = (phase) => {
    if (!phase) return { desc: '', illuminationDesc: '' };
    const phases = {
      'New Moon': { desc: t('moonDescNewMoon'), illuminationDesc: t('moonIllumNewMoon') },
      'Waxing Crescent': { desc: t('moonDescWaxingCrescent'), illuminationDesc: t('moonIllumWaxingCrescent') },
      'First Quarter': { desc: t('moonDescFirstQuarter'), illuminationDesc: t('moonIllumFirstQuarter') },
      'Waxing Gibbous': { desc: t('moonDescWaxingGibbous'), illuminationDesc: t('moonIllumWaxingGibbous') },
      'Full Moon': { desc: t('moonDescFullMoon'), illuminationDesc: t('moonIllumFullMoon') },
      'Waning Gibbous': { desc: t('moonDescWaningGibbous'), illuminationDesc: t('moonIllumWaningGibbous') },
      'Last Quarter': { desc: t('moonDescLastQuarter'), illuminationDesc: t('moonIllumLastQuarter') },
      'Waning Crescent': { desc: t('moonDescWaningCrescent'), illuminationDesc: t('moonIllumWaningCrescent') }
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
            aria-label={language === 'en' ? t('switchToArabicAria') : t('switchToEnglishAria')}
          >
            🌐
            <span className="language-label">{language === 'en' ? t('switchToArabic') : t('switchToEnglish')}</span>
          </button>
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={theme === 'light' ? t('switchToDarkMode') : t('switchToLightMode')}
          >
            {theme === 'light' ? '🌙' : '☀️'}
            <span className="theme-label">{theme === 'light' ? t('dark') : t('light')}</span>
          </button>
          <button 
            className="location-button" 
            onClick={getCurrentLocation}
            disabled={locationLoading}
            aria-label={t('getCurrentLocation')}
          >
            {locationLoading ? '⏳' : '📍'}
            <span className="location-label">
              {locationLoading ? t('locating') : t('myLocation')}
            </span>
          </button>
        </div>

        <h1 className="title">{t('title')}</h1>
        <p className="date">{formatDate()}</p>

        {locationError && <p className="location-notice">{getErrorMessage(locationError)}</p>}
        
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

        {error && <p className="error">{getErrorMessage(error)}</p>}

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
                  <span className="detail-label label-with-info">{t('humidity')}<InfoTooltip infoKey="infoHumidity" /></span>
                  <span className="detail-value">{weather.current.humidity}%</span>
                  <span className={`detail-badge ${getHumidityLabel(weather.current.humidity).class}`}>
                    {getHumidityLabel(weather.current.humidity).label}
                  </span>
                  <span className="detail-desc">{getHumidityLabel(weather.current.humidity).desc}</span>
                  <span className="detail-health">{getHumidityLabel(weather.current.humidity).health}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-icon">🌡️</span>
                  <span className="detail-label label-with-info">{t('dewPoint')}<InfoTooltip infoKey="infoDewPoint" /></span>
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
                  <span className="detail-label label-with-info">{t('pressure')}<InfoTooltip infoKey="infoPressure" /></span>
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
                  <span className="detail-label label-with-info">{t('cloudCover')}<InfoTooltip infoKey="infoCloudCover" /></span>
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
                  <span className="detail-label label-with-info">{t('windGust')}<InfoTooltip infoKey="infoWindGust" /></span>
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
                  <span className="detail-label label-with-info">{t('visibility')}<InfoTooltip infoKey="infoVisibility" /></span>
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
                  <span className="detail-label label-with-info">{t('uvIndex')}<InfoTooltip infoKey="infoUvIndex" /></span>
                  <span className="detail-value">{weather.current.uv}</span>
                  <span className={`detail-badge ${getUvLabel(weather.current.uv).class}`}>
                    {getUvLabel(weather.current.uv).label}
                  </span>
                  <span className="detail-desc">{getUvLabel(weather.current.uv).desc}</span>
                  <span className="detail-protection">{getUvLabel(weather.current.uv).protection}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-icon">🌧️</span>
                  <span className="detail-label label-with-info">{t('precipitation')}<InfoTooltip infoKey="infoPrecipitation" /></span>
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
                <h3 className="section-title label-with-info">{t('airQualityIndex')}<InfoTooltip infoKey="infoAqi" /></h3>
                <div className={`aqi-badge ${getAqiClass(weather.current.air_quality['us-epa-index'])}`}>
                  {getAqiLabel(weather.current.air_quality['us-epa-index'])}
                </div>
                <p className="aqi-health-impact">{getAqiHealth(weather.current.air_quality['us-epa-index'])}</p>
                <div className="aqi-grid">
                  <div className="aqi-item">
                    <span className="aqi-label label-with-info">{t('fineParticles')}<InfoTooltip infoKey="infoPm25" /></span>
                    <span className="aqi-value">{weather.current.air_quality.pm2_5 != null ? weather.current.air_quality.pm2_5.toFixed(1) : 'N/A'} µg/m³</span>
                    <span className={`aqi-item-badge ${getPM25Label(weather.current.air_quality.pm2_5).class}`}>
                      {getPM25Label(weather.current.air_quality.pm2_5).label}
                    </span>
                    <span className="aqi-desc">{getPM25Label(weather.current.air_quality.pm2_5).desc}</span>
                  </div>
                  <div className="aqi-item">
                    <span className="aqi-label label-with-info">{t('coarseParticles')}<InfoTooltip infoKey="infoPm10" /></span>
                    <span className="aqi-value">{weather.current.air_quality.pm10 != null ? weather.current.air_quality.pm10.toFixed(1) : 'N/A'} µg/m³</span>
                    <span className="aqi-desc">{t('pm10Desc')}</span>
                  </div>
                  <div className="aqi-item">
                    <span className="aqi-label label-with-info">{t('ozone')}<InfoTooltip infoKey="infoOzone" /></span>
                    <span className="aqi-value">{weather.current.air_quality.o3 != null ? weather.current.air_quality.o3.toFixed(1) : 'N/A'} µg/m³</span>
                    <span className={`aqi-item-badge ${getOzoneLabel(weather.current.air_quality.o3).class}`}>
                      {getOzoneLabel(weather.current.air_quality.o3).label}
                    </span>
                    <span className="aqi-desc">{getOzoneLabel(weather.current.air_quality.o3).desc}</span>
                  </div>
                  <div className="aqi-item">
                    <span className="aqi-label label-with-info">{t('nitrogenDioxide')}<InfoTooltip infoKey="infoNo2" /></span>
                    <span className="aqi-value">{weather.current.air_quality.no2 != null ? weather.current.air_quality.no2.toFixed(1) : 'N/A'} µg/m³</span>
                    <span className={`aqi-item-badge ${getNO2Label(weather.current.air_quality.no2).class}`}>
                      {getNO2Label(weather.current.air_quality.no2).label}
                    </span>
                    <span className="aqi-desc">{getNO2Label(weather.current.air_quality.no2).desc}</span>
                  </div>
                  <div className="aqi-item">
                    <span className="aqi-label label-with-info">{t('sulfurDioxide')}<InfoTooltip infoKey="infoSo2" /></span>
                    <span className="aqi-value">{weather.current.air_quality.so2 != null ? weather.current.air_quality.so2.toFixed(1) : 'N/A'} µg/m³</span>
                    <span className={`aqi-item-badge ${getSO2Label(weather.current.air_quality.so2).class}`}>
                      {getSO2Label(weather.current.air_quality.so2).label}
                    </span>
                    <span className="aqi-desc">{getSO2Label(weather.current.air_quality.so2).desc}</span>
                  </div>
                  <div className="aqi-item">
                    <span className="aqi-label label-with-info">{t('carbonMonoxide')}<InfoTooltip infoKey="infoCo" /></span>
                    <span className="aqi-value">{weather.current.air_quality.co != null ? weather.current.air_quality.co.toFixed(1) : 'N/A'} µg/m³</span>
                    <span className={`aqi-item-badge ${getCOLabel(weather.current.air_quality.co).class}`}>
                      {getCOLabel(weather.current.air_quality.co).label}
                    </span>
                    <span className="aqi-desc">{getCOLabel(weather.current.air_quality.co).desc}</span>
                  </div>
                </div>
                {weather.current.air_quality['gb-defra-index'] && (
                  <p className="aqi-extra label-with-info">{t('ukDefraIndex')}: {weather.current.air_quality['gb-defra-index']}<InfoTooltip infoKey="infoDefra" /></p>
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
