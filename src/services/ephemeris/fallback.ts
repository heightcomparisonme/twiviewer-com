/**
 * Fallback Astronomical Calculations
 * 
 * This service provides basic astronomical calculations without native dependencies.
 * Used when Swiss Ephemeris (sweph) is not available, such as in Vercel deployments.
 */

import type { MoonPhase, MoonPhaseInfo } from "@/types/moon";

/**
 * Celestial body position interface (compatible with Swiss Ephemeris)
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
 * Convert date to Julian Day Number (simplified calculation)
 */
export function dateToJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();

  // Simplified Julian Day calculation
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  // Add fractional day
  const fractionalDay = (hour + minute / 60 + second / 3600) / 24;
  
  return jdn + fractionalDay;
}

/**
 * Simplified Sun position calculation
 */
export function getSunPosition(date: Date): CelestialPosition {
  const julianDay = dateToJulianDay(date);
  
  // Simplified sun longitude calculation (approximate)
  const n = julianDay - 2451545.0;
  const L = (280.460 + 0.9856474 * n) % 360;
  const g = (357.528 + 0.9856003 * n) * Math.PI / 180;
  const lambda = L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g);
  
  return {
    longitude: lambda,
    latitude: 0, // Sun is always on the ecliptic
    distance: 1.0, // AU
    longitudeSpeed: 0.9856474, // degrees per day
    latitudeSpeed: 0,
    distanceSpeed: 0,
  };
}

/**
 * Simplified Moon position calculation
 */
export function getMoonPosition(date: Date): CelestialPosition {
  const julianDay = dateToJulianDay(date);
  
  // Simplified moon longitude calculation (approximate)
  const n = julianDay - 2451545.0;
  const L = (218.316 + 13.176396 * n) % 360;
  const M = (134.963 + 13.064993 * n) % 360;
  const F = (93.272 + 13.229350 * n) % 360;
  
  const L_rad = L * Math.PI / 180;
  const M_rad = M * Math.PI / 180;
  const F_rad = F * Math.PI / 180;
  
  // Simplified lunar longitude with main perturbations
  const lambda = L + 6.289 * Math.sin(M_rad) + 1.274 * Math.sin(2 * L_rad - M_rad) + 0.658 * Math.sin(2 * L_rad);
  
  return {
    longitude: lambda,
    latitude: 5.128 * Math.sin(F_rad), // Simplified latitude
    distance: 60.27 - 3.277 * Math.cos(M_rad), // Earth radii
    longitudeSpeed: 13.176396, // degrees per day
    latitudeSpeed: 0.111404, // degrees per day
    distanceSpeed: 0, // Simplified
  };
}

/**
 * Calculate the phase angle between Sun and Moon
 */
export function calculateMoonPhaseAngle(date: Date): number {
  const sunPos = getSunPosition(date);
  const moonPos = getMoonPosition(date);

  let phaseAngle = moonPos.longitude - sunPos.longitude;

  // Normalize to 0-360 range
  if (phaseAngle < 0) {
    phaseAngle += 360;
  }

  return phaseAngle;
}

/**
 * Get moon phase name from phase angle
 */
export function getMoonPhaseName(phaseAngle: number): MoonPhase {
  const phases = {
    NEW_MOON: "new_moon" as MoonPhase,
    WAXING_CRESCENT: "waxing_crescent" as MoonPhase,
    FIRST_QUARTER: "first_quarter" as MoonPhase,
    WAXING_GIBBOUS: "waxing_gibbous" as MoonPhase,
    FULL_MOON: "full_moon" as MoonPhase,
    WANING_GIBBOUS: "waning_gibbous" as MoonPhase,
    LAST_QUARTER: "last_quarter" as MoonPhase,
    WANING_CRESCENT: "waning_crescent" as MoonPhase,
  };

  if (phaseAngle < 22.5 || phaseAngle >= 337.5) {
    return phases.NEW_MOON;
  } else if (phaseAngle < 67.5) {
    return phases.WAXING_CRESCENT;
  } else if (phaseAngle < 112.5) {
    return phases.FIRST_QUARTER;
  } else if (phaseAngle < 157.5) {
    return phases.WAXING_GIBBOUS;
  } else if (phaseAngle < 202.5) {
    return phases.FULL_MOON;
  } else if (phaseAngle < 247.5) {
    return phases.WANING_GIBBOUS;
  } else if (phaseAngle < 292.5) {
    return phases.LAST_QUARTER;
  } else {
    return phases.WANING_CRESCENT;
  }
}

/**
 * Calculate moon illumination percentage
 */
export function getMoonIllumination(phaseAngle: number): number {
  const radians = (phaseAngle * Math.PI) / 180;
  const illumination = (1 - Math.cos(radians)) / 2;
  return Math.round(illumination * 100 * 10) / 10;
}

/**
 * Get complete moon phase information for a given date
 */
export function getMoonPhaseInfo(date: Date): MoonPhaseInfo {
  const phaseAngle = calculateMoonPhaseAngle(date);
  const phase = getMoonPhaseName(phaseAngle);
  const illumination = getMoonIllumination(phaseAngle);
  const moonPosition = getMoonPosition(date);
  const sunPosition = getSunPosition(date);
  const isWaxing = phaseAngle < 180;

  return {
    date,
    phase,
    phaseAngle,
    illumination,
    moonPosition,
    sunPosition,
    isWaxing,
  };
}

/**
 * Get moon phases for a date range
 */
export function getMoonPhasesForRange(
  startDate: Date,
  endDate: Date
): MoonPhaseInfo[] {
  const phases: MoonPhaseInfo[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    phases.push(getMoonPhaseInfo(currentDate));
    currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  }

  return phases;
}

/**
 * Find next moon phase occurrence
 */
export function findNextPhase(startDate: Date, targetPhase: MoonPhase): Date {
  let currentDate = new Date(startDate);
  const maxDays = 32;

  for (let i = 0; i < maxDays; i++) {
    const info = getMoonPhaseInfo(currentDate);
    if (info.phase === targetPhase && i > 0) {
      return currentDate;
    }
    currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  }

  throw new Error(`Could not find next ${targetPhase} within ${maxDays} days`);
}
