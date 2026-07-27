import React, { useRef } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplets,
} from 'lucide-react';
import { HourlyForecastData, TempUnit } from '../types';
import { getWMOInfo, formatTemp, formatHourOnly } from '../utils/wmoCodes';

interface HourlyForecastSliderProps {
  hourly: HourlyForecastData;
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

export const HourlyForecastSlider: React.FC<HourlyForecastSliderProps> = ({ hourly, tempUnit }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Take next 24 hours starting from current hour
  const nowIndex = 0; // We can show first 24 hours from API dataset
  const next24 = hourly.time.slice(nowIndex, nowIndex + 24).map((timeStr, idx) => ({
    time: timeStr,
    temp: hourly.temperature_2m[idx] ?? 0,
    code: hourly.weather_code[idx] ?? 0,
    pop: hourly.precipitation_probability[idx] ?? 0,
    isCurrent: idx === 0,
  }));

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 space-y-4 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-sky-500/20 text-sky-300 rounded-xl border border-sky-400/30 backdrop-blur-sm">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Hourly Forecast</h3>
            <p className="text-xs text-slate-300">Next 24-hour temperature & rain trajectory</p>
          </div>
        </div>

        {/* Scroll Buttons */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 backdrop-blur-md transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 backdrop-blur-md transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent snap-x"
      >
        {next24.map((item, index) => {
          const wmo = getWMOInfo(item.code);
          const IconComp = ICON_MAP[wmo.iconName] || Cloud;
          const labelTime = item.isCurrent ? 'Now' : formatHourOnly(item.time);

          return (
            <div
              key={item.time}
              className={`snap-start shrink-0 w-24 p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-3 backdrop-blur-md ${
                item.isCurrent
                  ? 'bg-gradient-to-b from-sky-500/30 to-blue-600/30 border-sky-400/60 shadow-lg shadow-sky-500/20 scale-105'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="text-xs font-semibold text-slate-200">
                {labelTime}
              </div>

              <div className={`p-2 rounded-xl bg-slate-950/40 backdrop-blur-sm ${wmo.accentColor}`}>
                <IconComp className="w-6 h-6" />
              </div>

              <div className="text-base font-bold text-white">
                {formatTemp(item.temp, tempUnit)}
              </div>

              {/* Rain Chance Pill */}
              {item.pop > 5 ? (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-[10px] font-semibold text-blue-300">
                  <Droplets className="w-2.5 h-2.5" />
                  <span>{item.pop}%</span>
                </div>
              ) : (
                <div className="text-[10px] text-slate-400 italic">0% rain</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
