import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'lat and lon are required' }, { status: 400 });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    if (!res.ok) {
      return NextResponse.json({ error: 'Air quality API error' }, { status: 502 });
    }
    const data = await res.json();
    const item = data.list[0];
    return NextResponse.json({
      aqi: item.main.aqi,
      pm25: item.components.pm2_5,
      pm10: item.components.pm10,
      no2: item.components.no2,
      o3: item.components.o3,
      co: item.components.co,
    });
  } catch {
    return NextResponse.json({ error: 'Network error' }, { status: 500 });
  }
}
