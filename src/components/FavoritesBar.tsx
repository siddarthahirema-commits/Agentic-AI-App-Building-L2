import React from 'react';
import { Star, MapPin, Plus, Trash2, Globe } from 'lucide-react';
import { LocationData } from '../types';
import { POPULAR_CITIES } from '../services/weatherApi';

interface FavoritesBarProps {
  favorites: LocationData[];
  currentLocation: LocationData | null;
  onSelectCity: (city: LocationData) => void;
  onRemoveFavorite: (cityId: number) => void;
}

export const FavoritesBar: React.FC<FavoritesBarProps> = ({
  favorites,
  currentLocation,
  onSelectCity,
  onRemoveFavorite,
}) => {
  return (
    <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 space-y-3 shadow-xl">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
        <div className="flex items-center gap-2 text-slate-100">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Favorite Locations & Quick Access</span>
        </div>
        <span className="text-[11px] text-slate-400">
          {favorites.length} saved
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Saved Favorites Pills */}
        {favorites.map((city) => {
          const isActive = currentLocation?.id === city.id;
          return (
            <div
              key={`fav-${city.id}`}
              className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold backdrop-blur-md transition-all ${
                isActive
                  ? 'bg-sky-500/90 text-white border-sky-400/60 shadow-md shadow-sky-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectCity(city)}
                className="flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 opacity-80" />
                <span>{city.name}</span>
                {city.country_code && (
                  <span className="text-[10px] opacity-70 uppercase font-mono">
                    ({city.country_code})
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFavorite(city.id);
                }}
                title="Remove favorite"
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-rose-400 transition-opacity ml-1"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          );
        })}

        {/* Popular Global Cities Fallback Pills */}
        {favorites.length < 5 && (
          <div className="flex items-center gap-2 border-l border-white/10 pl-2">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Globe className="w-3 h-3" /> Popular:
            </span>
            {POPULAR_CITIES.filter(
              (p) => !favorites.some((f) => f.name.toLowerCase() === p.name.toLowerCase())
            )
              .slice(0, 4)
              .map((city) => (
                <button
                  key={`pop-${city.id}`}
                  type="button"
                  onClick={() => onSelectCity(city)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs backdrop-blur-md transition-colors"
                >
                  {city.name}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
