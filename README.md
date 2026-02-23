# 🌤️ WeatherFit

> **Weather-based outfit & activity recommendations**

WeatherFit is a mobile-first web app that suggests what to wear and what to do based on your current local weather. Built with Next.js and powered by OpenWeather API.

🔗 **Live Demo**: [weather-fit-eta.vercel.app](https://weather-fit-eta.vercel.app)

---

## ✨ Features

- 📍 **Auto Location** — Detects your current location via GPS
- 🔍 **City Search** — Search any city worldwide
- 🔖 **Save Cities** — Bookmark your favorite cities for quick access
- 👕 **Outfit Recommendations** — Get dressed right for the weather
- 🎯 **Activity Suggestions** — Indoor & outdoor activity ideas
- 📅 **Weekly Forecast** — 7-day temperature & rain overview
- 🕐 **Hourly Forecast** — Next 24-hour weather timeline
- 💨 **Air Quality** — Real-time AQI and pollutant data
- 🌡️ **Unit Toggle** — Switch between °C and °F
- 🎨 **Dynamic Themes** — Background changes based on weather condition

---

## 🛠️ Tech Stack

| Category | Tech |
|---|---|
| Framework | [Next.js 14](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Icons | [Lucide React](https://lucide.dev) |
| Weather Data | [OpenWeather API](https://openweathermap.org/api) |
| Deployment | [Vercel](https://vercel.com) |

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/mnigaon/WeatherFit.git
cd WeatherFit
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
OPENWEATHER_API_KEY=your_openweather_api_key
```

Get your free API key at [openweathermap.org](https://openweathermap.org/api).

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── weather/        # Weather data API route
│   │   ├── airquality/     # Air quality API route
│   │   └── recommend/      # Outfit & activity logic
│   ├── activities/         # Activities page
│   ├── airquality/         # Air quality page
│   ├── hourly/             # Hourly forecast page
│   ├── outfit/             # Outfit recommendation page
│   ├── settings/           # Settings page
│   ├── weekly/             # Weekly forecast page
│   ├── layout.tsx          # Root layout & metadata
│   └── page.tsx            # Home page
├── components/
│   └── Navigation.tsx      # Bottom tab navigation
├── lib/
│   └── utils.ts            # Temperature conversion utilities
├── providers/
│   └── WeatherProvider.tsx # Global weather state (Context)
└── types/
    └── index.ts            # TypeScript type definitions
```

---

## 🌍 Deployment

This project is deployed on **Vercel**. To deploy your own:

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add the following Environment Variables in Vercel:
   - `OPENWEATHER_API_KEY`
4. Deploy!

---

## 📄 License

MIT License — feel free to use and modify.
