'use client';

import { useWeather } from '@/providers/WeatherProvider';
import { Calendar, RefreshCw, Droplets } from 'lucide-react';
import { formatTempValue, tempUnit } from '@/lib/utils';

function getWeatherEmoji(condition: string, icon: string): string {
  const isNight = icon.endsWith('n');
  switch (condition) {
    case 'Clear': return isNight ? '🌙' : '☀️';
    case 'Clouds': return '☁️';
    case 'Rain': return '🌧️';
    case 'Drizzle': return '🌦️';
    case 'Snow': return '❄️';
    case 'Thunderstorm': return '⛈️';
    case 'Mist':
    case 'Fog': return '🌫️';
    default: return '🌤️';
  }
}

export default function WeeklyPage() {
  const { weather, forecast, loading, error, refetch, unit } = useWeather();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 relative overflow-hidden">
        <div className="absolute w-72 h-72 bg-blue-600 rounded-full blur-3xl opacity-20 -top-10 -right-10 animate-blob" />
        <div className="absolute w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-15 bottom-20 -left-10 animate-blob delay-2000" />
        <div className="relative z-10 text-center">
          <div className="text-7xl mb-6 animate-float">📅</div>
          <p className="text-white/60 text-lg font-light">Loading weekly forecast...</p>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 p-6">
        <div className="text-6xl mb-5">⚠️</div>
        <p className="text-white text-lg font-semibold mb-4">{error || 'No data available'}</p>
        <button onClick={refetch} className="flex items-center gap-2 bg-white/15 px-7 py-3 rounded-full text-white text-sm border border-white/20 hover:bg-white/25 transition-all active:scale-95">
          <RefreshCw size={15} /> Try again
        </button>
      </div>
    );
  }

  const hasRain = forecast.some((d) => d.pop > 60);
  const allTemps = forecast.flatMap((d) => [formatTempValue(d.tempMin, unit), formatTempValue(d.tempMax, unit)]);
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const tempRange = globalMax - globalMin || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      <div className="absolute w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-20 -top-20 -right-20 animate-blob" />
      <div className="absolute w-72 h-72 bg-indigo-600 rounded-full blur-3xl opacity-15 bottom-32 -left-20 animate-blob delay-2000" />

      <div className="relative z-10 p-6 max-w-lg mx-auto">
        <div className="pt-10 mb-6 animate-fade-up">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center">
              <Calendar size={16} className="text-white" />
            </div>
            <h1 className="text-white text-2xl font-bold">Weekly Forecast</h1>
          </div>
          <p className="text-white/40 text-sm ml-11">{weather.city} · {forecast.length}-day forecast · {tempUnit(unit)}</p>
        </div>

        <div className="space-y-2.5">
          {forecast.map((day, i) => {
            const isToday = i === 0;
            const barLeft = ((day.tempMin - globalMin) / tempRange) * 100;
            const barWidth = ((day.tempMax - day.tempMin) / tempRange) * 100;

            return (
              <div
                key={day.date}
                className={`animate-fade-up rounded-2xl border transition-all overflow-hidden ${isToday
                    ? 'bg-white/20 border-white/30'
                    : 'bg-white/8 border-white/10 hover:border-white/20'
                  }`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {isToday && <div className="h-0.5 w-full bg-gradient-to-r from-blue-400 to-indigo-400" />}
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 shrink-0">
                      <p className={`font-semibold text-sm ${isToday ? 'text-white' : 'text-white/80'}`}>
                        {isToday ? 'Today' : day.dayOfWeek}
                      </p>
                      <p className="text-white/30 text-xs">{day.dateStr}</p>
                    </div>
                    <span className="text-2xl shrink-0">{getWeatherEmoji(day.condition, day.icon)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/60 text-xs truncate mb-2">{day.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-white/40 text-xs w-7 text-right">{formatTempValue(day.tempMin, unit)}°</span>
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full relative">
                          <div
                            className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 to-orange-400"
                            style={{ left: `${barLeft}%`, width: `${Math.max(barWidth, 8)}%` }}
                          />
                        </div>
                        <span className="text-white text-xs w-7">{formatTempValue(day.tempMax, unit)}°</span>
                      </div>
                    </div>
                    {day.pop > 0 && (
                      <div className="flex items-center gap-1 text-blue-300 text-xs shrink-0">
                        <Droplets size={10} />
                        <span>{day.pop}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {hasRain && (
          <div className="mt-4 animate-fade-up bg-blue-500/15 backdrop-blur-md rounded-2xl p-4 border border-blue-400/25">
            <p className="text-blue-200 text-sm">
              ☂️ Rain is expected this week — don't forget your umbrella!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
