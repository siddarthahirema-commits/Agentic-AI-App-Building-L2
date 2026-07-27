import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Compass, RefreshCw, Star, Thermometer, X, Loader2 } from 'lucide-react';
import { LocationData, TempUnit } from '../types';
import { searchCities } from '../services/weatherApi';

interface HeaderProps {
  currentLocation: LocationData | null;
  onSelectCity: (city: LocationData) => void;
  onUseLocation: () => void;
  tempUnit: TempUnit;
  onToggleTempUnit: () => void;
  isLoading: boolean;
  onRefresh: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  favorites: LocationData[];
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onSelectCity,
  onUseLocation,
  tempUnit,
  onToggleTempUnit,
  isLoading,
  onRefresh,
  isFavorite,
  onToggleFavorite,
  favorites,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      setSearchError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const results = await searchCities(query);
        setSuggestions(results);
        setShowDropdown(true);
        if (results.length === 0) {
          setSearchError('No cities found. Try another search term.');
        }
      } catch (err) {
        setSearchError('Unable to search cities. Check your network.');
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: LocationData) => {
    onSelectCity(city);
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/60 backdrop-blur-xl border-b border-white/10 text-slate-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500/90 to-blue-600/90 backdrop-blur-md border border-sky-300/30 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-bold">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-sky-100 to-sky-300 bg-clip-text text-transparent">
              Atmosphere
            </h1>
            <p className="text-xs text-sky-400 font-medium">Weather Intelligence</p>
          </div>
        </div>

        {/* Search Bar with Autocomplete Dropdown */}
        <div className="relative flex-1 max-w-md" ref={dropdownRef}>
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="absolute left-3 text-slate-400 pointer-events-none">
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
              placeholder="Search city, region, or country..."
              className="w-full bg-white/5 hover:bg-white/10 focus:bg-slate-900/90 text-slate-100 placeholder-slate-400 text-sm rounded-xl pl-9 pr-20 py-2.5 border border-white/10 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 backdrop-blur-md transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-12 text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              disabled={!query.trim()}
              className="absolute right-1.5 px-3 py-1 bg-sky-500/90 hover:bg-sky-400 border border-sky-400/40 backdrop-blur-sm disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Search
            </button>
          </form>

          {/* Search Dropdown */}
          {showDropdown && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-white/10">
              {suggestions.length > 0 ? (
                suggestions.map((city) => (
                  <button
                    key={`${city.id}-${city.latitude}-${city.longitude}`}
                    type="button"
                    onClick={() => handleSelect(city)}
                    className="w-full text-left px-4 py-3 hover:bg-sky-500/15 hover:text-sky-300 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform shrink-0" />
                      <div>
                        <span className="text-sm font-medium text-slate-100 group-hover:text-sky-200">
                          {city.name}
                        </span>
                        <span className="text-xs text-slate-400 ml-2">
                          {[city.admin1, city.country].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                    </span>
                  </button>
                ))
              ) : searchError ? (
                <div className="px-4 py-3 text-xs text-amber-400 bg-amber-500/10 font-medium">
                  {searchError}
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Geolocation Button */}
          <button
            type="button"
            onClick={onUseLocation}
            title="Use current GPS location"
            className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium rounded-xl border border-white/10 backdrop-blur-md transition-all"
          >
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Nearby</span>
          </button>

          {/* Favorite Toggle */}
          {currentLocation && (
            <button
              type="button"
              onClick={onToggleFavorite}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-2 rounded-xl border backdrop-blur-md transition-all ${
                isFavorite
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 hover:bg-amber-500/30'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
              }`}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          )}

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh current weather"
            className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl border border-white/10 backdrop-blur-md transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
          </button>

          {/* Unit Toggle (°C / °F) */}
          <div className="flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-1">
            <button
              type="button"
              onClick={onToggleTempUnit}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                tempUnit === 'C'
                  ? 'bg-sky-500/90 text-white shadow-sm border border-sky-400/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °C
            </button>
            <button
              type="button"
              onClick={onToggleTempUnit}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                tempUnit === 'F'
                  ? 'bg-sky-500/90 text-white shadow-sm border border-sky-400/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
