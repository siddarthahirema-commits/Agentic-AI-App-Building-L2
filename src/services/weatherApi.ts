import { LocationData, WeatherData, CurrentWeatherData, HourlyForecastData, DailyForecastData } from '../types';

export async function searchCities(query: string): Promise<LocationData[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=8&language=en&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Geocoding request failed with status ${res.status}`);
    }
    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country,
      admin1: item.admin1,
      country_code: item.country_code,
      timezone: item.timezone,
      elevation: item.elevation,
    }));
  } catch (error) {
    console.error('Error in searchCities:', error);
    throw error;
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<LocationData> {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.localityInfo?.administrative?.[2]?.name || 'My Location';
      const country = data.countryName || '';
      const admin1 = data.principalSubdivision || '';
      return {
        id: Math.round(lat * 1000 + lon),
        name: city,
        latitude: lat,
        longitude: lon,
        country: country,
        admin1: admin1,
        country_code: data.countryCode || '',
      };
    }
  } catch (e) {
    console.warn('Reverse geocode failed, using lat/lon label fallback:', e);
  }

  return {
    id: Math.round(lat * 1000 + lon),
    name: `Location (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
    latitude: lat,
    longitude: lon,
    country: 'Current Area',
  };
}

export async function fetchWeatherData(location: LocationData): Promise<WeatherData> {
  const { latitude, longitude } = location;
  const timezone = location.timezone || 'auto';

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index',
    hourly: 'temperature_2m,relative_humidity_2m,weather_code,precipitation_probability,wind_speed_10m,uv_index',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,wind_speed_10m_max',
    timezone: timezone,
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Weather Forecast API error (Status ${res.status})`);
    }
    const data = await res.json();

    const current: CurrentWeatherData = {
      time: data.current.time,
      temperature: data.current.temperature_2m,
      apparent_temperature: data.current.apparent_temperature ?? data.current.temperature_2m,
      relative_humidity: data.current.relative_humidity_2m ?? 50,
      is_day: data.current.is_day ?? 1,
      precipitation: data.current.precipitation ?? 0,
      weather_code: data.current.weather_code ?? 0,
      surface_pressure: data.current.surface_pressure ?? 1013,
      wind_speed: data.current.wind_speed_10m ?? 0,
      wind_direction: data.current.wind_direction_10m ?? 0,
      uv_index: data.current.uv_index ?? 0,
    };

    const hourly: HourlyForecastData = {
      time: data.hourly.time || [],
      temperature_2m: data.hourly.temperature_2m || [],
      relative_humidity_2m: data.hourly.relative_humidity_2m || [],
      weather_code: data.hourly.weather_code || [],
      precipitation_probability: data.hourly.precipitation_probability || [],
      wind_speed_10m: data.hourly.wind_speed_10m || [],
      uv_index: data.hourly.uv_index || [],
    };

    const daily: DailyForecastData = {
      time: data.daily.time || [],
      weather_code: data.daily.weather_code || [],
      temperature_2m_max: data.daily.temperature_2m_max || [],
      temperature_2m_min: data.daily.temperature_2m_min || [],
      sunrise: data.daily.sunrise || [],
      sunset: data.daily.sunset || [],
      uv_index_max: data.daily.uv_index_max || [],
      precipitation_sum: data.daily.precipitation_sum || [],
      wind_speed_10m_max: data.daily.wind_speed_10m_max || [],
    };

    return {
      location: {
        ...location,
        timezone: data.timezone || location.timezone,
      },
      current,
      hourly,
      daily,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

export const POPULAR_CITIES: LocationData[] = [
  { id: 5128581, name: 'New York', country: 'United States', admin1: 'New York', latitude: 40.71427, longitude: -74.00597, timezone: 'America/New_York' },
  { id: 2643743, name: 'London', country: 'United Kingdom', admin1: 'England', latitude: 51.50853, longitude: -0.12574, timezone: 'Europe/London' },
  { id: 1850147, name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', latitude: 35.6895, longitude: 139.69171, timezone: 'Asia/Tokyo' },
  { id: 2988507, name: 'Paris', country: 'France', admin1: 'Île-de-France', latitude: 48.85341, longitude: 2.3488, timezone: 'Europe/Paris' },
  { id: 2147714, name: 'Sydney', country: 'Australia', admin1: 'New South Wales', latitude: -33.86785, longitude: 151.20732, timezone: 'Australia/Sydney' },
  { id: 1275339, name: 'Mumbai', country: 'India', admin1: 'Maharashtra', latitude: 19.07283, longitude: 72.88261, timezone: 'Asia/Kolkata' },
  { id: 5368361, name: 'Los Angeles', country: 'United States', admin1: 'California', latitude: 34.05223, longitude: -118.24368, timezone: 'America/Los_Angeles' },
];
