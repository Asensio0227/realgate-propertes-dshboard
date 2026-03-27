// ─── Auth validators ──────────────────────────────────────────────────────────

export function validateEmail(email: string): string | null {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email address';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
}

export function validateSignup(data: {
  name?: string;
  email?: string;
  password?: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.name || data.name.trim().length < 2)
    errors.name = 'Name must be at least 2 characters';
  const emailErr = validateEmail(data.email ?? '');
  if (emailErr) errors.email = emailErr;
  const pwErr = validatePassword(data.password ?? '');
  if (pwErr) errors.password = pwErr;
  return errors;
}

// ─── Property validator ───────────────────────────────────────────────────────

const PROPERTY_TYPES = ['rent', 'sale'] as const;
const PROPERTY_CATEGORIES = [
  'house',
  'apartment',
  'commercial',
  'stands',
] as const;

export function validateProperty(
  data: Record<string, unknown>,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.title || String(data.title).trim().length < 2)
    errors.title = 'Title is required';

  if (!PROPERTY_TYPES.includes(data.type as (typeof PROPERTY_TYPES)[number]))
    errors.type = 'Type must be rent or sale';

  if (
    !PROPERTY_CATEGORIES.includes(
      data.category as (typeof PROPERTY_CATEGORIES)[number],
    )
  )
    errors.category =
      'Category must be house, apartment, commercial, or stands';

  if (!data.location || String(data.location).trim().length < 2)
    errors.location = 'Location is required';

  if (data.price !== undefined && data.price !== null && data.price !== '') {
    if (isNaN(Number(data.price)) || Number(data.price) < 0)
      errors.price = 'Price must be a positive number';
  }

  return errors;
}

// ─── Lead validator ───────────────────────────────────────────────────────────

const LEAD_SOURCES = ['chatbot', 'website', 'ads'] as const;
const LEAD_STATUSES = ['new', 'contacted', 'closed'] as const;
const LEAD_PRIORITIES = ['low', 'medium', 'high'] as const;
const LEAD_TYPES = ['rent', 'buy'] as const;

export function validateLead(
  data: Record<string, unknown>,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.name || String(data.name).trim().length < 2)
    errors.name = 'Name must be at least 2 characters';

  if (!data.phone || String(data.phone).trim().length < 5)
    errors.phone = 'A valid phone number is required';

  if (!data.agency) errors.agency = 'Agency is required';

  if (
    data.source &&
    !LEAD_SOURCES.includes(data.source as (typeof LEAD_SOURCES)[number])
  )
    errors.source = 'Source must be chatbot, website, or ads';

  if (
    data.status &&
    !LEAD_STATUSES.includes(data.status as (typeof LEAD_STATUSES)[number])
  )
    errors.status = 'Status must be new, contacted, or closed';

  if (
    data.priority &&
    !LEAD_PRIORITIES.includes(data.priority as (typeof LEAD_PRIORITIES)[number])
  )
    errors.priority = 'Priority must be low, medium, or high';

  if (
    data.type &&
    !LEAD_TYPES.includes(data.type as (typeof LEAD_TYPES)[number])
  )
    errors.type = 'Type must be rent or buy';

  if (data.budget !== undefined && data.budget !== null && data.budget !== '') {
    if (isNaN(Number(data.budget)) || Number(data.budget) < 0)
      errors.budget = 'Budget must be a positive number';
  }

  return errors;
}
