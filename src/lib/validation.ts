export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;

/** Error templates, `{min}`/`{max}` placeholders filled at call time. */
export interface ContactMessages {
  nameRequired: string;
  nameMin: string;
  nameMax: string;
  emailRequired: string;
  emailInvalid: string;
  subjectRequired: string;
  subjectShort: string;
  subjectMax: string;
  messageRequired: string;
  messageMin: string;
  messageMax: string;
}

/** English defaults — used when no localized messages are provided. */
export const DEFAULT_CONTACT_MESSAGES: ContactMessages = {
  nameRequired: "Name is required.",
  nameMin: "Name must be at least {min} characters.",
  nameMax: "Name must be under {max} characters.",
  emailRequired: "Email is required.",
  emailInvalid: "Enter a valid email address.",
  subjectRequired: "Subject is required.",
  subjectShort: "Subject is too short.",
  subjectMax: "Subject must be under {max} characters.",
  messageRequired: "Message is required.",
  messageMin: "Message must be at least {min} characters.",
  messageMax: "Message must be under {max} characters.",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const CONTACT_LIMITS = {
  name: { min: 3, max: 100 },
  subject: { min: 3, max: 120 },
  message: { min: 10, max: 1000 },
} as const;

function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

/** Pure validation for the contact form. Returns a map of field → error. */
export function validateContact(
  data: ContactPayload,
  messages: ContactMessages = DEFAULT_CONTACT_MESSAGES,
): ContactErrors {
  const errors: ContactErrors = {};

  const name = data.name.trim();
  if (!name) errors.name = messages.nameRequired;
  else if (name.length < CONTACT_LIMITS.name.min)
    errors.name = fill(messages.nameMin, { min: CONTACT_LIMITS.name.min });
  else if (name.length > CONTACT_LIMITS.name.max)
    errors.name = fill(messages.nameMax, { max: CONTACT_LIMITS.name.max });

  const email = data.email.trim();
  if (!email) errors.email = messages.emailRequired;
  else if (!EMAIL_RE.test(email)) errors.email = messages.emailInvalid;

  const subject = data.subject.trim();
  if (!subject) errors.subject = messages.subjectRequired;
  else if (subject.length < CONTACT_LIMITS.subject.min)
    errors.subject = messages.subjectShort;
  else if (subject.length > CONTACT_LIMITS.subject.max)
    errors.subject = fill(messages.subjectMax, { max: CONTACT_LIMITS.subject.max });

  const message = data.message.trim();
  if (!message) errors.message = messages.messageRequired;
  else if (message.length < CONTACT_LIMITS.message.min)
    errors.message = fill(messages.messageMin, { min: CONTACT_LIMITS.message.min });
  else if (message.length > CONTACT_LIMITS.message.max)
    errors.message = fill(messages.messageMax, { max: CONTACT_LIMITS.message.max });

  return errors;
}

/** HTML-escape untrusted input before handing it to the mail transport. */
export function sanitize(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/`/g, "&#96;");
}

export function contactConfigReady(): boolean {
  const id = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const template = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  return Boolean(id && template && key);
}
