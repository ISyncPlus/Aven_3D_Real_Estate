export type Enquiry = { name: string; email: string; date: string; residence: string | null };
export function validateEnquiry(input: unknown, today: string): Enquiry | string {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return 'Please check your viewing details.';
  const fields = input as Record<string, unknown>;
  if (typeof fields.name !== 'string' || !fields.name.trim() || fields.name.length > 100) return 'Please enter your full name.';
  if (typeof fields.email !== 'string' || fields.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) return 'Please enter a valid email address.';
  if (typeof fields.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fields.date) || !Number.isFinite(Date.parse(fields.date)) || new Date(fields.date).toISOString().slice(0, 10) !== fields.date || fields.date < today) return 'Please choose a viewing date from today onwards.';
  if (fields.residence !== null && fields.residence !== undefined && (typeof fields.residence !== 'string' || !/^[1-8][A-D]$/.test(fields.residence))) return 'Please select a valid residence.';
  return { name: fields.name.trim(), email: fields.email.trim(), date: fields.date, residence: typeof fields.residence === 'string' ? fields.residence : null };
}
export function lagosToday() { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Lagos', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
