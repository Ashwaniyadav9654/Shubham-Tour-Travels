import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export const WHATSAPP_NUMBER = '918595820300'
export const PHONE_NUMBER = '+91 85958 20300'
export const PHONE_HREF = 'tel:+918595820300'
export const EMAIL = 'contact@shubhamtourtravels.in'

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function whatsappBookingLink(service: string, details?: string): string {
  const msg = `Hello Shubham Tour & Travels! I'd like to enquire about: *${service}*${details ? `\n\nDetails: ${details}` : ''}\n\nPlease share availability and pricing.`
  return whatsappLink(msg)
}
