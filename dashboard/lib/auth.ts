/** When set, only this email may sign up or sign in (personal deployment). */
export function getAllowedEmail(): string | undefined {
  const email = process.env.ALLOWED_EMAIL?.trim().toLowerCase()
  return email || undefined
}

export function isEmailAllowed(email: string): boolean {
  const allowed = getAllowedEmail()
  if (!allowed) return true
  return email.trim().toLowerCase() === allowed
}
