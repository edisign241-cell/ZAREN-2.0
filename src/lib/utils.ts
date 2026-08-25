import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: string = 'XOF'): string {
  if (currency === 'XOF' || currency === 'XAF') {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      maximumFractionDigits: 0
    }).format(amount) + ' FCFA';
  }
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2
  }).format(amount);
}

export function generateShortCode(length: number = 6): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ZRN-${year}-${randomNum}`;
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

export function getHoursRemaining(targetDate: string | Date): number {
  const diff = new Date(targetDate).getTime() - new Date().getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60)));
}
