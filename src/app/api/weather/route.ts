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

  try {
    let locationParam: string;
    let overrideName: string | null = null;

    if (q) {
      // 도시명 직접 검색
      locationParam = `q=${encodeURIComponent(q)}`;
    } else if (lat && lon) {
      // GPS 좌표 → 역지오코딩 → 공식 도시 중심 좌표로 날씨 조회
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
      );

      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (Array.isArray(geoData) && geoData.length > 0) {
          const place = geoData[0];
          // 역지오코딩이 반환한 공식 도시 중심 좌표 사용 (동명 도시 혼동 방지)
          locationParam = `lat=${place.lat}&lon=${place.lon}`;
          overrideName = place.name;   // 도시 이름은 역지오코딩 결과로 덮어씀
        } else {
          locationParam = `lat=${lat}&lon=${lon}`;
        }
      } else {
        locationParam = `lat=${lat}&lon=${lon}`;
      }
    } else {
      return NextResponse.json({ error: 'Provide lat/lon or city name' }, { status: 400 });
    }

    const [weatherRes, forecastRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?${locationParam}&appid=${apiKey}&units=metric`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?${locationParam}&appid=${apiKey}&units=metric`),
    ]);

    if (!weatherRes.ok || !forecastRes.ok) {
      const errBody = await (weatherRes.ok ? forecastRes : weatherRes).json().catch(() => ({}));
      return NextResponse.json({ error: 'Weather API error', detail: errBody }, { status: 502 });
    }

    const [weather, forecast] = await Promise.all([weatherRes.json(), forecastRes.json()]);

    // 역지오코딩에서 받은 올바른 도시명으로 덮어쓰기 (Keith → Calgary 등)
    if (overrideName) {
      weather.name = overrideName;
    }

    return NextResponse.json({ weather, forecast });

  } catch {
    return NextResponse.json({ error: 'Network error' }, { status: 500 });
  }
}

