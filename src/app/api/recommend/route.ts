import { NextRequest, NextResponse } from 'next/server';
import type { WeatherData, AIRecommendation } from '@/types';

function getOutfit(temp: number, condition: string, humidity: number, windSpeed: number) {
  const isWet = ['Rain', 'Drizzle', 'Thunderstorm'].includes(condition);
  const isSnow = condition === 'Snow';
  const isWindy = windSpeed > 30;

  if (temp < -10) {
    return {
      top: 'Thermal undershirt + heavy wool sweater',
      bottom: 'Thermal leggings + thick insulated pants',
      outer: 'Heavy down parka or winter coat',
      shoes: isSnow ? 'Insulated waterproof snow boots' : 'Insulated winter boots',
      accessory: 'Thick scarf, warm hat, and insulated gloves',
      summary: 'Extreme cold — layer up completely and cover all exposed skin.',
    };
  }
  if (temp < 0) {
    return {
      top: 'Thermal undershirt + fleece or thick knit sweater',
      bottom: 'Warm jeans or insulated pants',
      outer: isSnow ? 'Waterproof insulated coat' : 'Heavy winter coat',
      shoes: isSnow ? 'Waterproof snow boots' : 'Warm ankle boots',
      accessory: 'Scarf, beanie, and gloves',
      summary: 'Freezing — bundle up with proper winter layers.',
    };
  }
  if (temp < 10) {
    return {
      top: isWet ? 'Long-sleeve shirt + light sweater' : 'Long-sleeve shirt or light knit',
      bottom: 'Jeans or trousers',
      outer: isWet ? 'Waterproof rain jacket' : (isWindy ? 'Windbreaker' : 'Light coat or jacket'),
      shoes: isWet ? 'Waterproof boots or rain shoes' : 'Sneakers or ankle boots',
      accessory: isWet ? 'Umbrella + light scarf' : 'Light scarf',
      summary: 'Cool weather — a jacket is essential.',
    };
  }
  if (temp < 18) {
    return {
      top: 'T-shirt or light long-sleeve',
      bottom: 'Jeans or chinos',
      outer: isWet ? 'Light rain jacket' : (isWindy ? 'Light windbreaker' : 'Light cardigan or hoodie'),
      shoes: isWet ? 'Waterproof sneakers' : 'Sneakers or casual shoes',
      accessory: isWet ? 'Compact umbrella' : (humidity > 70 ? 'Light scarf' : 'Not needed'),
      summary: 'Mild weather — a light layer is enough.',
    };
  }
  if (temp < 25) {
    return {
      top: 'T-shirt or polo',
      bottom: 'Light pants, chinos, or shorts',
      outer: isWet ? 'Light rain jacket' : 'Not needed',
      shoes: isWet ? 'Waterproof sneakers' : 'Sneakers or loafers',
      accessory: isWet ? 'Umbrella' : 'Sunglasses',
      summary: 'Comfortable and warm — dress light and enjoy it.',
    };
  }
  return {
    top: 'Light t-shirt or tank top',
    bottom: 'Shorts or light breathable pants',
    outer: 'Not needed',
    shoes: 'Sandals or breathable sneakers',
    accessory: isWet ? 'Umbrella + cap' : 'Sunglasses + cap',
    summary: 'Hot outside — stay cool with breathable, light clothing.',
  };
}

function getActivities(temp: number, condition: string) {
  const isWet = ['Rain', 'Drizzle', 'Thunderstorm'].includes(condition);
  const isSnow = condition === 'Snow';
  const isClear = condition === 'Clear';
  const isCloudy = condition === 'Clouds';

  if (condition === 'Thunderstorm') {
    return [
      { name: 'Movie marathon at home', type: 'indoor' as const, emoji: '🎬', reason: 'Perfect excuse to stay in and binge your watchlist.' },
      { name: 'Board games or puzzles', type: 'indoor' as const, emoji: '🎲', reason: 'Great way to spend time with family or friends indoors.' },
      { name: 'Bake something', type: 'indoor' as const, emoji: '🍪', reason: 'Cozy baking session while listening to the rain.' },
      { name: 'Read a book', type: 'indoor' as const, emoji: '📚', reason: 'Storm outside = perfect reading atmosphere.' },
    ];
  }

  if (isWet) {
    return [
      { name: 'Visit a café', type: 'indoor' as const, emoji: '☕', reason: 'Warm drink and good vibes on a rainy day.' },
      { name: 'Museum or gallery', type: 'indoor' as const, emoji: '🏛️', reason: 'Explore culture without getting wet.' },
      { name: 'Indoor workout', type: 'indoor' as const, emoji: '🏋️', reason: 'Gym session keeps you active on rainy days.' },
      { name: 'Read or study', type: 'indoor' as const, emoji: '📖', reason: 'Rain makes the perfect background noise for focus.' },
      { name: 'Cook a new recipe', type: 'indoor' as const, emoji: '🍳', reason: 'Try something new in the kitchen.' },
    ];
  }

  if (isSnow) {
    return [
      { name: 'Build a snowman', type: 'outdoor' as const, emoji: '⛄', reason: 'Classic and fun snow activity.' },
      { name: 'Sledding', type: 'outdoor' as const, emoji: '🛷', reason: 'Find a slope and enjoy the snow.' },
      { name: 'Cozy café visit', type: 'indoor' as const, emoji: '☕', reason: 'Warm up with a hot drink after being outside.' },
      { name: 'Indoor board games', type: 'indoor' as const, emoji: '🎲', reason: 'Stay warm and have fun indoors.' },
    ];
  }

  if (temp >= 25 && isClear) {
    return [
      { name: 'Beach or lake visit', type: 'outdoor' as const, emoji: '🏖️', reason: 'Perfect weather to cool off near water.' },
      { name: 'Cycling', type: 'outdoor' as const, emoji: '🚴', reason: 'Great conditions for a long bike ride.' },
      { name: 'Picnic in the park', type: 'outdoor' as const, emoji: '🧺', reason: 'Grab some food and enjoy the sunshine.' },
      { name: 'Outdoor café', type: 'outdoor' as const, emoji: '🍹', reason: 'Sit outside and soak up the good weather.' },
      { name: 'Hiking', type: 'outdoor' as const, emoji: '🥾', reason: 'Clear skies make for great trail views.' },
    ];
  }

  if (temp >= 10 && (isClear || isCloudy)) {
    return [
      { name: 'Walk in the park', type: 'outdoor' as const, emoji: '🌿', reason: 'Fresh air and a pleasant stroll.' },
      { name: 'Cycling', type: 'outdoor' as const, emoji: '🚴', reason: 'Cool and comfortable for a bike ride.' },
      { name: 'Outdoor brunch', type: 'outdoor' as const, emoji: '🥐', reason: 'Nice weather to eat outside.' },
      { name: 'Visit a bookstore', type: 'indoor' as const, emoji: '📚', reason: 'Browse books in a cozy space.' },
      { name: 'Photography walk', type: 'outdoor' as const, emoji: '📷', reason: 'Overcast light is great for photos.' },
    ];
  }

  return [
    { name: 'Coffee shop visit', type: 'indoor' as const, emoji: '☕', reason: 'Warm up with a hot drink.' },
    { name: 'Quick outdoor walk', type: 'outdoor' as const, emoji: '🚶', reason: 'Bundle up and get some fresh air.' },
    { name: 'Indoor gym', type: 'indoor' as const, emoji: '🏋️', reason: 'Stay active without braving the cold too long.' },
    { name: 'Museum or gallery', type: 'indoor' as const, emoji: '🏛️', reason: 'Explore indoors and stay warm.' },
  ];
}

function getDailySummary(temp: number, condition: string, feelsLike: number): string {
  const feel = feelsLike < temp - 3 ? ` but feels like ${feelsLike}°C` : '';
  const conditionMap: Record<string, string> = {
    Clear: 'Clear skies today',
    Clouds: 'Cloudy skies today',
    Rain: 'Rainy day ahead',
    Drizzle: 'Light drizzle expected',
    Snow: 'Snowy conditions today',
    Thunderstorm: 'Thunderstorms expected — stay safe indoors',
    Mist: 'Misty and low visibility',
    Fog: 'Foggy conditions today',
  };
  const base = conditionMap[condition] || 'Mixed weather today';

  if (temp < 0) return `${base}${feel} — freezing temperatures, stay warm.`;
  if (temp < 10) return `${base}${feel} — a jacket is a must.`;
  if (temp < 18) return `${base}${feel} — mild and comfortable.`;
  if (temp < 25) return `${base}${feel} — great weather to be outside.`;
  return `${base}${feel} — hot day, stay hydrated and wear sunscreen.`;
}

export async function POST(request: NextRequest) {
  const weather: WeatherData = await request.json();
  const { temperature, feelsLike, condition, humidity, windSpeed } = weather;

  const outfit = getOutfit(temperature, condition, humidity, windSpeed);
  const activities = getActivities(temperature, condition);
  const dailySummary = getDailySummary(temperature, condition, feelsLike);

  const recommendation: AIRecommendation = { outfit, activities, dailySummary };
  return NextResponse.json(recommendation);
}
