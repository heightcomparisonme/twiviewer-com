import type { MoonPhase, MoonPhaseInfo } from "@/types/moon";
import * as fallback from "./fallback";

function getMoonPhaseInfo(date: Date): MoonPhaseInfo {
  return fallback.getMoonPhaseInfo(date);
}

function getMoonPhasesForRange(startDate: Date, endDate: Date): MoonPhaseInfo[] {
  return fallback.getMoonPhasesForRange(startDate, endDate);
}

function calculateMoonPhaseAngle(date: Date): number {
  return fallback.calculateMoonPhaseAngle(date);
}

function getMoonPhaseName(angle: number): MoonPhase {
  return fallback.getMoonPhaseName(angle);
}

function getMoonIllumination(angle: number): number {
  return fallback.getMoonIllumination(angle);
}

function getSunPosition(date: Date) {
  return fallback.getSunPosition(date);
}

function getMoonPosition(date: Date) {
  return fallback.getMoonPosition(date);
}

function findNextPhase(startDate: Date, targetPhase: MoonPhase): Date {
  return fallback.findNextPhase(startDate, targetPhase);
}

function isReady(): boolean {
  return false;
}

const swephStub = {
  getMoonPhaseInfo,
  getMoonPhasesForRange,
  calculateMoonPhaseAngle,
  getMoonPhaseName,
  getMoonIllumination,
  getSunPosition,
  getMoonPosition,
  findNextPhase,
  isReady,
};

export {
  getMoonPhaseInfo,
  getMoonPhasesForRange,
  calculateMoonPhaseAngle,
  getMoonPhaseName,
  getMoonIllumination,
  getSunPosition,
  getMoonPosition,
  findNextPhase,
  isReady,
  swephStub as sweph,
};

export default swephStub;
