// Moon Sign Calculator Logic

export interface BirthData {
    day: number;
    month: number;
    year: number;
    hour?: number;
    minute?: number;
    timezone: string;
  }
  
  export interface MoonSignResult {
    sign: string;
    degree: number;
    description: string;
    element: string;
    quality: string;
  }
  
  const ZODIAC_SIGNS = [
    { name: "Aries", symbol: "♈", element: "Fire", quality: "Cardinal" },
    { name: "Taurus", symbol: "♉", element: "Earth", quality: "Fixed" },
    { name: "Gemini", symbol: "♊", element: "Air", quality: "Mutable" },
    { name: "Cancer", symbol: "♋", element: "Water", quality: "Cardinal" },
    { name: "Leo", symbol: "♌", element: "Fire", quality: "Fixed" },
    { name: "Virgo", symbol: "♍", element: "Earth", quality: "Mutable" },
    { name: "Libra", symbol: "♎", element: "Air", quality: "Cardinal" },
    { name: "Scorpio", symbol: "♏", element: "Water", quality: "Fixed" },
    { name: "Sagittarius", symbol: "♐", element: "Fire", quality: "Mutable" },
    { name: "Capricorn", symbol: "♑", element: "Earth", quality: "Cardinal" },
    { name: "Aquarius", symbol: "♒", element: "Air", quality: "Fixed" },
    { name: "Pisces", symbol: "♓", element: "Water", quality: "Mutable" }
  ];
  
  const SIGN_DESCRIPTIONS = {
    Aries: "Your emotions are direct, spontaneous, and passionate. You react quickly and need to take action when feelings arise.",
    Taurus: "Your emotions are stable, grounded, and sensual. You need security and comfort to feel emotionally satisfied.",
    Gemini: "Your emotions are curious, communicative, and changeable. You need mental stimulation and variety in your emotional life.",
    Cancer: "Your emotions are deep, nurturing, and protective. You are highly intuitive and sensitive to others' feelings.",
    Leo: "Your emotions are warm, dramatic, and generous. You need appreciation and recognition to feel emotionally fulfilled.",
    Virgo: "Your emotions are analytical, practical, and helpful. You express care through service and attention to detail.",
    Libra: "Your emotions seek harmony, balance, and partnership. You need fair relationships and aesthetic beauty.",
    Scorpio: "Your emotions are intense, passionate, and transformative. You feel things deeply and seek emotional truth.",
    Sagittarius: "Your emotions are optimistic, adventurous, and philosophical. You need freedom and growth in emotional expression.",
    Capricorn: "Your emotions are controlled, responsible, and ambitious. You take a practical approach to feelings and relationships.",
    Aquarius: "Your emotions are independent, humanitarian, and unconventional. You need intellectual connection and freedom.",
    Pisces: "Your emotions are compassionate, intuitive, and dreamy. You are deeply empathetic and spiritually connected."
  };
  
  // Simplified moon position calculation
  // This uses an approximation algorithm based on astronomical formulas
  export function calculateMoonSign(birthData: BirthData): MoonSignResult {
    const { day, month, year, hour = 12, minute = 0, timezone } = birthData;
  
    // Calculate Julian Day Number
    const jdn = getJulianDayNumber(year, month, day, hour, minute);
  
    // Calculate moon's longitude (simplified algorithm)
    const moonLongitude = calculateMoonLongitude(jdn);
  
    // Determine zodiac sign (0-360 degrees divided into 12 signs of 30 degrees each)
    const signIndex = Math.floor(moonLongitude / 30) % 12;
    const degreeInSign = moonLongitude % 30;
  
    const sign = ZODIAC_SIGNS[signIndex];
  
    return {
      sign: `${sign.name} ${sign.symbol}`,
      degree: Math.round(degreeInSign * 10) / 10,
      description: SIGN_DESCRIPTIONS[sign.name as keyof typeof SIGN_DESCRIPTIONS],
      element: sign.element,
      quality: sign.quality
    };
  }
  
  function getJulianDayNumber(year: number, month: number, day: number, hour: number, minute: number): number {
    // Adjust for time
    const decimalDay = day + (hour + minute / 60) / 24;
  
    // Adjust month and year for calculation
    let y = year;
    let m = month;
  
    if (month <= 2) {
      y -= 1;
      m += 12;
    }
  
    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);
  
    const jdn = Math.floor(365.25 * (y + 4716)) +
                Math.floor(30.6001 * (m + 1)) +
                decimalDay + b - 1524.5;
  
    return jdn;
  }
  
  function calculateMoonLongitude(jdn: number): number {
    // T is the time in Julian centuries from J2000.0
    const T = (jdn - 2451545.0) / 36525;
  
    // Moon's mean longitude
    const L0 = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  
    // Moon's mean elongation
    const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T;
  
    // Sun's mean anomaly
    const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T;
  
    // Moon's mean anomaly
    const M1 = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;
  
    // Moon's argument of latitude
    const F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T;
  
    // Calculate perturbations (simplified - using main terms)
    let longitude = L0;
  
    // Main periodic terms (simplified)
    longitude += 6.288774 * Math.sin(toRadians(M1));
    longitude += 1.274027 * Math.sin(toRadians(2 * D - M1));
    longitude += 0.658314 * Math.sin(toRadians(2 * D));
    longitude += 0.213618 * Math.sin(toRadians(2 * M1));
    longitude -= 0.185116 * Math.sin(toRadians(M));
    longitude -= 0.114332 * Math.sin(toRadians(2 * F));
  
    // Normalize to 0-360 degrees
    longitude = longitude % 360;
    if (longitude < 0) longitude += 360;
  
    return longitude;
  }
  
  function toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
  }
  
  export function getTimezones(): { value: string; label: string }[] {
    return [
      { value: "UTC-12", label: "(GMT-12:00) International Date Line West" },
      { value: "UTC-11", label: "(GMT-11:00) Midway Island, Samoa" },
      { value: "UTC-10", label: "(GMT-10:00) Hawaii" },
      { value: "UTC-9", label: "(GMT-09:00) Alaska" },
      { value: "UTC-8", label: "(GMT-08:00) Pacific Time (US & Canada)" },
      { value: "UTC-7", label: "(GMT-07:00) Mountain Time (US & Canada)" },
      { value: "UTC-6", label: "(GMT-06:00) Central Time (US & Canada)" },
      { value: "UTC-5", label: "(GMT-05:00) Eastern Time (US & Canada)" },
      { value: "UTC-4", label: "(GMT-04:00) Atlantic Time (Canada)" },
      { value: "UTC-3", label: "(GMT-03:00) Buenos Aires, Georgetown" },
      { value: "UTC-2", label: "(GMT-02:00) Mid-Atlantic" },
      { value: "UTC-1", label: "(GMT-01:00) Azores, Cape Verde Islands" },
      { value: "UTC+0", label: "(GMT+00:00) London, Dublin, Lisbon" },
      { value: "UTC+1", label: "(GMT+01:00) Amsterdam, Berlin, Rome, Vienna" },
      { value: "UTC+2", label: "(GMT+02:00) Athens, Cairo, Jerusalem" },
      { value: "UTC+3", label: "(GMT+03:00) Moscow, Kuwait, Riyadh" },
      { value: "UTC+4", label: "(GMT+04:00) Abu Dhabi, Muscat, Baku" },
      { value: "UTC+5", label: "(GMT+05:00) Islamabad, Karachi, Tashkent" },
      { value: "UTC+5.5", label: "(GMT+05:30) Mumbai, Kolkata, New Delhi" },
      { value: "UTC+6", label: "(GMT+06:00) Almaty, Dhaka" },
      { value: "UTC+7", label: "(GMT+07:00) Bangkok, Hanoi, Jakarta" },
      { value: "UTC+8", label: "(GMT+08:00) Beijing, Singapore, Hong Kong" },
      { value: "UTC+9", label: "(GMT+09:00) Tokyo, Seoul, Osaka" },
      { value: "UTC+10", label: "(GMT+10:00) Sydney, Melbourne, Guam" },
      { value: "UTC+11", label: "(GMT+11:00) Magadan, Solomon Islands" },
      { value: "UTC+12", label: "(GMT+12:00) Auckland, Wellington, Fiji" }
    ];
  }
  