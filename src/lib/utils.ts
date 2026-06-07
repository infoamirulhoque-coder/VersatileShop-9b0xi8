import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return `৳${amount.toLocaleString('bn-BD')}`;
}

export function formatPriceEn(amount: number): string {
  return `৳${amount.toLocaleString()}`;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('bn-BD', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function formatDateEn(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}
