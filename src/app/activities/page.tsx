'use client';

import { useWeather } from '@/providers/WeatherProvider';
import { Zap, RefreshCw } from 'lucide-react';
import clsx from 'clsx';
import { formatTemp } from '@/lib/utils';

export default function ActivitiesPage() {
  const { weather, recommendation, loading, error, refetch, unit } = useWeather();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 relative overflow-hidden">
        <div className="absolute w-72 h-72 bg-emerald-600 rounded-full blur-3xl opacity-20 -top-10 -right-10 animate-blob" />
        <div className="absolute w-64 h-64 bg-teal-500 rounded-full blur-3xl opacity-15 bottom-20 -left-10 animate-blob delay-2000" />
        <div className="relative z-10 text-center">
          <div className="text-7xl mb-6 animate-float">🎯</div>
          <p className="text-white/60 text-lg font-light">Finding activities for you...</p>
        </div>
      </div>
    );
  }

  if (error || !weather || !recommendation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 p-6">
        <div className="text-6xl mb-5">🤔</div>
        <p className="text-white text-lg font-semibold mb-4">{error || 'Could not load data'}</p>
        <button onClick={refetch} className="flex items-center gap-2 bg-white/15 px-7 py-3 rounded-full text-white text-sm border border-white/20 hover:bg-white/25 transition-all active:scale-95">
          <RefreshCw size={15} /> Try again
        </button>
      </div>
    );
  }

  const { activities } = recommendation;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 relative overflow-hidden">
      <div className="absolute w-80 h-80 bg-emerald-500 rounded-full blur-3xl opacity-20 -top-20 -right-20 animate-blob" />
      <div className="absolute w-72 h-72 bg-teal-600 rounded-full blur-3xl opacity-15 bottom-32 -left-20 animate-blob delay-2000" />

      <div className="relative z-10 p-6 max-w-lg mx-auto">
        <div className="pt-10 mb-6 animate-fade-up">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <h1 className="text-white text-2xl font-bold">Today's Activities</h1>
          </div>
          <p className="text-white/40 text-sm ml-11">
            {weather.city} · {formatTemp(weather.temperature, unit)} · {weather.description}
          </p>
        </div>

        <div className="space-y-3">
          {activities.map((activity, i) => (
            <div
              key={i}
              className="animate-fade-up bg-white/8 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all"
              style={{ animationDelay: `${(i + 1) * 80}ms` }}
            >
              <div className={clsx(
                'h-0.5 w-full',
                activity.type === 'outdoor'
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-300'
                  : 'bg-gradient-to-r from-blue-400 to-cyan-300'
              )} />
              <div className="p-4 flex items-start gap-4">
                <div className="flex flex-col items-center gap-1.5 pt-0.5">
                  <span className="text-3xl">{activity.emoji}</span>
                  <span className="text-white/30 text-xs font-semibold">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-semibold">{activity.name}</span>
                    <span className={clsx(
                      'text-xs px-2 py-0.5 rounded-full font-medium',
                      activity.type === 'outdoor'
                        ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/30'
                        : 'bg-blue-500/25 text-blue-300 border border-blue-500/30'
                    )}>
                      {activity.type === 'outdoor' ? 'Outdoor' : 'Indoor'}
                    </span>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed">{activity.reason}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
