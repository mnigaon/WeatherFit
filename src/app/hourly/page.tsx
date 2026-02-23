'use client';

import { useWeather } from '@/providers/WeatherProvider';
import { Clock, RefreshCw, Droplets } from 'lucide-react';
import { formatTempValue, tempUnit } from '@/lib/utils';
import clsx from 'clsx';

function getConditionEmoji(condition: string, icon: string): string {
  const isNight = icon.endsWith('n');
  switch (condition) {
    case 'Clear': return isNight ? '🌙' : '☀️';
    case 'Clouds': return '☁️';
    case 'Rain': return '🌧️';
    case 'Drizzle': return '🌦️';
    case 'Snow': return '❄️';
    case 'Thunderstorm': return '⛈️';
    default: return '🌤️';
  }
}

export default function HourlyPage() {
  const { weather, hourly, loading, error, refetch, unit } = useWeather();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute w-72 h-72 bg-cyan-600 rounded-full blur-3xl opacity-20 -top-10 -right-10 animate-blob" />
        <div className="relative z-10 text-center">
          <div className="text-7xl mb-6 animate-float">🕐</div>
          <p className="text-white/60 text-lg font-light">Loading hourly forecast...</p>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-900 p-6">
        <div className="text-6xl mb-5">⚠️</div>
        <p className="text-white text-lg font-semibold mb-4">{error || 'No data available'}</p>
        <button onClick={refetch} className="flex items-center gap-2 bg-white/15 px-7 py-3 rounded-full text-white text-sm border border-white/20 hover:bg-white/25 transition-all active:scale-95">
          <RefreshCw size={15} /> Try again
        </button>
      </div>
    );
  }

  const temps = hourly.map((h) => formatTempValue(h.temperature, unit));
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = maxTemp - minTemp || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <div className="absolute w-80 h-80 bg-cyan-600 rounded-full blur-3xl opacity-20 -top-20 -right-20 animate-blob" />
      <div className="absolute w-72 h-72 bg-blue-600 rounded-full blur-3xl opacity-15 bottom-32 -left-20 animate-blob delay-2000" />

      <div className="relative z-10 p-6 max-w-lg mx-auto">
        <div className="pt-10 mb-6 animate-fade-up">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center">
              <Clock size={16} className="text-white" />
            </div>
            <h1 className="text-white text-2xl font-bold">Hourly Forecast</h1>
          </div>
          <p className="text-white/40 text-sm ml-11">{weather.city} · Next 24 hours</p>
        </div>

        {/* Temperature bar chart */}
        <div className="animate-fade-up delay-100 bg-white/8 backdrop-blur-md rounded-2xl p-5 border border-white/10 mb-5">
          <div className="flex items-end justify-between gap-1 h-20 mb-3">
            {hourly.map((h, i) => {
              const val = formatTempValue(h.temperature, unit);
              const heightPct = ((val - minTemp) / tempRange) * 70 + 30;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-cyan-500 to-blue-400 opacity-80 transition-all"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between">
            {hourly.map((h, i) => (
              <div key={i} className="flex-1 text-center">
                <p className="text-white/40 text-xs">{h.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly cards */}
        <div className="space-y-2.5">
          {hourly.map((h, i) => (
            <div
              key={i}
              className={clsx(
                'animate-fade-up backdrop-blur-md rounded-2xl border p-4 flex items-center gap-4 transition-all',
                i === 0 ? 'bg-white/20 border-white/30' : 'bg-white/8 border-white/10 hover:border-white/20'
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {i === 0 && <div className="absolute left-0 top-0 h-full w-0.5 rounded-full bg-gradient-to-b from-cyan-400 to-blue-400" />}
              <div className="w-14 shrink-0">
                <p className={clsx('font-semibold text-sm', i === 0 ? 'text-white' : 'text-white/80')}>
                  {i === 0 ? 'Now' : h.time}
                </p>
              </div>
              <span className="text-2xl shrink-0">{getConditionEmoji(h.condition, h.icon)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white/60 text-xs truncate">{h.description}</p>
                {h.pop > 0 && (
                  <div className="flex items-center gap-1 text-blue-300 text-xs mt-0.5">
                    <Droplets size={10} />
                    <span>{h.pop}%</span>
                  </div>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-white font-semibold">{formatTempValue(h.temperature, unit)}°</p>
                <p className="text-white/40 text-xs">Feels {formatTempValue(h.feelsLike, unit)}°</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-white/20 text-xs text-center mt-4">3-hour intervals · {tempUnit(unit)}</p>
      </div>
    </div>
  );
}
