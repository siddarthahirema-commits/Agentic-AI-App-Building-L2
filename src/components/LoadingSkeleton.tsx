import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse max-w-7xl mx-auto px-4 py-6">
      {/* Hero Card Skeleton */}
      <div className="h-96 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-3 w-1/3">
            <div className="h-4 bg-white/10 rounded w-2/3" />
            <div className="h-10 bg-white/10 rounded w-full" />
            <div className="h-3 bg-white/10 rounded w-1/2" />
          </div>
          <div className="h-12 w-32 bg-white/10 rounded-2xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="h-20 bg-white/10 rounded-2xl w-2/3" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-white/10 rounded-2xl" />
            <div className="h-16 bg-white/10 rounded-2xl" />
            <div className="h-16 bg-white/10 rounded-2xl" />
            <div className="h-16 bg-white/10 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Hourly Slider Skeleton */}
      <div className="h-44 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-6 space-y-4">
        <div className="h-5 bg-white/10 rounded w-1/4" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 w-24 shrink-0 bg-white/10 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Forecast & Insights Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-96 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-6" />
        <div className="h-96 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-6" />
      </div>
    </div>
  );
};
