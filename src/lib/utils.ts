import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const SUSPENSION_ORDER = [
  "STOCK",
  "STREET",
  "SPORT",
  "HEIGHT_ADJUSTABLE_SPORT",
  "FULLY_CUSTOMIZABLE",
];

export const TIRE_ORDER = [
  "COMFORT_HARD",
  "COMFORT_MEDIUM",
  "COMFORT_SOFT",
  "SPORT_HARD",
  "SPORT_MEDIUM",
  "SPORT_SOFT",
  "RACING_HARD",
  "RACING_MEDIUM",
  "RACING_SOFT",
  "INTERMEDIATE",
  "WET",
  "DIRT",
  "SNOW",
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function titleCase(slug: string) {
  const words = slug.split("_");
  return words
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
    })
    .join(" ");
}
