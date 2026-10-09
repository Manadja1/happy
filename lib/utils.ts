import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind CSS collision resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a monetary amount to West African CFA Franc (XOF) format
 */
export function formatCurrency(amount: number, currency: string = "XOF"): string {
  return new Intl.NumberFormat("fr-CI", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a date to standard localized French display
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  }).format(d);
}

/**
 * Generates an URL-safe slug from a string
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}
