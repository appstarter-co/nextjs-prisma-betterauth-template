import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(str: String) {
  if (typeof str !== 'string' || str.length === 0) {
    return str; // Handle empty or non-string inputs
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}