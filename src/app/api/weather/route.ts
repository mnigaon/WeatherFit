import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const q = searchParams.get('q');

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const locationParam = q
    ? `q=${encodeURIComponent(q)}`
    : lat && lon
      ? `lat=${lat}&lon=${lon}`
      : null;

  if (!locationParam) {
    return NextResponse.json({ error: 'Provide lat/lon or city name' }, { status: 400 });
  }

  try {
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?${locationParam}&appid=${apiKey}&units=metric`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?${locationParam}&appid=${apiKey}&units=metric`),
    ]);

    if (!weatherRes.ok || !forecastRes.ok) {
      const errBody = await (weatherRes.ok ? forecastRes : weatherRes).json().catch(() => ({}));
      return NextResponse.json({ error: 'Weather API error', detail: errBody }, { status: 502 });
    }

    const [weather, forecast] = await Promise.all([weatherRes.json(), forecastRes.json()]);
    return NextResponse.json({ weather, forecast });
  } catch {
    return NextResponse.json({ error: 'Network error' }, { status: 500 });
  }
}
