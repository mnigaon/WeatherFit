'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { WeatherContextType, WeatherData, ForecastDay, HourlyForecast, AirQualityData, AIRecommendation } from '@/types';

const WeatherContext = createContext<WeatherContextType | null>(null);

export function useWeather() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeather must be used within WeatherProvider');
  return ctx;
}

function parseForecast(data: { list: { dt: number; dt_txt: string; main: { temp: number; feels_like: number; humidity: number }; weather: { description: string; main: string; icon: string }[]; pop: number }[] }): ForecastDay[] {
  const days: Record<string, typeof data.list> = {};
  data.list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!days[date]) days[date] = [];
    days[date].push(item);
  });
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return Object.entries(days).slice(0, 7).map(([dateStr, items]) => {
    const midday = items.find((i) => i.dt_txt.includes('12:00')) || items[Math.floor(items.length / 2)];
    const temps = items.map((i) => i.main.temp);
    const date = new Date(dateStr);
    return {
      date: dateStr,
      dateStr: `${date.getMonth() + 1}/${date.getDate()}`,
      dayOfWeek: dayNames[date.getDay()],
      tempMin: Math.round(Math.min(...temps)),
      tempMax: Math.round(Math.max(...temps)),
      description: midday.weather[0].description,
      condition: midday.weather[0].main,
      icon: midday.weather[0].icon,
      humidity: midday.main.humidity,
      pop: Math.round(midday.pop * 100),
    };
  });
}

function parseHourly(data: { list: { dt: number; main: { temp: number; feels_like: number; humidity: number }; weather: { main: string; icon: string; description: string }[]; pop: number }[] }): HourlyForecast[] {
  return data.list.slice(0, 8).map((item) => {
    const date = new Date(item.dt * 1000);
    return {
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      hour: date.getHours(),
      temperature: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      condition: item.weather[0].main,
      icon: item.weather[0].icon,
      description: item.weather[0].description,
      pop: Math.round(item.pop * 100),
      humidity: item.main.humidity,
    };
  });
}

async function fetchWeatherAndRecommend(
  url: string,
  setWeather: (w: WeatherData) => void,
  setForecast: (f: ForecastDay[]) => void,
  setHourly: (h: HourlyForecast[]) => void,
  setRecommendation: (r: AIRecommendation) => void,
  setAirQuality: (a: AirQualityData | null) => void,
) {
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail?.message || 'Failed to load weather data');
  }
  const data = await res.json();
  const w = data.weather;

  const weatherData: WeatherData = {
    city: w.name,
    country: w.sys.country,
    temperature: Math.round(w.main.temp),
    feelsLike: Math.round(w.main.feels_like),
    humidity: w.main.humidity,
    description: w.weather[0].description,
    condition: w.weather[0].main,
    icon: w.weather[0].icon,
    windSpeed: Math.round(w.wind.speed * 3.6),
    visibility: Math.round(w.visibility / 1000),
    lat: w.coord.lat,
    lon: w.coord.lon,
    sunrise: w.sys.sunrise,
    sunset: w.sys.sunset,
    dt: w.dt,
  };

  setWeather(weatherData);
  setForecast(parseForecast(data.forecast));
  setHourly(parseHourly(data.forecast));

  const [recRes, aqRes] = await Promise.allSettled([
    fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(weatherData),
    }),
    fetch(`/api/airquality?lat=${weatherData.lat}&lon=${weatherData.lon}`),
  ]);

  if (recRes.status === 'fulfilled' && recRes.value.ok) {
    setRecommendation(await recRes.value.json());
  }
  if (aqRes.status === 'fulfilled' && aqRes.value.ok) {
    setAirQuality(await aqRes.value.json());
  } else {
    setAirQuality(null);
  }
}

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [hourly, setHourly] = useState<HourlyForecast[]>([]);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnitState] = useState<'C' | 'F'>('C');
  const [savedCities, setSavedCities] = useState<string[]>([]);

  useEffect(() => {
    const storedUnit = localStorage.getItem('wf_unit') as 'C' | 'F' | null;
    if (storedUnit) setUnitState(storedUnit);
    const storedCities = localStorage.getItem('wf_saved_cities');
    if (storedCities) setSavedCities(JSON.parse(storedCities));
  }, []);

  const setUnit = (u: 'C' | 'F') => {
    setUnitState(u);
    localStorage.setItem('wf_unit', u);
  };

  const saveCity = (city: string) => {
    setSavedCities((prev) => {
      if (prev.includes(city)) return prev;
      const next = [...prev, city];
      localStorage.setItem('wf_saved_cities', JSON.stringify(next));
      return next;
    });
  };

  const removeCity = (city: string) => {
    setSavedCities((prev) => {
      const next = prev.filter((c) => c !== city);
      localStorage.setItem('wf_saved_cities', JSON.stringify(next));
      return next;
    });
  };

  const fetchByGeo = useCallback(async () => {
    setLoading(true);
    setError(null);
    // GPS로 돌아갈 때는 last_city 초기화
    localStorage.removeItem('wf_last_city');
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000, enableHighAccuracy: true });
      });
      const { latitude: lat, longitude: lon } = position.coords;
      await fetchWeatherAndRecommend(`/api/weather?lat=${lat}&lon=${lon}`, setWeather, setForecast, setHourly, setRecommendation, setAirQuality);
    } catch (err: unknown) {
      const geoErr = err as GeolocationPositionError;
      if (geoErr.code === 1) {
        setError('Please allow location access or search for a city below.');
      } else {
        setError((err as Error).message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCity = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      await fetchWeatherAndRecommend(`/api/weather?q=${encodeURIComponent(city)}`, setWeather, setForecast, setHourly, setRecommendation, setAirQuality);
      // 마지막 검색 도시 저장
      localStorage.setItem('wf_last_city', city);
    } catch (err: unknown) {
      setError((err as Error).message || 'City not found');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 앱 시작 시: 마지막으로 본 도시가 있으면 그 도시 로드, 없으면 GPS
    const lastCity = localStorage.getItem('wf_last_city');
    if (lastCity) {
      searchCity(lastCity);
    } else {
      fetchByGeo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WeatherContext.Provider value={{
      weather, forecast, hourly, airQuality, recommendation,
      loading, error, unit, setUnit, savedCities, saveCity, removeCity,
      refetch: fetchByGeo, searchCity,
    }}>
      {children}
    </WeatherContext.Provider>
  );
}
