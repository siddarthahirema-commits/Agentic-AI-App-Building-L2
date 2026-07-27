import { WeatherData, SmartRecommendation, ActivityScore } from '../types';
import { getWMOInfo } from './wmoCodes';

export function generateSmartRecommendations(weather: WeatherData): SmartRecommendation[] {
  const recommendations: SmartRecommendation[] = [];
  const temp = weather.current.temperature;
  const code = weather.current.weather_code;
  const wind = weather.current.wind_speed;
  const uv = weather.current.uv_index;
  const precip = weather.current.precipitation;
  const cond = getWMOInfo(code);

  // 1. Clothing & Layers
  if (temp < 0) {
    recommendations.push({
      id: 'clothing-subzero',
      category: 'clothing',
      title: 'Freezing Gear Required',
      detail: 'Sub-zero temperatures! Wear a heavy insulated coat, thermal base layers, wool socks, gloves, and a beanie.',
      iconName: 'Shirt',
      severity: 'warning',
    });
  } else if (temp < 10) {
    recommendations.push({
      id: 'clothing-cold',
      category: 'clothing',
      title: 'Cold Weather Layers',
      detail: 'Chilly outdoors! A warm winter jacket or heavy coat with layers is strongly recommended.',
      iconName: 'Shirt',
      severity: 'info',
    });
  } else if (temp < 20) {
    recommendations.push({
      id: 'clothing-mild',
      category: 'clothing',
      title: 'Comfortable Light Layering',
      detail: 'Pleasant temperatures! A sweater, light jacket, or hoodie over t-shirts will keep you comfortable.',
      iconName: 'Shirt',
      severity: 'success',
    });
  } else if (temp <= 28) {
    recommendations.push({
      id: 'clothing-warm',
      category: 'clothing',
      title: 'Light & Breathable Apparel',
      detail: 'Warm and comfortable! T-shirts, shorts, or light cotton clothing are ideal today.',
      iconName: 'Shirt',
      severity: 'success',
    });
  } else {
    recommendations.push({
      id: 'clothing-hot',
      category: 'clothing',
      title: 'Hot Weather Advisory',
      detail: 'High temperatures! Wear light-colored, breathable fabrics, sunglasses, and carry water.',
      iconName: 'Shirt',
      severity: 'warning',
    });
  }

  // 2. Umbrella & Rain Gear
  const dailyRainSum = weather.daily.precipitation_sum?.[0] || 0;
  const maxRainProb = Math.max(...(weather.hourly.precipitation_probability?.slice(0, 12) || [0]));

  if (cond.category === 'rain' || cond.category === 'drizzle' || cond.category === 'thunderstorm' || precip > 0.2) {
    recommendations.push({
      id: 'rain-active',
      category: 'travel',
      title: 'Umbrella Essential',
      detail: 'Active precipitation in progress or highly probable. Bring a sturdy umbrella and water-resistant footwear.',
      iconName: 'Umbrella',
      severity: 'alert',
    });
  } else if (maxRainProb > 40 || dailyRainSum > 1) {
    recommendations.push({
      id: 'rain-possible',
      category: 'travel',
      title: 'Rain Expectation Today',
      detail: `Rain chances reach up to ${maxRainProb}% in the coming hours. Pack a compact umbrella just in case.`,
      iconName: 'Umbrella',
      severity: 'info',
    });
  }

  // 3. Sun & UV Protection
  if (uv >= 6) {
    recommendations.push({
      id: 'uv-high',
      category: 'health',
      title: `High UV Index (${uv.toFixed(1)})`,
      detail: 'Sun intensity is strong. Apply broad-spectrum SPF 30+ sunscreen, wear UV-blocking sunglasses, and seek shade during midday.',
      iconName: 'Sun',
      severity: 'warning',
    });
  } else if (weather.current.is_day && temp > 22 && uv >= 3) {
    recommendations.push({
      id: 'uv-moderate',
      category: 'health',
      title: 'Moderate Sun Exposure',
      detail: 'Good day to be outside! Wear sunglasses and sunscreen if spending extended hours in direct sunlight.',
      iconName: 'Sun',
      severity: 'info',
    });
  }

  // 4. Wind Safety
  if (wind >= 35) {
    recommendations.push({
      id: 'wind-strong',
      category: 'alert',
      title: `Gusty Winds (${Math.round(wind)} km/h)`,
      detail: 'High wind speeds observed. Secure outdoor furniture, take extra care while driving high-profile vehicles, and avoid cycling near traffic.',
      iconName: 'Wind',
      severity: 'alert',
    });
  }

  // 5. Hydration / Extreme Heat / Cold Warning
  if (temp >= 32) {
    recommendations.push({
      id: 'heat-hydration',
      category: 'health',
      title: 'Stay Well Hydrated',
      detail: 'Drink plenty of water throughout the day. Avoid prolonged heavy exertion under direct mid-day sun.',
      iconName: 'Droplets',
      severity: 'warning',
    });
  }

  // 6. Fog or Low Visibility
  if (cond.category === 'fog') {
    recommendations.push({
      id: 'fog-commute',
      category: 'travel',
      title: 'Reduced Road Visibility',
      detail: 'Thick fog reducing visibility. Drive with low beams on and maintain safe braking distance.',
      iconName: 'Car',
      severity: 'warning',
    });
  }

  return recommendations;
}

export function calculateActivityScores(weather: WeatherData): ActivityScore[] {
  const temp = weather.current.temperature;
  const wind = weather.current.wind_speed;
  const code = weather.current.weather_code;
  const precip = weather.current.precipitation;
  const uv = weather.current.uv_index;
  const isDay = weather.current.is_day === 1;
  const cond = getWMOInfo(code);

  const activities: ActivityScore[] = [];

  // A. Running & Jogging
  let runScore = 80;
  if (temp < 0 || temp > 33) runScore -= 40;
  else if (temp < 8 || temp > 28) runScore -= 20;
  else if (temp >= 12 && temp <= 20) runScore += 15;

  if (cond.category === 'rain' || precip > 0.5) runScore -= 35;
  if (cond.category === 'thunderstorm') runScore -= 70;
  if (wind > 30) runScore -= 20;

  runScore = Math.max(0, Math.min(100, runScore));
  activities.push({
    name: 'Running & Jogging',
    score: runScore,
    status: getScoreStatus(runScore),
    iconName: 'Footprints',
    reason: getRunReason(temp, precip, wind, cond.category),
  });

  // B. Cycling / Commuting
  let cycleScore = 85;
  if (temp < 2 || temp > 34) cycleScore -= 40;
  if (wind > 35) cycleScore -= 45;
  else if (wind > 20) cycleScore -= 20;

  if (cond.category === 'rain' || cond.category === 'snow') cycleScore -= 40;
  if (cond.category === 'thunderstorm') cycleScore -= 75;

  cycleScore = Math.max(0, Math.min(100, cycleScore));
  activities.push({
    name: 'Cycling & Biking',
    score: cycleScore,
    status: getScoreStatus(cycleScore),
    iconName: 'Bike',
    reason: getCycleReason(temp, wind, cond.category),
  });

  // C. Outdoor Dining & Patio
  let diningScore = 85;
  if (temp < 15 || temp > 31) diningScore -= 35;
  if (wind > 22) diningScore -= 30;
  if (cond.category === 'rain' || cond.category === 'drizzle' || precip > 0) diningScore -= 50;
  if (cond.category === 'thunderstorm') diningScore -= 80;

  diningScore = Math.max(0, Math.min(100, diningScore));
  activities.push({
    name: 'Outdoor Dining & Patio',
    score: diningScore,
    status: getScoreStatus(diningScore),
    iconName: 'Utensils',
    reason: getDiningReason(temp, wind, cond.category),
  });

  // D. Stargazing & Astronomy (night specific)
  let starScore = 75;
  if (isDay) {
    starScore = 20;
  } else {
    if (code === 0) starScore = 95;
    else if (code === 1) starScore = 80;
    else if (code === 2) starScore = 55;
    else starScore = 15;

    if (temp < -5) starScore -= 20;
  }
  starScore = Math.max(0, Math.min(100, starScore));
  activities.push({
    name: 'Stargazing',
    score: starScore,
    status: getScoreStatus(starScore),
    iconName: 'Sparkles',
    reason: isDay ? 'Daytime now. Check again after sunset for clear night observations.' : getStarReason(code),
  });

  // E. Photography & Sightseeing
  let photoScore = 80;
  if (code === 0 || code === 1) photoScore = 90;
  else if (code === 2) photoScore = 85; // great cloud contrast
  else if (cond.category === 'rain') photoScore -= 35;
  else if (cond.category === 'fog') photoScore = 60; // moody

  if (uv > 8) photoScore -= 10; // harsh light
  photoScore = Math.max(0, Math.min(100, photoScore));
  activities.push({
    name: 'Photography & Tours',
    score: photoScore,
    status: getScoreStatus(photoScore),
    iconName: 'Camera',
    reason: getPhotoReason(code, cond.category),
  });

  return activities;
}

function getScoreStatus(score: number): ActivityScore['status'] {
  if (score >= 80) return 'Optimal';
  if (score >= 65) return 'Favorable';
  if (score >= 45) return 'Moderate';
  if (score >= 25) return 'Unfavorable';
  return 'Hazardous';
}

function getRunReason(temp: number, precip: number, wind: number, category: string): string {
  if (category === 'thunderstorm') return 'Severe thunderstorm hazard. Postpone outdoor runs.';
  if (precip > 0.5) return 'Wet ground and rain. Wear waterproof running shoes if heading out.';
  if (temp < 5) return 'Crisp cold air. Wear thermal running tights and gloves.';
  if (temp > 28) return 'Warm conditions. Run early morning or evening to stay cool.';
  if (wind > 25) return 'Brisk headwinds today. Extra effort required on open routes.';
  return 'Ideal temperature and crisp conditions for outdoor running.';
}

function getCycleReason(temp: number, wind: number, category: string): string {
  if (category === 'thunderstorm') return 'Thunderstorm hazard! Stay indoors.';
  if (wind > 30) return 'High wind gusts make cycling challenging and unsafe on highways.';
  if (category === 'rain') return 'Slippery roads. Check brake pads and corner slowly.';
  if (temp < 5) return 'Cold wind chill. Wear windbreaker jackets and warm full-finger gloves.';
  return 'Smooth riding conditions with manageable wind speeds.';
}

function getDiningReason(temp: number, wind: number, category: string): string {
  if (category === 'rain' || category === 'drizzle') return 'Rain expected. Indoor seating advised.';
  if (wind > 20) return 'Breezy outdoors; napkins and light items may fly off tables.';
  if (temp < 15) return 'A bit chilly for outdoor seating without patio heaters.';
  if (temp > 30) return 'Hot outdoors. Shaded areas or indoor air conditioning recommended.';
  return 'Pleasant breeze and comfortable temperatures for patio dining.';
}

function getStarReason(code: number): string {
  if (code === 0) return 'Crystal clear night skies! Excellent atmospheric clarity.';
  if (code === 1 || code === 2) return 'Partial cloud cover, but good gaps for observation.';
  return 'Overcast skies obstruct star visibility tonight.';
}

function getPhotoReason(code: number, category: string): string {
  if (code === 2) return 'Dynamic cloud formations provide beautiful soft lighting and dramatic skies.';
  if (code === 0 || code === 1) return 'Bright natural lighting and clear vistas.';
  if (category === 'fog') return 'Atmospheric moody fog ideal for creative street landscape photography.';
  if (category === 'rain') return 'Protect camera gear from moisture.';
  return 'Decent ambient light conditions for outdoor photography.';
}
