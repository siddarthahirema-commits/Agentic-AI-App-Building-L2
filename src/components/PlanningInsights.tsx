import React from 'react';
import {
  Shirt,
  Umbrella,
  Sun,
  Wind,
  Droplets,
  Car,
  Footprints,
  Bike,
  Utensils,
  Sparkles,
  Camera,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { WeatherData } from '../types';
import { generateSmartRecommendations, calculateActivityScores } from '../utils/recommendations';

interface PlanningInsightsProps {
  weather: WeatherData;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Shirt,
  Umbrella,
  Sun,
  Wind,
  Droplets,
  Car,
  Footprints,
  Bike,
  Utensils,
  Sparkles,
  Camera,
  Compass,
};

export const PlanningInsights: React.FC<PlanningInsightsProps> = ({ weather }) => {
  const recommendations = generateSmartRecommendations(weather);
  const activities = calculateActivityScores(weather);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'alert':
        return {
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          icon: ShieldAlert,
        };
      case 'warning':
        return {
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: AlertTriangle,
        };
      case 'success':
        return {
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: CheckCircle2,
        };
      default:
        return {
          badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          icon: Info,
        };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 65) return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
    if (score >= 45) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    if (score >= 25) return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="space-y-8">
      {/* 1. Rule-Based Smart Weather Recommendations */}
      <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="p-2.5 bg-amber-500/20 text-amber-300 rounded-2xl border border-amber-400/30 backdrop-blur-sm">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Smart Travel & Weather Recommendations</h3>
            <p className="text-xs text-slate-300">
              Rule-based planning insights based on active telemetry
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => {
            const IconComp = ICON_MAP[rec.iconName] || Info;
            const style = getSeverityBadge(rec.severity);
            const SeverityIcon = style.icon;

            return (
              <div
                key={rec.id}
                className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-2xl p-5 flex flex-col justify-between space-y-3 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-950/40 backdrop-blur-sm text-sky-300 border border-white/10">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-white">{rec.title}</h4>
                  </div>

                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg border backdrop-blur-sm flex items-center gap-1 ${style.badge}`}>
                    <SeverityIcon className="w-3 h-3" />
                    <span>{rec.severity}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{rec.detail}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Outdoor Activity Feasibility Index */}
      <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-emerald-400/30 backdrop-blur-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Outdoor Activity Suitability</h3>
            <p className="text-xs text-slate-300">
              Calculated feasibility scores for outdoor plans and sports
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((act) => {
            const IconComp = ICON_MAP[act.iconName] || Sparkles;
            const colorClass = getScoreColor(act.score);

            return (
              <div
                key={act.name}
                className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-950/40 backdrop-blur-sm text-emerald-300 border border-white/10">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-white">{act.name}</span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${colorClass}`}>
                    {act.score}/100
                  </span>
                </div>

                {/* Score Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300 font-medium">
                    <span>Suitability</span>
                    <span className="text-slate-100 font-semibold">{act.status}</span>
                  </div>
                  <div className="h-2 bg-slate-950/60 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-500 rounded-full"
                      style={{ width: `${act.score}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic">{act.reason}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
