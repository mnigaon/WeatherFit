'use client';

import { useWeather } from '@/providers/WeatherProvider';
import { Shirt, RefreshCw } from 'lucide-react';
import { formatTemp } from '@/lib/utils';

const outfitItems = [
  { key: 'top' as const, label: 'Top', emoji: '👕', accent: 'from-blue-500 to-cyan-400' },
  { key: 'bottom' as const, label: 'Bottom', emoji: '👖', accent: 'from-indigo-500 to-blue-400' },
  { key: 'outer' as const, label: 'Outer Layer', emoji: '🧥', accent: 'from-orange-500 to-amber-400' },
  { key: 'shoes' as const, label: 'Shoes', emoji: '👟', accent: 'from-emerald-500 to-teal-400' },
  { key: 'accessory' as const, label: 'Accessory', emoji: '🧣', accent: 'from-purple-500 to-violet-400' },
];

export default function OutfitPage() {
  const { weather, recommendation, loading, error, refetch, unit } = useWeather();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="absolute w-72 h-72 bg-violet-600 rounded-full blur-3xl opacity-20 -top-10 -right-10 animate-blob" />
        <div className="absolute w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-15 bottom-20 -left-10 animate-blob delay-2000" />
        <div className="relative z-10 text-center">
          <div className="text-7xl mb-6 animate-float">👗</div>
          <p className="text-white/60 text-lg font-light">Loading outfit suggestions...</p>
        </div>
      </div>
    );
  }

  if (error || !weather || !recommendation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900 p-6">
        <div className="text-6xl mb-5">🤔</div>
        <p className="text-white text-lg font-semibold mb-4">{error || 'Could not load data'}</p>
        <button onClick={refetch} className="flex items-center gap-2 bg-white/15 px-7 py-3 rounded-full text-white text-sm border border-white/20 hover:bg-white/25 transition-all active:scale-95">
          <RefreshCw size={15} /> Try again
        </button>
      </div>
    );
  }

  const { outfit } = recommendation;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      <div className="absolute w-80 h-80 bg-violet-500 rounded-full blur-3xl opacity-20 -top-20 -right-20 animate-blob" />
      <div className="absolute w-72 h-72 bg-indigo-600 rounded-full blur-3xl opacity-15 bottom-32 -left-20 animate-blob delay-2000" />

      <div className="relative z-10 p-6 max-w-lg mx-auto">
        <div className="pt-10 mb-6 animate-fade-up">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center">
              <Shirt size={16} className="text-white" />
            </div>
            <h1 className="text-white text-2xl font-bold">Today's Outfit</h1>
          </div>
          <p className="text-white/40 text-sm ml-11">
            {weather.city} · {formatTemp(weather.temperature, unit)} · {weather.description}
          </p>
        </div>

        <div className="animate-fade-up delay-100 mb-5">
          <div className="bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/20">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Style Summary</p>
            <p className="text-white font-medium text-base leading-relaxed">{outfit.summary}</p>
          </div>
        </div>

        <div className="space-y-3">
          {outfitItems.map(({ key, label, emoji, accent }, i) => (
            <div
              key={key}
              className="animate-fade-up bg-white/8 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all"
              style={{ animationDelay: `${(i + 2) * 80}ms` }}
            >
              <div className={`h-0.5 w-full bg-gradient-to-r ${accent}`} />
              <div className="p-4 flex items-center gap-4">
                <span className="text-3xl">{emoji}</span>
                <div>
                  <p className="text-white/40 text-xs mb-0.5 uppercase tracking-wider">{label}</p>
                  <p className="text-white font-medium">{outfit[key]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
