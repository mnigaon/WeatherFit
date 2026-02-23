'use client';

import { useWeather } from '@/providers/WeatherProvider';
import { Settings, Thermometer, MapPin, X } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

export default function SettingsPage() {
  const { unit, setUnit, savedCities, saveCity, removeCity, weather, searchCity } = useWeather();
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleSaveCurrent = () => {
    if (weather) {
      saveCity(weather.city);
      showToast(`✅ ${weather.city} saved!`);
    }
  };

  const handleRemove = (city: string) => {
    removeCity(city);
    showToast(`🗑️ ${city} removed`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 relative overflow-hidden">
      <div className="absolute w-80 h-80 bg-slate-700 rounded-full blur-3xl opacity-20 -top-20 -right-20 animate-blob" />
      <div className="absolute w-72 h-72 bg-zinc-700 rounded-full blur-3xl opacity-15 bottom-32 -left-20 animate-blob delay-2000" />

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-5 py-2.5 text-white text-sm font-medium animate-fade-up">
          {toast}
        </div>
      )}

      <div className="relative z-10 p-6 max-w-lg mx-auto">
        <div className="pt-10 mb-8 animate-fade-up">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center">
              <Settings size={16} className="text-white" />
            </div>
            <h1 className="text-white text-2xl font-bold">Settings</h1>
          </div>
        </div>

        {/* Temperature Unit */}
        <div className="animate-fade-up delay-100 mb-5">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
            <Thermometer size={12} /> Temperature Unit
          </p>
          <div className="flex gap-3">
            {(['C', 'F'] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={clsx(
                  'flex-1 py-4 rounded-2xl border text-lg font-semibold transition-all active:scale-95',
                  unit === u
                    ? 'bg-white/20 border-white/40 text-white'
                    : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                )}
              >
                °{u}
              </button>
            ))}
          </div>
        </div>

        {/* Saved Cities */}
        <div className="animate-fade-up delay-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/40 text-xs uppercase tracking-widest flex items-center gap-2">
              <MapPin size={12} /> Saved Cities
            </p>
            {weather && (
              <button
                onClick={handleSaveCurrent}
                disabled={savedCities.includes(weather.city)}
                className="text-xs text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                + Save {weather.city}
              </button>
            )}
          </div>

          {savedCities.length === 0 ? (
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 text-center">
              <p className="text-white/30 text-sm">No saved cities yet.</p>
              <p className="text-white/20 text-xs mt-1">Save a city to quickly switch locations.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {savedCities.map((city, i) => {
                const isCurrent = weather?.city === city;
                return (
                  <div
                    key={city}
                    className={clsx(
                      'animate-fade-up backdrop-blur-md rounded-2xl border flex items-center overflow-hidden transition-all',
                      isCurrent
                        ? 'bg-white/20 border-white/30'
                        : 'bg-white/8 border-white/10 hover:border-white/20'
                    )}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {isCurrent && (
                      <div className="w-1 self-stretch bg-gradient-to-b from-blue-400 to-indigo-400 shrink-0" />
                    )}
                    <button
                      onClick={() => searchCity(city)}
                      className="flex-1 px-4 py-3.5 text-left font-medium text-sm hover:text-white/80 transition-colors flex items-center gap-2"
                    >
                      <span className="text-white">{city}</span>
                      {isCurrent && <span className="text-xs text-blue-300 font-normal">● Now</span>}
                    </button>
                    <button
                      onClick={() => handleRemove(city)}
                      className="px-4 py-3.5 text-white/30 hover:text-red-400 transition-colors"
                    >
                      <X size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* App Info */}
        <div className="animate-fade-up delay-300 mt-8 text-center">
          <p className="text-white/20 text-xs">WeatherFit · Powered by OpenWeather</p>
        </div>
      </div>
    </div>
  );
}
