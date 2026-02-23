import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { WeatherProvider } from '@/providers/WeatherProvider';
import Navigation from '@/components/Navigation';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: {
    default: 'WeatherFit | Weather-Based Outfit & Activity Recommendations',
    template: '%s | WeatherFit'
  },
  description: 'Get personalized outfit and activity recommendations based on your local weather. Stay prepared for your day with WeatherFit.',
  keywords: ['weather outfit', 'what to wear today', 'weather recommendations', 'outfit ideas', 'daily weather guide', 'WeatherFit', 'weather app'],
  authors: [{ name: 'WeatherFit Team' }],
  creator: 'WeatherFit Team',
  publisher: 'WeatherFit Team',
  metadataBase: new URL('https://weatherfit.example.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'WeatherFit | Weather-Based Outfit & Activity Recommendations',
    description: 'Perfect outfit and activity suggestions for any weather. Plan your perfect day with WeatherFit.',
    siteName: 'WeatherFit',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WeatherFit Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WeatherFit | Weather-Based Outfit & Activity Recommendations',
    description: 'Get personalized outfit and activity recommendations based on your local weather.',
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f172a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased min-h-screen bg-slate-900 text-white`}>
        <WeatherProvider>
          <main className="min-h-screen pb-20">
            {children}
          </main>
          <Navigation />
        </WeatherProvider>
      </body>
    </html>
  );
}
