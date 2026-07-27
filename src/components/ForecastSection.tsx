import React, { useState } from 'react';
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
  Calendar,
  BarChart3,
  Droplets,
  Wind,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { DailyForecastData, TempUnit } from '../types';
import { getWMOInfo, formatTemp, formatDayName, cToF, formatShortDay } from '../utils/wmoCodes';

interface ForecastSectionProps {
  daily: DailyForecastData;
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

export const ForecastSection: React.FC<ForecastSectionProps> = ({ daily, tempUnit }) => {
  const [activeView, setActiveView] = useState<'cards' | 'chart'>('cards');

  // Compute week's absolute min and max for relative temperature bar rendering
  const allMaxs = daily.temperature_2m_max || [];
  const allMins = daily.temperature_2m_min || [];

  const weekMaxC = Math.max(...(allMaxs.length > 0 ? allMaxs : [25]));
  const weekMinC = Math.min(...(allMins.length > 0 ? allMins : [10]));
  const rangeSpanC = Math.max(1, weekMaxC - weekMinC);

  // Prepare chart dataset
  const chartData = (daily.time || []).map((dateStr, idx) => {
    const rawMax = daily.temperature_2m_max[idx] ?? 0;
    const rawMin = daily.temperature_2m_min[idx] ?? 0;
    const precip = daily.precipitation_sum[idx] ?? 0;

    return {
      day: formatShortDay(dateStr),
      dateFull: formatDayName(dateStr),
      MaxTemp: Math.round(tempUnit === 'F' ? cToF(rawMax) : rawMax),
      MinTemp: Math.round(tempUnit === 'F' ? cToF(rawMin) : rawMin),
      Precipitation: parseFloat(precip.toFixed(1)),
      condition: getWMOInfo(daily.weather_code[idx] ?? 0).label,
    };
  });

  return (
    <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/20 text-sky-300 rounded-2xl border border-sky-400/30 backdrop-blur-sm">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">7-Day Forecast</h3>
            <p className="text-xs text-slate-300">Weekly temperature trends and weather patterns</p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-white/5 backdrop-blur-md p-1 rounded-2xl border border-white/10 w-fit">
          <button
            type="button"
            onClick={() => setActiveView('cards')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeView === 'cards'
                ? 'bg-sky-500/90 text-white shadow-md border border-sky-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('chart')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeView === 'chart'
                ? 'bg-sky-500/90 text-white shadow-md border border-sky-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Chart</span>
          </button>
        </div>
      </div>

      {/* Cards View */}
      {activeView === 'cards' && (
        <div className="space-y-3">
          {daily.time.slice(0, 7).map((timeStr, idx) => {
            const wmo = getWMOInfo(daily.weather_code[idx] ?? 0);
            const IconComp = ICON_MAP[wmo.iconName] || Cloud;
            const maxC = daily.temperature_2m_max[idx] ?? 0;
            const minC = daily.temperature_2m_min[idx] ?? 0;
            const precip = daily.precipitation_sum[idx] ?? 0;
            const wind = daily.wind_speed_10m_max[idx] ?? 0;

            // Bar math percentages relative to week boundaries
            const leftPercent = Math.max(0, Math.min(100, ((minC - weekMinC) / rangeSpanC) * 100));
            const widthPercent = Math.max(8, Math.min(100 - leftPercent, ((maxC - minC) / rangeSpanC) * 100));

            return (
              <div
                key={timeStr}
                className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
              >
                {/* Day & Condition Name */}
                <div className="md:col-span-4 flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-slate-950/40 backdrop-blur-sm ${wmo.accentColor} shrink-0`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {formatDayName(timeStr)}
                    </div>
                    <div className="text-xs text-slate-300 font-medium">
                      {wmo.label}
                    </div>
                  </div>
                </div>

                {/* Rain & Wind Badges */}
                <div className="md:col-span-3 flex items-center gap-4 text-xs text-slate-300">
                  <div className="flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-sky-400" />
                    <span>{precip > 0 ? `${precip.toFixed(1)} mm` : '0 mm'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-slate-300" />
                    <span>{Math.round(wind)} km/h</span>
                  </div>
                </div>

                {/* Min/Max Temperature Visual Scale Bar */}
                <div className="md:col-span-5 flex items-center gap-3">
                  <span className="text-xs font-bold text-sky-300 w-12 text-right">
                    {formatTemp(minC, tempUnit)}
                  </span>

                  <div className="flex-1 h-2.5 bg-slate-950/60 rounded-full overflow-hidden relative border border-white/10">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500 shadow-sm"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-bold text-rose-300 w-12 text-left">
                    {formatTemp(maxC, tempUnit)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recharts Chart View */}
      {activeView === 'chart' && (
        <div className="space-y-4">
          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="maxTempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="minTempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis yAxisId="temp" stroke="#94a3b8" fontSize={12} tickLine={false} unit={`°${tempUnit}`} />
                <YAxis yAxisId="precip" orientation="right" stroke="#38bdf8" fontSize={12} tickLine={false} unit="mm" />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1 text-slate-200">
                          <p className="font-bold text-white">{data.dateFull}</p>
                          <p className="text-sky-300">{data.condition}</p>
                          <div className="border-t border-slate-700 pt-1 space-y-0.5">
                            <p className="text-rose-400">
                              High Temp: <strong>{data.MaxTemp}°{tempUnit}</strong>
                            </p>
                            <p className="text-sky-400">
                              Low Temp: <strong>{data.MinTemp}°{tempUnit}</strong>
                            </p>
                            <p className="text-blue-400">
                              Precipitation: <strong>{data.Precipitation} mm</strong>
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
                <Bar yAxisId="precip" dataKey="Precipitation" fill="#0284c7" opacity={0.6} radius={[4, 4, 0, 0]} name="Precipitation (mm)" />
                <Area yAxisId="temp" type="monotone" dataKey="MaxTemp" stroke="#f43f5e" strokeWidth={2.5} fill="url(#maxTempGrad)" name={`High Temp (°${tempUnit})`} />
                <Line yAxisId="temp" type="monotone" dataKey="MinTemp" stroke="#38bdf8" strokeWidth={2.5} dot={{ fill: '#38bdf8', r: 4 }} name={`Low Temp (°${tempUnit})`} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 text-center italic">
            Dual-axis temperature curve (°{tempUnit}) and rainfall totals (mm) across 7 days.
          </p>
        </div>
      )}
    </div>
  );
};
