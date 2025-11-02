/**
 * Ephemeris Service - Production Version
 *
 * USES ONLY FALLBACK CALCULATIONS (no native dependencies)
 * This ensures build success in all serverless environments.
 */

import type { MoonPhase, MoonPhaseInfo } from "@/types/moon";
import * as fallback from "./fallback";

/**
 * Get moon phase information
 */
export async function getMoonPhaseInfo(date: Date): Promise<MoonPhaseInfo> {
  return fallback.getMoonPhaseInfo(date);
}

/**
 * Get moon phases for a date range
 */
export async function getMoonPhasesForRange(
  startDate: Date,
  endDate: Date
): Promise<MoonPhaseInfo[]> {
  return fallback.getMoonPhasesForRange(startDate, endDate);
}

/**
 * Get Sun position
 */
export async function getSunPosition(date: Date) {
  return fallback.getSunPosition(date);
}

/**
 * Get Moon position
 */
export async function getMoonPosition(date: Date) {
  return fallback.getMoonPosition(date);
}

/**
 * Calculate moon phase angle
 */
export async function calculateMoonPhaseAngle(date: Date): Promise<number> {
  return fallback.calculateMoonPhaseAngle(date);
}

/**
 * Get moon phase name
 */
export async function getMoonPhaseName(phaseAngle: number): Promise<MoonPhase> {
  return fallback.getMoonPhaseName(phaseAngle);
}

/**
 * Get moon illumination
 */
export async function getMoonIllumination(phaseAngle: number): Promise<number> {
  return fallback.getMoonIllumination(phaseAngle);
}

/**
 * Find next moon phase
 */
export async function findNextPhase(startDate: Date, targetPhase: MoonPhase): Promise<Date> {
  return fallback.findNextPhase(startDate, targetPhase);
}

/**
 * Check if Swiss Ephemeris is available
 * Always returns false (production uses fallback only)
 */
export async function isSwissEphemerisAvailable(): Promise<boolean> {
  return false;
}

/**
 * Get service information
 */
export async function getServiceInfo() {
  return {
    swissAvailable: false,
    serviceType: "Fallback Calculations",
    precision: "Approximate (~99% accurate)",
  };
}
