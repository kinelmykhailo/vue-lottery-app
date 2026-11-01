
export const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const PHONE_REGEXP = /^\+380\d{9}$/

export function isRequired(value: string): boolean {
  return value.trim().length > 0
}

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEXP.test(value.trim())
}

export function isValidPhone(value: string): boolean {
  return PHONE_REGEXP.test(value.trim())
}

export function isValidBirthDate(value: string): boolean {
  if (!value) return false
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)

  return date.getTime() < today.getTime()
}

export function isSameEmail(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase()
}
