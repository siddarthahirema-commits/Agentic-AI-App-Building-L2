import { WeatherConditionInfo, TempUnit } from '../types';

export const WMO_CODE_MAP: Record<number, WeatherConditionInfo> = {
  0: {
    code: 0,
    label: 'Clear Sky',
    description: 'Bright sunshine and completely clear skies.',
    iconName: 'Sun',
    category: 'clear',
    bgGradientDay: 'from-amber-400/20 via-sky-400/15 to-blue-600/10',
    bgGradientNight: 'from-slate-900 via-indigo-950 to-slate-900',
    accentColor: 'text-amber-500',
  },
  1: {
    code: 1,
    label: 'Mainly Clear',
    description: 'Mostly clear blue skies with occasional wispy clouds.',
    iconName: 'SunMedium',
    category: 'clear',
    bgGradientDay: 'from-sky-300/20 via-blue-400/10 to-indigo-500/10',
    bgGradientNight: 'from-slate-900 via-slate-950 to-indigo-950',
    accentColor: 'text-sky-500',
  },
  2: {
    code: 2,
    label: 'Partly Cloudy',
    description: 'Scattered clouds passing across the sky.',
    iconName: 'CloudSun',
    category: 'partly_cloudy',
    bgGradientDay: 'from-blue-300/20 via-slate-300/15 to-sky-400/10',
    bgGradientNight: 'from-slate-900 via-slate-900 to-indigo-950',
    accentColor: 'text-sky-400',
  },
  3: {
    code: 3,
    label: 'Overcast',
    description: 'Dense gray cloud cover stretching across the horizon.',
    iconName: 'Cloud',
    category: 'cloudy',
    bgGradientDay: 'from-slate-400/20 via-zinc-400/15 to-blue-500/10',
    bgGradientNight: 'from-slate-950 via-zinc-900 to-slate-900',
    accentColor: 'text-slate-400',
  },
  45: {
    code: 45,
    label: 'Foggy',
    description: 'Thick fog reducing visibility on the ground.',
    iconName: 'CloudFog',
    category: 'fog',
    bgGradientDay: 'from-zinc-400/25 via-slate-400/15 to-stone-400/10',
    bgGradientNight: 'from-zinc-950 via-slate-900 to-zinc-900',
    accentColor: 'text-zinc-400',
  },
  48: {
    code: 48,
    label: 'Depositing Rime Fog',
    description: 'Freezing fog coating icy surfaces in frost.',
    iconName: 'CloudFog',
    category: 'fog',
    bgGradientDay: 'from-teal-300/20 via-slate-400/15 to-cyan-500/10',
    bgGradientNight: 'from-slate-950 via-teal-950 to-slate-900',
    accentColor: 'text-teal-400',
  },
  51: {
    code: 51,
    label: 'Light Drizzle',
    description: 'Gentle mist and fine water drops falling softly.',
    iconName: 'CloudDrizzle',
    category: 'drizzle',
    bgGradientDay: 'from-cyan-400/20 via-sky-400/15 to-blue-500/10',
    bgGradientNight: 'from-slate-900 via-cyan-950 to-slate-950',
    accentColor: 'text-cyan-400',
  },
  53: {
    code: 53,
    label: 'Moderate Drizzle',
    description: 'Continuous fine rain showers.',
    iconName: 'CloudDrizzle',
    category: 'drizzle',
    bgGradientDay: 'from-cyan-500/20 via-blue-400/15 to-sky-600/10',
    bgGradientNight: 'from-slate-950 via-cyan-950 to-blue-950',
    accentColor: 'text-cyan-400',
  },
  55: {
    code: 55,
    label: 'Dense Drizzle',
    description: 'Heavy micro-rain causing damp ground and puddle accumulation.',
    iconName: 'CloudDrizzle',
    category: 'drizzle',
    bgGradientDay: 'from-cyan-600/20 via-blue-500/15 to-slate-600/10',
    bgGradientNight: 'from-slate-950 via-blue-950 to-cyan-950',
    accentColor: 'text-cyan-300',
  },
  56: {
    code: 56,
    label: 'Light Freezing Drizzle',
    description: 'Cold drizzle freezing upon contact with outdoor surfaces.',
    iconName: 'CloudHail',
    category: 'drizzle',
    bgGradientDay: 'from-sky-300/20 via-cyan-300/15 to-slate-400/10',
    bgGradientNight: 'from-slate-950 via-sky-950 to-slate-900',
    accentColor: 'text-sky-300',
  },
  57: {
    code: 57,
    label: 'Dense Freezing Drizzle',
    description: 'Sub-zero freezing mist creating icy road conditions.',
    iconName: 'CloudHail',
    category: 'drizzle',
    bgGradientDay: 'from-sky-400/20 via-cyan-400/15 to-blue-600/10',
    bgGradientNight: 'from-slate-950 via-slate-900 to-indigo-950',
    accentColor: 'text-cyan-300',
  },
  61: {
    code: 61,
    label: 'Slight Rain',
    description: 'Light rain droplets falling steadily.',
    iconName: 'CloudRain',
    category: 'rain',
    bgGradientDay: 'from-blue-400/20 via-sky-500/15 to-indigo-500/10',
    bgGradientNight: 'from-slate-950 via-blue-950 to-slate-900',
    accentColor: 'text-blue-400',
  },
  63: {
    code: 63,
    label: 'Moderate Rain',
    description: 'Steady rainfall across the area.',
    iconName: 'CloudRain',
    category: 'rain',
    bgGradientDay: 'from-blue-500/25 via-indigo-500/15 to-slate-600/10',
    bgGradientNight: 'from-slate-950 via-indigo-950 to-slate-900',
    accentColor: 'text-blue-400',
  },
  65: {
    code: 65,
    label: 'Heavy Rain',
    description: 'Downpours with heavy precipitation and splashing runoff.',
    iconName: 'CloudRainWind',
    category: 'rain',
    bgGradientDay: 'from-indigo-600/25 via-blue-600/20 to-slate-700/10',
    bgGradientNight: 'from-slate-950 via-blue-950 to-zinc-950',
    accentColor: 'text-blue-300',
  },
  66: {
    code: 66,
    label: 'Light Freezing Rain',
    description: 'Cold liquid rain freezing on impact with trees and roads.',
    iconName: 'CloudHail',
    category: 'rain',
    bgGradientDay: 'from-sky-400/20 via-teal-400/15 to-slate-500/10',
    bgGradientNight: 'from-slate-950 via-cyan-950 to-slate-900',
    accentColor: 'text-sky-300',
  },
  67: {
    code: 67,
    label: 'Heavy Freezing Rain',
    description: 'Severe freezing rain leading to glaze ice formation.',
    iconName: 'CloudHail',
    category: 'rain',
    bgGradientDay: 'from-sky-500/25 via-indigo-500/15 to-slate-600/10',
    bgGradientNight: 'from-slate-950 via-blue-950 to-slate-900',
    accentColor: 'text-sky-300',
  },
  71: {
    code: 71,
    label: 'Slight Snow Fall',
    description: 'Gentle snowflakes floating down.',
    iconName: 'Snowflake',
    category: 'snow',
    bgGradientDay: 'from-sky-200/30 via-slate-200/20 to-blue-300/10',
    bgGradientNight: 'from-slate-900 via-sky-950 to-slate-950',
    accentColor: 'text-sky-300',
  },
  73: {
    code: 73,
    label: 'Moderate Snow Fall',
    description: 'Continuous snowfall dusting roads and landscape.',
    iconName: 'Snowflake',
    category: 'snow',
    bgGradientDay: 'from-blue-200/30 via-sky-300/20 to-indigo-300/10',
    bgGradientNight: 'from-slate-900 via-indigo-950 to-slate-950',
    accentColor: 'text-sky-200',
  },
  75: {
    code: 75,
    label: 'Heavy Snow Fall',
    description: 'Intense snow accummulating quickly with low visibility.',
    iconName: 'Snowflake',
    category: 'snow',
    bgGradientDay: 'from-slate-300/30 via-sky-200/20 to-blue-400/10',
    bgGradientNight: 'from-slate-950 via-slate-900 to-indigo-950',
    accentColor: 'text-sky-100',
  },
  77: {
    code: 77,
    label: 'Snow Grains',
    description: 'Small frozen ice grains bouncing gently on surfaces.',
    iconName: 'Snowflake',
    category: 'snow',
    bgGradientDay: 'from-cyan-200/30 via-sky-300/20 to-slate-300/10',
    bgGradientNight: 'from-slate-950 via-cyan-950 to-slate-900',
    accentColor: 'text-sky-200',
  },
  80: {
    code: 80,
    label: 'Slight Rain Showers',
    description: 'Brief localized rain showers with breaks in clouds.',
    iconName: 'CloudRain',
    category: 'rain',
    bgGradientDay: 'from-sky-400/20 via-blue-400/15 to-indigo-400/10',
    bgGradientNight: 'from-slate-900 via-blue-950 to-slate-950',
    accentColor: 'text-sky-400',
  },
  81: {
    code: 81,
    label: 'Moderate Rain Showers',
    description: 'Passing rain squalls with brisk wind bursts.',
    iconName: 'CloudRain',
    category: 'rain',
    bgGradientDay: 'from-blue-500/20 via-sky-500/15 to-slate-500/10',
    bgGradientNight: 'from-slate-950 via-indigo-950 to-slate-900',
    accentColor: 'text-blue-400',
  },
  82: {
    code: 82,
    label: 'Violent Rain Showers',
    description: 'Sudden downpours with intense localized rainfall.',
    iconName: 'CloudRainWind',
    category: 'rain',
    bgGradientDay: 'from-indigo-600/30 via-blue-600/20 to-slate-700/10',
    bgGradientNight: 'from-slate-950 via-blue-950 to-slate-950',
    accentColor: 'text-indigo-400',
  },
  85: {
    code: 85,
    label: 'Slight Snow Showers',
    description: 'Short bursts of falling snowflakes.',
    iconName: 'Snowflake',
    category: 'snow',
    bgGradientDay: 'from-sky-200/30 via-blue-200/20 to-indigo-200/10',
    bgGradientNight: 'from-slate-900 via-sky-950 to-slate-950',
    accentColor: 'text-sky-300',
  },
  86: {
    code: 86,
    label: 'Heavy Snow Showers',
    description: 'Heavy snow flurries with gusty winds.',
    iconName: 'Snowflake',
    category: 'snow',
    bgGradientDay: 'from-slate-300/30 via-blue-300/20 to-sky-300/10',
    bgGradientNight: 'from-slate-950 via-indigo-950 to-slate-900',
    accentColor: 'text-sky-200',
  },
  95: {
    code: 95,
    label: 'Thunderstorm',
    description: 'Thunder and lightning with rain showers.',
    iconName: 'CloudLightning',
    category: 'thunderstorm',
    bgGradientDay: 'from-purple-500/25 via-amber-500/15 to-slate-700/10',
    bgGradientNight: 'from-slate-950 via-purple-950 to-slate-900',
    accentColor: 'text-amber-400',
  },
  96: {
    code: 96,
    label: 'Thunderstorm with Light Hail',
    description: 'Thunderstorms accompanied by small hail pellets.',
    iconName: 'CloudLightning',
    category: 'thunderstorm',
    bgGradientDay: 'from-purple-600/30 via-blue-600/20 to-slate-800/10',
    bgGradientNight: 'from-slate-950 via-purple-950 to-indigo-950',
    accentColor: 'text-amber-400',
  },
  99: {
    code: 99,
    label: 'Thunderstorm with Heavy Hail',
    description: 'Severe thunderstorm producing heavy hail and gusty winds.',
    iconName: 'CloudLightning',
    category: 'thunderstorm',
    bgGradientDay: 'from-purple-700/30 via-indigo-700/20 to-slate-900/10',
    bgGradientNight: 'from-slate-950 via-zinc-950 to-purple-950',
    accentColor: 'text-amber-400',
  },
};

export function getWMOInfo(code: number): WeatherConditionInfo {
  return (
    WMO_CODE_MAP[code] || {
      code,
      label: 'Variable Weather',
      description: 'Mixed atmospheric conditions in your region.',
      iconName: 'Cloud',
      category: 'cloudy',
      bgGradientDay: 'from-sky-400/20 via-slate-300/15 to-blue-500/10',
      bgGradientNight: 'from-slate-900 via-slate-950 to-indigo-950',
      accentColor: 'text-sky-400',
    }
  );
}

export function cToF(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function formatTemp(celsius: number, unit: TempUnit): string {
  const val = unit === 'F' ? cToF(celsius) : celsius;
  return `${Math.round(val)}°${unit}`;
}

export function formatWindSpeed(kmh: number, unit: TempUnit): string {
  if (unit === 'F') {
    const mph = kmh * 0.621371;
    return `${Math.round(mph)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function formatDayName(dateString: string, isTodayFallback: boolean = false): string {
  const date = new Date(dateString);
  const today = new Date();
  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    return 'Today';
  }
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatShortDay(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    return 'Today';
  }
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function formatTimeOnly(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function formatHourOnly(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
}

export function getWindCompassDirection(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index] || 'N';
}

export function getUVDescription(uvIndex: number): { label: string; color: string; advice: string } {
  if (uvIndex < 3) {
    return { label: 'Low', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', advice: 'Minimal risk of sun damage for average person.' };
  } else if (uvIndex < 6) {
    return { label: 'Moderate', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', advice: 'Wear sunglasses, apply SPF 30+ sunscreen around midday.' };
  } else if (uvIndex < 8) {
    return { label: 'High', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20', advice: 'Protection required! Seek shade during midday hours.' };
  } else if (uvIndex < 11) {
    return { label: 'Very High', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', advice: 'Extra protection needed! Avoid sun 10 AM to 4 PM.' };
  } else {
    return { label: 'Extreme', color: 'text-purple-500 bg-purple-500/10 border-purple-500/20', advice: 'Take full precautions! Unprotected skin can burn quickly.' };
  }
}
