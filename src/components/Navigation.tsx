'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Shirt, Zap, Calendar, Clock, Wind, Settings } from 'lucide-react';
import clsx from 'clsx';

const tabs = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/hourly', icon: Clock, label: 'Hourly' },
  { href: '/weekly', icon: Calendar, label: 'Weekly' },
  { href: '/airquality', icon: Wind, label: 'Air' },
  { href: '/outfit', icon: Shirt, label: 'Outfit' },
  { href: '/activities', icon: Zap, label: 'Activities' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-black/50 backdrop-blur-2xl border-t border-white/10">
        {/* 
          모바일: max-w-lg 제한 + overflow-x-auto 스크롤 가능, 각 탭 shrink-0 + min-w
          웹(md+): 전체 너비 사용, 탭 균등 분배 (flex-1), 탭 높이 및 아이콘 크기 확대
        */}
        <div className="flex overflow-x-auto scrollbar-none md:overflow-x-visible max-w-lg md:max-w-none mx-auto">
          {tabs.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex flex-col items-center gap-1 transition-all duration-200 relative',
                  // 모바일: 기존 스타일 유지
                  'shrink-0 py-2.5 px-3',
                  // 웹(md+): flex-1로 균등 배분, 탭 높이 확대
                  'md:flex-1 md:shrink md:py-4 md:px-2'
                )}
                style={{ minWidth: '4rem' }}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white rounded-full" />
                )}
                <span className={clsx(
                  'flex items-center justify-center rounded-xl transition-all duration-200',
                  // 모바일: 기존 사이즈
                  'w-9 h-9',
                  // 웹: 아이콘 영역 약간 확대
                  'md:w-11 md:h-11',
                  isActive ? 'bg-white/15' : 'bg-transparent'
                )}>
                  <Icon
                    className={clsx(
                      // 모바일: 18px, 웹: 22px
                      'w-[18px] h-[18px] md:w-[22px] md:h-[22px]',
                      isActive ? 'text-white' : 'text-white/40'
                    )}
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                </span>
                <span className={clsx(
                  'font-medium transition-all duration-200',
                  // 모바일: text-xs, 웹: text-sm
                  'text-xs md:text-sm',
                  isActive ? 'text-white' : 'text-white/30'
                )}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
