import React from 'react';
import {
  Sun,
  SunMedium,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudHail,
  Snowflake,
  CloudLightning,
  Droplets,
  Wind,
  Thermometer,
  Sunrise,
  Sunset,
  Eye,
  Gauge,
  Compass,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { WeatherData, TempUnit } from '../types';
import {
  getWMOInfo,
  formatTemp,
  formatWindSpeed,
  getWindCompassDirection,
  getUVDescription,
  formatTimeOnly,
} from '../utils/wmoCodes';

interface CurrentWeatherHeroProps {
  weather: WeatherData;
  tempUnit: TempUnit;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Sun,
  SunMedium,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudHail,
  Snowflake,
  CloudLightning,
};

export const CurrentWeatherHero: React.FC<CurrentWeatherHeroProps> = ({ weather, tempUnit }) => {
  const { current, location, daily } = weather;
  const wmo = getWMOInfo(current.weather_code);
  const IconComponent = ICON_MAP[wmo.iconName] || Cloud;
  const isDay = current.is_day === 1;

  const bgGradient = isDay ? wmo.bgGradientDay : wmo.bgGradientNight;
  const todayHigh = daily.temperature_2m_max?.[0] ?? current.temperature;
  const todayLow = daily.temperature_2m_min?.[0] ?? current.temperature;
  const uvInfo = getUVDescription(current.uv_index);

  const sunrise = daily.sunrise?.[0] ? formatTimeOnly(daily.sunrise[0]) : '---';
  const sunset = daily.sunset?.[0] ? formatTimeOnly(daily.sunset[0]) : '---';

  const updatedTime = new Date(weather.fetchedAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/15 shadow-2xl bg-slate-900/40 backdrop-blur-2xl text-slate-100 transition-all">
      {/* Background Weather Ambient Backdrop */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-60 pointer-events-none transition-all duration-700`}
      />

      {/* Decorative Weather Particle Accents */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 p-6 sm:p-8 lg:p-10 space-y-8">
        {/* Top Location & Condition Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-sm font-semibold tracking-wide uppercase">
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>
                {[location.admin1, location.country].filter(Boolean).join(', ')}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mt-1">
              {location.name}
            </h2>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              Updated at {updatedTime} • Timezone: {location.timezone || 'Auto'}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-2xl w-fit shadow-lg">
            <div className={`p-2 rounded-xl bg-slate-950/40 backdrop-blur-sm ${wmo.accentColor}`}>
              <IconComponent className="w-8 h-8 animate-bounce-slow" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-100">{wmo.label}</div>
              <div className="text-xs text-slate-300 max-w-[200px] truncate">{wmo.description}</div>
            </div>
          </div>
        </div>

        {/* Temperature & Hero Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Temperature Left Banner */}
          <div className="md:col-span-6 flex flex-col justify-center space-y-3">
            <div className="flex items-baseline gap-4">
              <span className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white drop-shadow-md">
                {formatTemp(current.temperature, tempUnit)}
              </span>
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Feels like
                </div>
                <div className="text-lg sm:text-xl font-bold text-sky-300">
                  {formatTemp(current.apparent_temperature, tempUnit)}
                </div>
              </div>
            </div>

            {/* High/Low Temperature Pill */}
            <div className="flex items-center gap-4 text-sm font-medium text-slate-200 bg-white/5 backdrop-blur-md w-fit px-4 py-2 rounded-xl border border-white/10">
              <span className="flex items-center gap-1 text-rose-300">
                <span className="text-xs">▲</span> High: {formatTemp(todayHigh, tempUnit)}
              </span>
              <span className="text-slate-500">|</span>
              <span className="flex items-center gap-1 text-sky-300">
                <span className="text-xs">▼</span> Low: {formatTemp(todayLow, tempUnit)}
              </span>
            </div>
          </div>

          {/* Quick Metrics Cards Right Grid */}
          <div className="md:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
            {/* Humidity */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all rounded-2xl p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-300 font-medium">Humidity</div>
                <div className="text-lg font-bold text-white">{current.relative_humidity}%</div>
              </div>
            </div>

            {/* Wind */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all rounded-2xl p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/30">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-300 font-medium">Wind Speed</div>
                <div className="text-lg font-bold text-white">
                  {formatWindSpeed(current.wind_speed, tempUnit)}{' '}
                  <span className="text-xs font-normal text-slate-300">
                    ({getWindCompassDirection(current.wind_direction)})
                  </span>
                </div>
              </div>
            </div>

            {/* UV Index */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all rounded-2xl p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-300 font-medium">UV Index</div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">{current.uv_index.toFixed(1)}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${uvInfo.color}`}>
                    {uvInfo.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Surface Pressure */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all rounded-2xl p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-400/30">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-300 font-medium">Pressure</div>
                <div className="text-lg font-bold text-white">
                  {Math.round(current.surface_pressure)}{' '}
                  <span className="text-xs font-normal text-slate-300">hPa</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Solar Times Banner */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-200">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Sunrise className="w-4 h-4 text-amber-400" />
              <span>Sunrise: <strong className="text-white">{sunrise}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Sunset className="w-4 h-4 text-orange-400" />
              <span>Sunset: <strong className="text-white">{sunset}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-300 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Open-Meteo Precision Telemetry</span>
          </div>
        </div>
      </div>
    </div>
  );
};
