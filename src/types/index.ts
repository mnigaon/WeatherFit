export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  description: string;
  condition: string;
  icon: string;
  windSpeed: number;
  visibility: number;
  lat: number;
  lon: number;
  sunrise: number;
  sunset: number;
  dt: number;
}

export interface ForecastDay {
  date: string;
  dateStr: string;
  dayOfWeek: string;
  tempMin: number;
  tempMax: number;
  description: string;
  condition: string;
  icon: string;
  humidity: number;
  pop: number;
}

export interface HourlyForecast {
  time: string;
  hour: number;
  temperature: number;
  feelsLike: number;
  condition: string;
  icon: string;
  description: string;
  pop: number;
  humidity: number;
}

export interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
}

export interface OutfitRecommendation {
  top: string;
  bottom: string;
  outer: string;
  shoes: string;
  accessory: string;
  summary: string;
}

export interface ActivityItem {
  name: string;
  type: 'indoor' | 'outdoor';
  emoji: string;
  reason: string;
}

export interface AIRecommendation {
  outfit: OutfitRecommendation;
  activities: ActivityItem[];
  dailySummary: string;
}

export interface WeatherContextType {
  weather: WeatherData | null;
  forecast: ForecastDay[];
  hourly: HourlyForecast[];
  airQuality: AirQualityData | null;
  recommendation: AIRecommendation | null;
  loading: boolean;
  error: string | null;
  unit: 'C' | 'F';
  setUnit: (unit: 'C' | 'F') => void;
  savedCities: string[];
  saveCity: (city: string) => void;
  removeCity: (city: string) => void;
  refetch: () => void;
  searchCity: (city: string) => void;
}
