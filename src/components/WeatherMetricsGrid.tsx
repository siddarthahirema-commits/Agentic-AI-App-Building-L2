import React from 'react';
import {
  Droplets,
  Wind,
  Sun,
  Gauge,
  Thermometer,
  Sunrise,
  Sunset,
  Compass,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { WeatherData, TempUnit } from '../types';
import {
  formatTemp,
  formatWindSpeed,
  getWindCompassDirection,
  getUVDescription,
  formatTimeOnly,
} from '../utils/wmoCodes';

interface WeatherMetricsGridProps {
  weather: WeatherData;
  tempUnit: TempUnit;
}

export const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({ weather, tempUnit }) => {
  const { current, daily } = weather;

  const uvInfo = getUVDescription(current.uv_index);

  // Solar progress percentage
  const sunriseStr = daily.sunrise?.[0];
  const sunsetStr = daily.sunset?.[0];

  let dayProgressPercent = 50;
  if (sunriseStr && sunsetStr) {
    const sunriseTime = new Date(sunriseStr).getTime();
    const sunsetTime = new Date(sunsetStr).getTime();
    const nowTime = new Date().getTime();

    if (nowTime <= sunriseTime) {
      dayProgressPercent = 0;
    } else if (nowTime >= sunsetTime) {
      dayProgressPercent = 100;
    } else {
      dayProgressPercent = Math.round(
        ((nowTime - sunriseTime) / (sunsetTime - sunriseTime)) * 100
      );
    }
  }

  // Dew point approximation formula: Td = T - ((100 - RH)/5)
  const dewPointC = current.temperature - (100 - current.relative_humidity) / 5;

  return (
    <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="p-2.5 bg-blue-500/20 text-blue-300 rounded-2xl border border-blue-400/30 backdrop-blur-sm">
          <Gauge className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Atmospheric Telemetry</h3>
          <p className="text-xs text-slate-300">Detailed environmental readings and indices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Humidity & Dew Point */}
        <div className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between text-slate-300 text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-blue-300">
              <Droplets className="w-4 h-4" /> Humidity
            </span>
            <span>{current.relative_humidity}%</span>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-black text-white">{current.relative_humidity}%</div>
            <div className="text-xs text-slate-300">
              Dew Point: <span className="text-slate-100 font-semibold">{formatTemp(dewPointC, tempUnit)}</span>
            </div>
          </div>

          <div className="h-2 bg-slate-950/60 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-blue-400 rounded-full"
              style={{ width: `${current.relative_humidity}%` }}
            />
          </div>
        </div>

        {/* 2. Wind Speed & Direction */}
        <div className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between text-slate-300 text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-sky-300">
              <Wind className="w-4 h-4" /> Wind Vector
            </span>
            <span>{getWindCompassDirection(current.wind_direction)}</span>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-black text-white">
              {formatWindSpeed(current.wind_speed, tempUnit)}
            </div>
            <div className="text-xs text-slate-300">
              Bearing: <span className="text-slate-100 font-semibold">{current.wind_direction}°</span>
            </div>
          </div>

          {/* Compass Pointer Indicator */}
          <div className="flex items-center gap-2 text-xs text-slate-200">
            <div
              className="w-5 h-5 rounded-full bg-slate-950/60 border border-white/15 flex items-center justify-center text-sky-300 transform transition-transform"
              style={{ transform: `rotate(${current.wind_direction}deg)` }}
            >
              ↑
            </div>
            <span>Heading {getWindCompassDirection(current.wind_direction)}</span>
          </div>
        </div>

        {/* 3. UV Index Gauge */}
        <div className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between text-slate-300 text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Sun className="w-4 h-4" /> UV Index
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border backdrop-blur-sm ${uvInfo.color}`}>
              {uvInfo.label}
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-black text-white">{current.uv_index.toFixed(1)} / 12</div>
            <div className="text-xs text-slate-300 truncate">{uvInfo.advice}</div>
          </div>

          <div className="h-2 bg-slate-950/60 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full"
              style={{ width: `${Math.min(100, (current.uv_index / 12) * 100)}%` }}
            />
          </div>
        </div>

        {/* 4. Barometric Pressure */}
        <div className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between text-slate-300 text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-teal-300">
              <Gauge className="w-4 h-4" /> Pressure
            </span>
            <span>hPa</span>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-black text-white">
              {Math.round(current.surface_pressure)}{' '}
              <span className="text-xs font-normal text-slate-300">hPa</span>
            </div>
            <div className="text-xs text-slate-300">
              {current.surface_pressure >= 1013 ? 'High pressure system (Stable)' : 'Low pressure system (Unstable)'}
            </div>
          </div>

          <div className="h-2 bg-slate-950/60 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-teal-400 rounded-full"
              style={{ width: `${Math.min(100, ((current.surface_pressure - 950) / 100) * 100)}%` }}
            />
          </div>
        </div>

        {/* 5. Apparent vs Actual Delta */}
        <div className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between text-slate-300 text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-rose-300">
              <Thermometer className="w-4 h-4" /> Thermal Delta
            </span>
            <span>Apparent</span>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-black text-white">
              {formatTemp(current.apparent_temperature, tempUnit)}
            </div>
            <div className="text-xs text-slate-300">
              Actual: <span className="text-slate-100 font-semibold">{formatTemp(current.temperature, tempUnit)}</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 italic">
            Combined temperature effect accounting for wind chill and ambient moisture.
          </p>
        </div>

        {/* 6. Daylight Solar Curve */}
        <div className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between text-slate-300 text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-orange-300">
              <Sunrise className="w-4 h-4" /> Solar Day Progress
            </span>
            <span>{dayProgressPercent}%</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-200 font-semibold">
            <div className="flex items-center gap-1 text-amber-300">
              <Sunrise className="w-3.5 h-3.5" />
              <span>{sunriseStr ? formatTimeOnly(sunriseStr) : '---'}</span>
            </div>
            <div className="flex items-center gap-1 text-orange-300">
              <Sunset className="w-3.5 h-3.5" />
              <span>{sunsetStr ? formatTimeOnly(sunsetStr) : '---'}</span>
            </div>
          </div>

          <div className="h-2 bg-slate-950/60 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-500 rounded-full"
              style={{ width: `${dayProgressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
