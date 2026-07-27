export interface LocationData {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  country_code?: string;
  timezone?: string;
  elevation?: number;
}

export interface CurrentWeatherData {
  time: string;
  temperature: number;
  apparent_temperature: number;
  relative_humidity: number;
  is_day: number;
  precipitation: number;
  weather_code: number;
  surface_pressure: number;
  wind_speed: number;
  wind_direction: number;
  uv_index: number;
}

export interface HourlyForecastData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  weather_code: number[];
  precipitation_probability: number[];
  wind_speed_10m: number[];
  uv_index: number[];
}

export interface DailyForecastData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  wind_speed_10m_max: number[];
}

export interface WeatherData {
  location: LocationData;
  current: CurrentWeatherData;
  hourly: HourlyForecastData;
  daily: DailyForecastData;
  fetchedAt: string;
}

export type TempUnit = 'C' | 'F';

export interface WeatherConditionInfo {
  code: number;
  label: string;
  description: string;
  iconName: string; // Lucide icon name string
  category: 'clear' | 'partly_cloudy' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
  bgGradientDay: string;
  bgGradientNight: string;
  accentColor: string;
}

export interface SmartRecommendation {
  id: string;
  category: 'clothing' | 'activity' | 'travel' | 'health' | 'alert';
  title: string;
  detail: string;
  iconName: string;
  severity: 'info' | 'success' | 'warning' | 'alert';
}

export interface ActivityScore {
  name: string;
  score: number; // 0 - 100
  status: 'Optimal' | 'Favorable' | 'Moderate' | 'Unfavorable' | 'Hazardous';
  iconName: string;
  reason: string;
}
