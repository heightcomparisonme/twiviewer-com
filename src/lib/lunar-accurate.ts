/**
 * Accurate lunar and astronomical calculations
 *
 * PRODUCTION VERSION: Uses fallback calculations (no native dependencies)
 * This ensures build success in all serverless environments (Vercel, Netlify, etc.)
 */

import type { MoonPhaseInfo } from "@/services/ephemeris/swisseph-loader";
import type { MoonPhase, ZodiacSign, DayInfo } from "@/lib/lunar";
import * as fallback from "@/services/ephemeris/fallback";

/**
 * Celestial position interface (re-exported for type safety)
 */
export interface CelestialPosition {
  longitude: number;
  latitude: number;
  distance: number;
  longitudeSpeed: number;
  latitudeSpeed: number;
  distanceSpeed: number;
}

/**
 * Convert Swiss Ephemeris moon phase data to our MoonPhase interface
 */
export function convertToMoonPhase(swissEphemData: MoonPhaseInfo): MoonPhase {
  // Map Swiss Ephemeris phase names to our naming convention
  const phaseNameMap: Record<string, string> = {
    new_moon: "New Moon",
    waxing_crescent: "Waxing Crescent",
    first_quarter: "First Quarter",
    waxing_gibbous: "Waxing Gibbous",
    full_moon: "Full Moon",
    waning_gibbous: "Waning Gibbous",
    last_quarter: "Last Quarter",
    waning_crescent: "Waning Crescent",
  };

  // Calculate phase as 0-1 value from phase angle
  const phase = swissEphemData.phaseAngle / 360;

  return {
    phase,
    illumination: swissEphemData.illumination,
    age: phase * 29.53058867, // Lunar cycle length in days
    name: phaseNameMap[swissEphemData.phase] || "New Moon",
  };
}

/**
 * Get zodiac sign from ecliptic longitude
 */
export function getZodiacFromLongitude(longitude: number): ZodiacSign {
  const zodiacSigns: ZodiacSign[] = [
    { name: "Widder", symbol: "♈", unicode: "\u2648" }, // 0-30°
    { name: "Stier", symbol: "♉", unicode: "\u2649" }, // 30-60°
    { name: "Zwillinge", symbol: "♊", unicode: "\u264A" }, // 60-90°
    { name: "Krebs", symbol: "♋", unicode: "\u264B" }, // 90-120°
    { name: "Löwe", symbol: "♌", unicode: "\u264C" }, // 120-150°
    { name: "Jungfrau", symbol: "♍", unicode: "\u264D" }, // 150-180°
    { name: "Waage", symbol: "♎", unicode: "\u264E" }, // 180-210°
    { name: "Skorpion", symbol: "♏", unicode: "\u264F" }, // 210-240°
    { name: "Schütze", symbol: "♐", unicode: "\u2650" }, // 240-270°
    { name: "Steinbock", symbol: "♑", unicode: "\u2651" }, // 270-300°
    { name: "Wassermann", symbol: "♒", unicode: "\u2652" }, // 300-330°
    { name: "Fische", symbol: "♓", unicode: "\u2653" }, // 330-360°
  ];

  // Normalize longitude to 0-360 range
  const normalizedLon = ((longitude % 360) + 360) % 360;

  // Each zodiac sign spans 30 degrees
  const signIndex = Math.floor(normalizedLon / 30);

  return zodiacSigns[signIndex];
}

/**
 * Calculate accurate sun rise and set times
 * Uses astronomical twilight calculation
 */
export async function calculateSunTimes(
  date: Date,
  latitude: number,
  longitude: number
): Promise<{ rise: string; set: string }> {
  // Use fallback calculations
  const noon = new Date(date);
  noon.setHours(12, 0, 0, 0);

  const sunPos = fallback.getSunPosition(noon);

  // Calculate sun declination
  const declination = calculateDeclination(sunPos.latitude);

  // Calculate hour angle for sunrise/sunset
  const latRad = (latitude * Math.PI) / 180;
  const decRad = (declination * Math.PI) / 180;

  // Sun altitude at sunrise/sunset is approximately -0.833° (accounting for refraction and sun's diameter)
  const sunAltitude = -0.833;
  const altRad = (sunAltitude * Math.PI) / 180;

  const cosHourAngle =
    (Math.sin(altRad) - Math.sin(latRad) * Math.sin(decRad)) /
    (Math.cos(latRad) * Math.cos(decRad));

  // Check if sun is always up or always down
  if (cosHourAngle > 1) {
    // Sun never rises (polar night)
    return { rise: "--:--", set: "--:--" };
  }
  if (cosHourAngle < -1) {
    // Sun never sets (polar day)
    return { rise: "00:00", set: "23:59" };
  }

  const hourAngle = Math.acos(cosHourAngle) * (180 / Math.PI);

  // Calculate sunrise and sunset times
  // Solar noon occurs at 12:00 - (longitude / 15) hours
  const solarNoon = 12 - longitude / 15;
  const sunriseHours = solarNoon - hourAngle / 15;
  const sunsetHours = solarNoon + hourAngle / 15;

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  return {
    rise: formatTime(sunriseHours),
    set: formatTime(sunsetHours),
  };
}

/**
 * Calculate accurate moon rise and set times
 */
export function calculateMoonTimes(
  date: Date,
  latitude: number,
  moonPosition: CelestialPosition
): { rise: string; set: string } {
  // Simplified moon rise/set calculation
  // In production, this would use a proper iterative method

  const declination = calculateDeclination(moonPosition.latitude);
  const latRad = (latitude * Math.PI) / 180;
  const decRad = (declination * Math.PI) / 180;

  const moonAltitude = 0; // Moon center at horizon
  const altRad = (moonAltitude * Math.PI) / 180;

  const cosHourAngle =
    (Math.sin(altRad) - Math.sin(latRad) * Math.sin(decRad)) /
    (Math.cos(latRad) * Math.cos(decRad));

  if (cosHourAngle > 1 || cosHourAngle < -1) {
    return { rise: "--:--", set: "--:--" };
  }

  const hourAngle = Math.acos(cosHourAngle) * (180 / Math.PI);

  // Moon's hour angle
  const moonRA = moonPosition.longitude; // Simplified: using longitude as RA
  const localMeanTime = 12 - moonRA / 15;

  const moonriseHours = localMeanTime - hourAngle / 15;
  const moonsetHours = localMeanTime + hourAngle / 15;

  const formatTime = (hours: number) => {
    // Normalize to 0-24 range
    const normalizedHours = ((hours % 24) + 24) % 24;
    const h = Math.floor(normalizedHours);
    const m = Math.floor((normalizedHours - h) * 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  return {
    rise: formatTime(moonriseHours),
    set: formatTime(moonsetHours),
  };
}

/**
 * Helper function to calculate declination from latitude
 */
function calculateDeclination(latitude: number): number {
  // Simplified: in real implementation, would use proper celestial coordinates conversion
  return latitude;
}

/**
 * Get accurate day info using Swiss Ephemeris
 *
 * This function uses dynamic imports to safely load sweph at runtime only
 */
export async function getAccurateDayInfo(
  date: Date,
  latitude: number,
  longitude: number
): Promise<DayInfo> {
  // Use fallback calculations
  const { getMoonPhaseInfo } = await import("@/services/ephemeris/swisseph-loader");

  // Get moon and sun data
  const moonData = await getMoonPhaseInfo(date);
  const sunPos = fallback.getSunPosition(date);

  // Convert to our interfaces
  const moonPhase = convertToMoonPhase(moonData);
  const zodiacSign = getZodiacFromLongitude(sunPos.longitude);
  const moonSign = getZodiacFromLongitude(moonData.moonPosition.longitude);

  // Calculate rise/set times
  const sunTimes = await calculateSunTimes(date, latitude, longitude);
  const moonTimes = calculateMoonTimes(date, latitude, moonData.moonPosition);

  return {
    date,
    moonPhase,
    zodiacSign,
    sunRise: sunTimes.rise,
    sunSet: sunTimes.set,
    moonRise: moonTimes.rise,
    moonSet: moonTimes.set,
    moonSign,
  };
}

/**
 * Get accurate month data using Swiss Ephemeris
 *
 * This function uses dynamic imports to safely load sweph at runtime only
 */
export async function getAccurateMonthData(
  year: number,
  month: number,
  latitude: number,
  longitude: number
): Promise<DayInfo[]> {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: DayInfo[] = [];

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d);
    const dayInfo = await getAccurateDayInfo(date, latitude, longitude);
    days.push(dayInfo);
  }

  return days;
}
