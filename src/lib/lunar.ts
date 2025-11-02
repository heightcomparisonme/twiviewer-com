// Lunar and astronomical calculation utilities

export interface MoonPhase {
  phase: number; // 0-1, where 0 and 1 are new moon, 0.5 is full moon
  illumination: number; // 0-100 percentage
  age: number; // days since new moon
  name: string; // New Moon, Waxing Crescent, etc.
}

export interface ZodiacSign {
  name: string;
  symbol: string;
  unicode: string;
}

export interface DayInfo {
  date: Date | string; // Can be Date object or ISO string after JSON serialization
  moonPhase: MoonPhase;
  zodiacSign: ZodiacSign;
  sunRise: string;
  sunSet: string;
  moonRise: string;
  moonSet: string;
  moonSign: ZodiacSign; // Moon's zodiac position
}

// Calculate moon phase for a given date
export function getMoonPhase(date: Date): MoonPhase {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Julian date calculation
  const jd = 367 * year - Math.floor(7 * (year + Math.floor((month + 9) / 12)) / 4) +
           Math.floor(275 * month / 9) + day + 1721013.5;

  // Days since known new moon (Jan 6, 2000)
  const daysSinceNew = jd - 2451550.1;
  const newMoons = daysSinceNew / 29.53058867;
  const phase = newMoons - Math.floor(newMoons);

  const age = phase * 29.53058867;
  const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100;

  let name = 'New Moon';
  if (phase < 0.0625) name = 'New Moon';
  else if (phase < 0.1875) name = 'Waxing Crescent';
  else if (phase < 0.3125) name = 'First Quarter';
  else if (phase < 0.4375) name = 'Waxing Gibbous';
  else if (phase < 0.5625) name = 'Full Moon';
  else if (phase < 0.6875) name = 'Waning Gibbous';
  else if (phase < 0.8125) name = 'Last Quarter';
  else if (phase < 0.9375) name = 'Waning Crescent';
  else name = 'New Moon';

  return { phase, illumination, age, name };
}

// Zodiac signs data
const zodiacSigns: ZodiacSign[] = [
  { name: 'Widder', symbol: '♈', unicode: '\u2648' }, // Aries
  { name: 'Stier', symbol: '♉', unicode: '\u2649' }, // Taurus
  { name: 'Zwillinge', symbol: '♊', unicode: '\u264A' }, // Gemini
  { name: 'Krebs', symbol: '♋', unicode: '\u264B' }, // Cancer
  { name: 'Löwe', symbol: '♌', unicode: '\u264C' }, // Leo
  { name: 'Jungfrau', symbol: '♍', unicode: '\u264D' }, // Virgo
  { name: 'Waage', symbol: '♎', unicode: '\u264E' }, // Libra
  { name: 'Skorpion', symbol: '♏', unicode: '\u264F' }, // Scorpio
  { name: 'Schütze', symbol: '♐', unicode: '\u2650' }, // Sagittarius
  { name: 'Steinbock', symbol: '♑', unicode: '\u2651' }, // Capricorn
  { name: 'Wassermann', symbol: '♒', unicode: '\u2652' }, // Aquarius
  { name: 'Fische', symbol: '♓', unicode: '\u2653' }, // Pisces
];

// Get sun's zodiac sign for a date
export function getSunZodiacSign(date: Date): ZodiacSign {
  const month = date.getMonth();
  const day = date.getDate();

  if ((month === 2 && day >= 21) || (month === 3 && day <= 19)) return zodiacSigns[0]; // Aries
  if ((month === 3 && day >= 20) || (month === 4 && day <= 20)) return zodiacSigns[1]; // Taurus
  if ((month === 4 && day >= 21) || (month === 5 && day <= 20)) return zodiacSigns[2]; // Gemini
  if ((month === 5 && day >= 21) || (month === 6 && day <= 22)) return zodiacSigns[3]; // Cancer
  if ((month === 6 && day >= 23) || (month === 7 && day <= 22)) return zodiacSigns[4]; // Leo
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacSigns[5]; // Virgo
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacSigns[6]; // Libra
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return zodiacSigns[7]; // Scorpio
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return zodiacSigns[8]; // Sagittarius
  if ((month === 11 && day >= 22) || (month === 0 && day <= 19)) return zodiacSigns[9]; // Capricorn
  if ((month === 0 && day >= 20) || (month === 1 && day <= 18)) return zodiacSigns[10]; // Aquarius
  return zodiacSigns[11]; // Pisces
}

// Get moon's zodiac position (simplified calculation)
export function getMoonZodiacSign(date: Date): ZodiacSign {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const moonCycle = (dayOfYear * 12 / 365 + date.getMonth()) % 12;
  return zodiacSigns[Math.floor(moonCycle)];
}

// Calculate sun rise/set times (simplified)
export function getSunTimes(date: Date, latitude = 50.0, longitude = 10.0): { rise: string; set: string } {
  // Simplified calculation - in production, use a proper astronomy library
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const declination = -23.45 * Math.cos(2 * Math.PI * (dayOfYear + 10) / 365);

  const hourAngle = Math.acos(-Math.tan(latitude * Math.PI / 180) * Math.tan(declination * Math.PI / 180));
  const solarNoon = 12 - longitude / 15;

  const sunrise = solarNoon - (hourAngle * 12 / Math.PI);
  const sunset = solarNoon + (hourAngle * 12 / Math.PI);

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return {
    rise: formatTime(sunrise),
    set: formatTime(sunset)
  };
}

// Calculate moon rise/set times (simplified)
export function getMoonTimes(date: Date, moonPhase: MoonPhase, latitude = 50.0): { rise: string; set: string } {
  // Simplified calculation based on moon phase
  // Moon rises ~50 minutes later each day
  const dayOfMonth = date.getDate();
  const baseRise = 6 + (moonPhase.phase * 24);
  const rise = (baseRise + (dayOfMonth * 0.83) % 24) % 24;
  const set = (rise + 12) % 24;

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return {
    rise: formatTime(rise),
    set: formatTime(set)
  };
}

// Get all info for a specific day
export function getDayInfo(date: Date): DayInfo {
  const moonPhase = getMoonPhase(date);
  const zodiacSign = getSunZodiacSign(date);
  const moonSign = getMoonZodiacSign(date);
  const sunTimes = getSunTimes(date);
  const moonTimes = getMoonTimes(date, moonPhase);

  return {
    date,
    moonPhase,
    zodiacSign,
    sunRise: sunTimes.rise,
    sunSet: sunTimes.set,
    moonRise: moonTimes.rise,
    moonSet: moonTimes.set,
    moonSign
  };
}

// Get calendar data for a specific month
export function getMonthData(year: number, month: number): DayInfo[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: DayInfo[] = [];

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d);
    days.push(getDayInfo(date));
  }

  return days;
}

export function getMonthName(month: number): string {
  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];
  return months[month];
}

export function getDayName(dayIndex: number): string {
  const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  return days[dayIndex];
}

export function getShortDayName(dayIndex: number): string {
  const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  return days[dayIndex];
}