import { z } from 'zod';

// Base contact form schema with enhanced validation
export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre es muy largo (máximo 50 caracteres)')
    .regex(
      /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]+$/,
      'El nombre solo puede contener letras, espacios, guiones y apostrofes'
    )
    .transform((val) => val.trim()),

  email: z
    .string()
    .email('Ingresá una dirección de email válida')
    .max(254, 'El email es muy largo')
    .transform((val) => val.trim().toLowerCase()),

  message: z
    .string()
    .min(20, 'El mensaje debe tener al menos 20 caracteres')
    .max(500, 'El mensaje es muy largo (máximo 500 caracteres)')
    .transform((val) => val.trim()),

  projectType: z
    .array(z.string())
    .min(1, 'Seleccioná al menos un tipo de proyecto')
    .max(8, 'Máximo 8 tipos de proyecto'),

  // Optional budget field
  budget: z.string().optional(),
});

// UTM parameters schema
export const UTMParamsSchema = z.object({
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
  utm_id: z.string().optional(),
  referrer: z.string().optional(),
});

// Metadata schema
export const MetadataSchema = z.object({
  timestamp: z.string().datetime(),
  source: z.literal('moura.ar'),
  userAgent: z.string(),
  ip: z.string(),
  origin: z.string(),
});

// Complete N8N payload schema
export const N8NPayloadSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
  projectType: z.string(), // Comma-separated string for N8N
  budget: z.string().optional(),
  utm: UTMParamsSchema,
  metadata: MetadataSchema,
});

// JWT payload schema for N8N authentication
export const JWTPayloadSchema = z.object({
  iss: z.literal('https://moura.ar'),
  aud: z.literal('moura-contact-form-api'),
  iat: z.number(),
  exp: z.number(),
  jti: z.string().uuid(),
});

// Honeypot detection schema
export const HoneypotSchema = z.object({
  website: z.string().length(0),
  email_confirm: z.string().length(0),
  phone: z.string().length(0).optional(),
  url: z.string().length(0).optional(),
  company: z.string().length(0).optional(),
});

// API Response schemas
export const ContactSuccessResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

export const ContactErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  errors: z.record(z.string()).optional(),
});

export const ContactResponseSchema = z.union([
  ContactSuccessResponseSchema,
  ContactErrorResponseSchema,
]);

// Type exports
export type ContactFormData = z.infer<typeof ContactFormSchema>;
export type UTMParams = z.infer<typeof UTMParamsSchema>;
export type Metadata = z.infer<typeof MetadataSchema>;
export type N8NPayload = z.infer<typeof N8NPayloadSchema>;
export type JWTPayload = z.infer<typeof JWTPayloadSchema>;
export type HoneypotFields = z.infer<typeof HoneypotSchema>;
export type ContactResponse = z.infer<typeof ContactResponseSchema>;

// Validation utilities
export const validateContactForm = (data: unknown) => {
  return ContactFormSchema.safeParse(data);
};

export const validateHoneypot = (data: unknown) => {
  return HoneypotSchema.safeParse(data);
};

export const validateN8NPayload = (data: unknown) => {
  return N8NPayloadSchema.safeParse(data);
};

// Spam detection keywords
export const SPAM_KEYWORDS = [
  'bitcoin',
  'crypto',
  'investment',
  'loan',
  'viagra',
  'casino',
  'forex',
  'binary options',
  'get rich quick',
  'make money fast',
  'click here',
  'guaranteed',
  'free money',
] as const;

// Project types mapping
export const PROJECT_TYPES = {
  website: 'Sitio Web',
  'web-app': 'Web App',
  'ui-ux': 'UX/UI',
  backend: 'Backend',
  ai: 'IA/LLM',
  mobile: 'App Móvil',
  ecommerce: 'E-commerce',
  consulting: 'Consultoría',
} as const;

export type ProjectTypeKey = keyof typeof PROJECT_TYPES;
