export function formatTemp(celsius: number, unit: 'C' | 'F'): string {
  if (unit === 'F') return `${Math.round(celsius * 9 / 5 + 32)}°F`;
  return `${celsius}°C`;
}

export function formatTempValue(celsius: number, unit: 'C' | 'F'): number {
  if (unit === 'F') return Math.round(celsius * 9 / 5 + 32);
  return celsius;
}

export function tempUnit(unit: 'C' | 'F'): string {
  return unit === 'F' ? '°F' : '°C';
}
