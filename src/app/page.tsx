'use client';

import { useState } from 'react';
import { useWeather } from '@/providers/WeatherProvider';
import { RefreshCw, Droplets, Wind, Eye, Thermometer, Search, X, MapPin, BookmarkPlus } from 'lucide-react';
import { formatTemp, formatTempValue } from '@/lib/utils';

function getBgColors(condition: string, icon: string) {
  const isNight = icon.endsWith('n');
  if (isNight) return { bg: 'from-indigo-950 via-blue-950 to-slate-900', blob1: 'bg-indigo-600', blob2: 'bg-blue-700' };
  switch (condition) {
    case 'Clear': return { bg: 'from-amber-400 via-orange-300 to-sky-500', blob1: 'bg-yellow-300', blob2: 'bg-orange-400' };
    case 'Clouds': return { bg: 'from-slate-600 via-gray-500 to-blue-600', blob1: 'bg-slate-400', blob2: 'bg-blue-500' };
    case 'Rain':
    case 'Drizzle': return { bg: 'from-blue-800 via-blue-600 to-slate-700', blob1: 'bg-blue-500', blob2: 'bg-slate-600' };
    case 'Snow': return { bg: 'from-sky-300 via-blue-200 to-slate-400', blob1: 'bg-sky-200', blob2: 'bg-blue-300' };
    case 'Thunderstorm': return { bg: 'from-gray-900 via-slate-800 to-gray-900', blob1: 'bg-slate-600', blob2: 'bg-gray-700' };
    default: return { bg: 'from-slate-600 via-blue-500 to-slate-700', blob1: 'bg-blue-400', blob2: 'bg-slate-500' };
  }
}

function getConditionEmoji(condition: string, icon: string): string {
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

export default function HomePage() {
  const { weather, recommendation, loading, error, refetch, searchCity, unit, saveCity, savedCities } = useWeather();
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    if (weather) {
      saveCity(weather.city);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2000);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    searchCity(query.trim());
    setQuery('');
    setShowSearch(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute w-72 h-72 bg-blue-600 rounded-full blur-3xl opacity-20 top-10 -left-16 animate-blob" />
        <div className="absolute w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 bottom-20 right-0 animate-blob delay-2000" />
        <div className="relative z-10 text-center">
          <div className="text-7xl mb-6 animate-float">🌤️</div>
          <p className="text-white/60 text-lg font-light tracking-wide">Loading weather...</p>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 p-6 relative overflow-hidden">
        <div className="absolute w-72 h-72 bg-blue-600 rounded-full blur-3xl opacity-15 top-0 -right-20 animate-blob" />
        <div className="relative z-10 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">📍</div>
            <p className="text-white text-xl font-semibold mb-2">Where are you?</p>
            <p className="text-white/50 text-sm">{error || 'Enter a city to get started'}</p>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Seoul, Tokyo, New York..."
              className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/40"
            />
            <button
              type="submit"
              className="bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-white hover:bg-white/30 transition-all active:scale-95"
            >
              <Search size={18} />
            </button>
          </form>
          <button
            onClick={refetch}
            className="w-full flex items-center justify-center gap-2 bg-white/10 border border-white/15 px-6 py-3 rounded-2xl text-white/60 text-sm hover:bg-white/15 transition-all"
          >
            <MapPin size={14} /> Use my location
          </button>
        </div>
      </div>
    );
  }

  const { bg, blob1, blob2 } = getBgColors(weather.condition, weather.icon);
  const emoji = getConditionEmoji(weather.condition, weather.icon);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bg} relative overflow-hidden`}>
      <div className={`absolute w-80 h-80 ${blob1} rounded-full blur-3xl opacity-25 -top-20 -right-20 animate-blob`} />
      <div className={`absolute w-72 h-72 ${blob2} rounded-full blur-3xl opacity-20 bottom-32 -left-20 animate-blob delay-2000`} />
      <div className="absolute w-56 h-56 bg-white/5 rounded-full blur-2xl opacity-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-blob delay-4000" />

      <div className="relative z-10 p-6 max-w-lg mx-auto">
        {/* 저장 토스트 */}
        {savedToast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-5 py-2.5 text-white text-sm font-medium animate-fade-up">
            ✅ {weather.city} saved!
          </div>
        )}

        <div className="flex justify-between items-center pt-10 mb-8 animate-fade-up">
          <div>
            <p className="text-white/50 text-xs uppercase tracking-widest font-medium">Current Location</p>
            <h1 className="text-white text-2xl font-bold mt-0.5">{weather.city}, {weather.country}</h1>
            <p className="text-white/30 text-xs mt-0.5">via OpenWeather · may vary slightly from other sources</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={savedCities.includes(weather.city)}
              className="text-white/40 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all p-2.5 rounded-full hover:bg-white/10 active:scale-90"
              title={savedCities.includes(weather.city) ? 'Already saved' : 'Save city'}
            >
              <BookmarkPlus size={18} />
            </button>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-white/40 hover:text-white transition-all p-2.5 rounded-full hover:bg-white/10 active:scale-90"
            >
              {showSearch ? <X size={18} /> : <Search size={18} />}
            </button>
            <button
              onClick={refetch}
              className="text-white/40 hover:text-white transition-all p-2.5 rounded-full hover:bg-white/10 active:scale-90"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {showSearch && (
          <form onSubmit={handleSearch} className="flex gap-2 mb-6 animate-fade-up">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city..."
              autoFocus
              className="flex-1 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all"
            />
            <button
              type="submit"
              className="bg-white/20 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-3 text-white hover:bg-white/30 transition-all active:scale-95"
            >
              <Search size={18} />
            </button>
          </form>
        )}

        <div className="text-center my-6 animate-fade-up delay-100">
          <div className="text-7xl mb-3 animate-float">{emoji}</div>
          <div className="flex items-start justify-center leading-none">
            <span className="text-white font-extralight" style={{ fontSize: 'clamp(5rem, 22vw, 7rem)' }}>
              {formatTempValue(weather.temperature, unit)}
            </span>
            <span className="text-white/60 text-3xl mt-3 ml-1">{unit === 'F' ? '°F' : '°C'}</span>
          </div>
          <p className="text-white/80 text-lg capitalize mt-3 font-light">{weather.description}</p>
          <p className="text-white/40 text-sm mt-1">Feels like {formatTemp(weather.feelsLike, unit)}</p>
        </div>

        {recommendation && (
          <div className="animate-fade-up delay-200 mb-5">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3.5 border border-white/20 text-center">
              <p className="text-white/90 text-sm font-medium leading-relaxed">{recommendation.dailySummary}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 animate-fade-up delay-300">
          {[
            { icon: Droplets, label: 'Humidity', value: `${weather.humidity}%`, color: 'text-blue-300' },
            { icon: Thermometer, label: 'Feels Like', value: formatTemp(weather.feelsLike, unit), color: 'text-orange-300' },
            { icon: Wind, label: 'Wind', value: `${weather.windSpeed} km/h`, color: 'text-teal-300' },
            { icon: Eye, label: 'Visibility', value: `${weather.visibility} km`, color: 'text-purple-300' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 hover:bg-white/15 transition-colors">
              <div className={`flex items-center gap-1.5 ${color} mb-2`}>
                <Icon size={14} />
                <span className="text-xs font-medium opacity-80">{label}</span>
              </div>
              <p className="text-white text-xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
