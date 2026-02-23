'use client';

import { useWeather } from '@/providers/WeatherProvider';
import { Wind, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

const AQI_LEVELS = [
  { label: 'Good', color: 'text-emerald-400', bg: 'bg-emerald-500', bar: 'from-emerald-400 to-green-300', desc: 'Air quality is satisfactory.' },
  { label: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-500', bar: 'from-yellow-400 to-lime-300', desc: 'Acceptable air quality.' },
  { label: 'Moderate', color: 'text-orange-400', bg: 'bg-orange-500', bar: 'from-orange-400 to-yellow-300', desc: 'Sensitive groups may be affected.' },
  { label: 'Poor', color: 'text-red-400', bg: 'bg-red-500', bar: 'from-red-400 to-orange-300', desc: 'Everyone may experience effects.' },
  { label: 'Very Poor', color: 'text-purple-400', bg: 'bg-purple-500', bar: 'from-purple-400 to-red-400', desc: 'Health alert — avoid outdoors.' },
];

const pollutants = [
  { key: 'pm25' as const, label: 'PM2.5', unit: 'μg/m³', safe: 25 },
  { key: 'pm10' as const, label: 'PM10', unit: 'μg/m³', safe: 50 },
  { key: 'no2' as const, label: 'NO₂', unit: 'μg/m³', safe: 40 },
  { key: 'o3' as const, label: 'O₃', unit: 'μg/m³', safe: 100 },
  { key: 'co' as const, label: 'CO', unit: 'μg/m³', safe: 10000 },
];

export default function AirQualityPage() {
  const { weather, airQuality, loading, error, refetch } = useWeather();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 via-green-900 to-slate-900 relative overflow-hidden">
        <div className="absolute w-72 h-72 bg-teal-600 rounded-full blur-3xl opacity-20 -top-10 -right-10 animate-blob" />
        <div className="relative z-10 text-center">
          <div className="text-7xl mb-6 animate-float">🌬️</div>
          <p className="text-white/60 text-lg font-light">Loading air quality...</p>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-900 via-green-900 to-slate-900 p-6">
        <div className="text-6xl mb-5">⚠️</div>
        <p className="text-white text-lg font-semibold mb-4">{error || 'No data available'}</p>
        <button onClick={refetch} className="flex items-center gap-2 bg-white/15 px-7 py-3 rounded-full text-white text-sm border border-white/20 hover:bg-white/25 transition-all active:scale-95">
          <RefreshCw size={15} /> Try again
        </button>
      </div>
    );
  }

  const level = airQuality ? AQI_LEVELS[airQuality.aqi - 1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-emerald-900 to-slate-900 relative overflow-hidden">
      <div className="absolute w-80 h-80 bg-teal-500 rounded-full blur-3xl opacity-20 -top-20 -right-20 animate-blob" />
      <div className="absolute w-72 h-72 bg-emerald-600 rounded-full blur-3xl opacity-15 bottom-32 -left-20 animate-blob delay-2000" />

      <div className="relative z-10 p-6 max-w-lg mx-auto">
        <div className="pt-10 mb-6 animate-fade-up">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center">
              <Wind size={16} className="text-white" />
            </div>
            <h1 className="text-white text-2xl font-bold">Air Quality</h1>
          </div>
          <p className="text-white/40 text-sm ml-11">{weather.city}</p>
        </div>

        {!airQuality ? (
          <div className="animate-fade-up bg-white/8 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
            <p className="text-4xl mb-3">🌫️</p>
            <p className="text-white/60 text-sm">Air quality data unavailable for this location.</p>
          </div>
        ) : (
          <>
            {/* AQI Score */}
            <div className="animate-fade-up delay-100 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Air Quality Index</p>
                  <p className={clsx('text-3xl font-bold', level?.color)}>{level?.label}</p>
                  <p className="text-white/60 text-sm mt-1">{level?.desc}</p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                  <span className={clsx('text-3xl font-bold', level?.color)}>{airQuality.aqi}</span>
                </div>
              </div>
              {/* AQI bar */}
              <div className="flex gap-1">
                {AQI_LEVELS.map((l, i) => (
                  <div
                    key={i}
                    className={clsx(
                      'flex-1 h-2 rounded-full transition-all',
                      i < airQuality.aqi ? `bg-gradient-to-r ${l.bar}` : 'bg-white/10'
                    )}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-white/30 text-xs">Good</span>
                <span className="text-white/30 text-xs">Very Poor</span>
              </div>
            </div>

            {/* Pollutants */}
            <div className="space-y-2.5">
              {pollutants.map(({ key, label, unit, safe }, i) => {
                const value = airQuality[key];
                const pct = Math.min((value / safe) * 100, 100);
                const isOver = value > safe;
                return (
                  <div
                    key={key}
                    className="animate-fade-up bg-white/8 backdrop-blur-md rounded-2xl p-4 border border-white/10"
                    style={{ animationDelay: `${(i + 2) * 60}ms` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/70 text-sm font-medium">{label}</span>
                      <span className={clsx('text-sm font-semibold', isOver ? 'text-red-400' : 'text-white')}>
                        {value.toFixed(1)} <span className="text-white/40 text-xs font-normal">{unit}</span>
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full">
                      <div
                        className={clsx('h-full rounded-full bg-gradient-to-r', isOver ? 'from-red-400 to-orange-300' : 'from-teal-400 to-emerald-300')}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
