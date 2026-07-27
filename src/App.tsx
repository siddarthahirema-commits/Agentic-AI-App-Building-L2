/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CurrentWeatherHero } from './components/CurrentWeatherHero';
import { HourlyForecastSlider } from './components/HourlyForecastSlider';
import { ForecastSection } from './components/ForecastSection';
import { PlanningInsights } from './components/PlanningInsights';
import { WeatherMetricsGrid } from './components/WeatherMetricsGrid';
import { FavoritesBar } from './components/FavoritesBar';
import { ErrorMessage } from './components/ErrorMessage';
import { LoadingSkeleton } from './components/LoadingSkeleton';

import { LocationData, WeatherData, TempUnit } from './types';
import { fetchWeatherData, reverseGeocode, POPULAR_CITIES } from './services/weatherApi';
import { Sparkles, Calendar, Compass, Gauge, Github, Heart } from 'lucide-react';

const LOCAL_FAVORITES_KEY = 'atmosphere_weather_favorites_v1';
const LOCAL_UNIT_KEY = 'atmosphere_weather_unit_v1';

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'planning' | 'telemetry'>('overview');

  // Temperature unit state
  const [tempUnit, setTempUnit] = useState<TempUnit>(() => {
    const saved = localStorage.getItem(LOCAL_UNIT_KEY);
    return saved === 'F' ? 'F' : 'C';
  });

  // Favorites state
  const [favorites, setFavorites] = useState<LocationData[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_FAVORITES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse favorites:', e);
    }
    return [POPULAR_CITIES[1], POPULAR_CITIES[0], POPULAR_CITIES[2]]; // London, NYC, Tokyo default
  });

  // Save favorites to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Save temp unit to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_UNIT_KEY, tempUnit);
  }, [tempUnit]);

  // Main weather loader
  const loadWeatherForLocation = useCallback(async (location: LocationData) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(location);
      setSelectedLocation(location);
      setWeatherData(data);
    } catch (err: any) {
      console.error('Failed to fetch weather:', err);
      setError(
        err.message || 'Unable to retrieve weather data from Open-Meteo services. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Geolocation trigger
  const handleUseLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your current browser environment.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const loc = await reverseGeocode(latitude, longitude);
          loadWeatherForLocation(loc);
        } catch (err) {
          console.error('Reverse geocode failed:', err);
          loadWeatherForLocation({
            id: Math.round(latitude * 1000 + longitude),
            name: 'Current GPS Location',
            latitude,
            longitude,
          });
        }
      },
      (err) => {
        console.warn('Geolocation permission denied or timed out:', err);
        setError(
          'Location access was declined or unavailable. Showing weather for default city.'
        );
        // Fallback to London if initial load
        if (!selectedLocation) {
          loadWeatherForLocation(POPULAR_CITIES[1]);
        } else {
          setIsLoading(false);
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [loadWeatherForLocation, selectedLocation]);

  // Initial load
  useEffect(() => {
    // Try browser location on first load, or default to London
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          loadWeatherForLocation(loc);
        },
        () => {
          // Geolocation rejected or blocked -> load London
          loadWeatherForLocation(POPULAR_CITIES[1]);
        }
      );
    } else {
      loadWeatherForLocation(POPULAR_CITIES[1]);
    }
  }, [loadWeatherForLocation]);

  // Favorites handlers
  const isCurrentFavorite =
    selectedLocation !== null &&
    favorites.some((fav) => fav.id === selectedLocation.id || fav.name.toLowerCase() === selectedLocation.name.toLowerCase());

  const handleToggleFavorite = () => {
    if (!selectedLocation) return;
    if (isCurrentFavorite) {
      setFavorites((prev) =>
        prev.filter(
          (fav) =>
            fav.id !== selectedLocation.id &&
            fav.name.toLowerCase() !== selectedLocation.name.toLowerCase()
        )
      );
    } else {
      setFavorites((prev) => [selectedLocation, ...prev]);
    }
  };

  const handleRemoveFavorite = (cityId: number) => {
    setFavorites((prev) => prev.filter((f) => f.id !== cityId));
  };

  const handleRefresh = () => {
    if (selectedLocation) {
      loadWeatherForLocation(selectedLocation);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white relative overflow-x-hidden">
      {/* Frosted Glass Ambient Mesh Background Blobs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-sky-600/15 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="fixed bottom-1/3 right-1/4 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-2/3 left-1/3 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Navigation Header */}
      <Header
        currentLocation={selectedLocation}
        onSelectCity={loadWeatherForLocation}
        onUseLocation={handleUseLocation}
        tempUnit={tempUnit}
        onToggleTempUnit={() => setTempUnit((u) => (u === 'C' ? 'F' : 'C'))}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        isFavorite={isCurrentFavorite}
        onToggleFavorite={handleToggleFavorite}
        favorites={favorites}
      />

      {/* Primary Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 relative z-10">
        {/* Saved Cities Quick Strip */}
        <FavoritesBar
          favorites={favorites}
          currentLocation={selectedLocation}
          onSelectCity={loadWeatherForLocation}
          onRemoveFavorite={handleRemoveFavorite}
        />

        {/* Global Error Banner */}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={handleRefresh}
            onResetSearch={() => loadWeatherForLocation(POPULAR_CITIES[1])}
          />
        )}

        {/* Loading State Skeleton */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : weatherData ? (
          <div className="space-y-8">
            {/* Main Weather Hero Tile */}
            <CurrentWeatherHero weather={weatherData} tempUnit={tempUnit} />

            {/* Hourly Forecast Slider */}
            <HourlyForecastSlider hourly={weatherData.hourly} tempUnit={tempUnit} />

            {/* Category Navigation Tabs */}
            <div className="flex items-center justify-center sm:justify-start gap-2 border-b border-white/10 pb-3">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold backdrop-blur-md transition-all ${
                  activeTab === 'overview'
                    ? 'bg-sky-500/90 text-white shadow-lg shadow-sky-500/30 border border-sky-400/50'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>7-Day Forecast</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('planning')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold backdrop-blur-md transition-all ${
                  activeTab === 'planning'
                    ? 'bg-sky-500/90 text-white shadow-lg shadow-sky-500/30 border border-sky-400/50'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Travel & Activity Insights</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('telemetry')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold backdrop-blur-md transition-all ${
                  activeTab === 'telemetry'
                    ? 'bg-sky-500/90 text-white shadow-lg shadow-sky-500/30 border border-sky-400/50'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <Gauge className="w-4 h-4" />
                <span>Atmospheric Gauges</span>
              </button>
            </div>

            {/* Tab Views */}
            {activeTab === 'overview' && (
              <ForecastSection daily={weatherData.daily} tempUnit={tempUnit} />
            )}

            {activeTab === 'planning' && (
              <PlanningInsights weather={weatherData} />
            )}

            {activeTab === 'telemetry' && (
              <WeatherMetricsGrid weather={weatherData} tempUnit={tempUnit} />
            )}
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-white/10 bg-slate-950/40 backdrop-blur-lg py-6 text-center text-xs text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">Atmosphere Weather Intelligence</span>
            <span>•</span>
            <span>Powered by Open-Meteo Public Weather APIs</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for global forecasts</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
