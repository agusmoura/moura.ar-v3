import type { APIRoute } from 'astro';
import {
  UTMParamsSchema,
  N8NPayloadSchema,
  validateContactForm,
  validateHoneypot,
  SPAM_KEYWORDS,
  type ContactFormData,
  type N8NPayload,
} from '@/schemas/contact';
import { createContactJWT } from '@/utils/jwt';
import {
  contactFormRateLimiter,
  getClientIP,
  createRateLimitHeaders,
  sanitizeForJSON,
  containsSpamKeywords,
  validateOrigin,
  createSecureResponse,
} from '@/utils/security';

/**
 * Extract and validate form data from FormData
 */
function extractFormData(formData: FormData): ContactFormData {
  const projectTypes: string[] = [];
  const checkedTypes = formData.getAll('project-type');
  
  checkedTypes.forEach((type) => {
    if (typeof type === 'string' && type.trim()) {
      projectTypes.push(type.trim());
    }
  });

  return {
    name: (formData.get('name') as string)?.trim() || '',
    email: (formData.get('email') as string)?.trim() || '',
    message: (formData.get('message') as string)?.trim() || '',
    projectType: projectTypes,
    budget: (formData.get('budget') as string)?.trim() || undefined,
  };
}

/**
 * Extract UTM parameters from request and form data
 */
function extractUTMParams(request: Request, formData: FormData): Record<string, string> {
  const url = new URL(request.url);
  const utmParams: Record<string, string> = {};
  
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id'];
  
  utmKeys.forEach((key) => {
    // Try form data first (hidden fields)
    let value = formData.get(key) as string;
    
    // Fallback to URL parameters
    if (!value) {
      value = url.searchParams.get(key) || '';
    }
    
    if (value && value.trim()) {
      utmParams[key] = sanitizeForJSON(value.trim());
    }
  });
  
  // Add referrer if available
  const referrer = request.headers.get('referer');
  if (referrer) {
    utmParams.referrer = sanitizeForJSON(referrer);
  }
  
  return utmParams;
}

/**
 * Check for bot activity using honeypot fields
 */
function detectBot(formData: FormData): boolean {
  const honeypotData = {
    website: (formData.get('website') as string) || '',
    email_confirm: (formData.get('email_confirm') as string) || '',
    phone: (formData.get('phone') as string) || '',
    url: (formData.get('url') as string) || '',
    company: (formData.get('company') as string) || '',
  };
  
  const validation = validateHoneypot(honeypotData);
  return !validation.success;
}

/**
 * Advanced spam detection
 */
function detectSpam(formData: ContactFormData): boolean {
  // Check for spam keywords
  if (containsSpamKeywords(formData.message, SPAM_KEYWORDS)) {
    return true;
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /http[s]?:\/\//gi, // URLs in message
    /\b[A-Z]{10,}\b/g, // Long uppercase words
    /(.)\1{10,}/g, // Repeated characters
    /\b\d{4}-\d{4}-\d{4}-\d{4}\b/g, // Credit card patterns
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(formData.message));
}

/**
 * Send data to N8N webhook
 */
async function sendToN8N(
  formData: ContactFormData,
  utmData: Record<string, string>,
  request: Request
): Promise<{ success: boolean; error?: string }> {
  try {
    const webhookUrl = import.meta.env.N8N_WEBHOOK_URL;
    
    if (!webhookUrl) {
      throw new Error('N8N_WEBHOOK_URL not configured');
    }
    
    // Prepare N8N payload
    const payload: N8NPayload = {
      name: sanitizeForJSON(formData.name),
      email: sanitizeForJSON(formData.email),
      message: sanitizeForJSON(formData.message),
      projectType: formData.projectType.join(', '), // Convert array to string
      budget: formData.budget ? sanitizeForJSON(formData.budget) : undefined,
      utm: UTMParamsSchema.parse(utmData),
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'moura.ar',
        userAgent: sanitizeForJSON(request.headers.get('user-agent') || 'unknown'),
        ip: sanitizeForJSON(getClientIP(request)),
        origin: sanitizeForJSON(request.headers.get('origin') || 'unknown'),
      },
    };
    
    // Validate payload
    const validatedPayload = N8NPayloadSchema.parse(payload);
    
    // Create JWT token
    const token = createContactJWT();
    
    // Send to N8N
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'moura.ar-contact-form/2.0',
      },
      body: JSON.stringify(validatedPayload),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`N8N webhook failed: ${response.status} - ${errorText}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending to N8N:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Main POST handler
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    // Validate origin
    if (!validateOrigin(request)) {
      return createSecureResponse(
        JSON.stringify({ success: false, error: 'Invalid origin' }),
        403
      );
    }
    
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = contactFormRateLimiter.isAllowed(clientIP);
    
    if (!rateLimitResult.allowed) {
      return createSecureResponse(
        JSON.stringify({
          success: false,
          error: 'Too many requests. Please try again later.',
        }),
        429,
        createRateLimitHeaders(contactFormRateLimiter.getStatus(clientIP))
      );
    }
    
    // Parse form data
    const formData = await request.formData();
    
    // Bot detection - return fake success to confuse bots
    if (detectBot(formData)) {
      return createSecureResponse(
        JSON.stringify({
          success: true,
          message: 'Mensaje enviado correctamente. Te responderemos en menos de 24 horas.',
        }),
        200,
        createRateLimitHeaders(contactFormRateLimiter.getStatus(clientIP))
      );
    }
    
    // Extract and validate form data
    const extractedData = extractFormData(formData);
    const validation = validateContactForm(extractedData);
    
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((error) => {
        if (error.path.length > 0) {
          errors[error.path[0]] = error.message;
        }
      });
      
      return createSecureResponse(
        JSON.stringify({
          success: false,
          errors,
          message: 'Por favor, corregí los errores en el formulario.',
        }),
        400,
        createRateLimitHeaders(contactFormRateLimiter.getStatus(clientIP))
      );
    }
    
    // Additional spam detection
    if (detectSpam(validation.data)) {
      // Log spam attempt but return success to not reveal detection
      console.warn('Spam detected from IP:', clientIP, 'Data:', validation.data);
      
      return createSecureResponse(
        JSON.stringify({
          success: true,
          message: 'Mensaje enviado correctamente. Te responderemos en menos de 24 horas.',
        }),
        200,
        createRateLimitHeaders(contactFormRateLimiter.getStatus(clientIP))
      );
    }
    
    // Extract UTM parameters
    const utmData = extractUTMParams(request, formData);
    
    // Send to N8N
    const result = await sendToN8N(validation.data, utmData, request);
    
    if (!result.success) {
      console.error('N8N submission failed:', result.error);
      
      return createSecureResponse(
        JSON.stringify({
          success: false,
          error: 'Error interno del servidor. Por favor, intentá nuevamente.',
        }),
        500,
        createRateLimitHeaders(contactFormRateLimiter.getStatus(clientIP))
      );
    }
    
    // Success response
    return createSecureResponse(
      JSON.stringify({
        success: true,
        message: 'Mensaje enviado correctamente. Te responderemos en menos de 24 horas.',
      }),
      200,
      createRateLimitHeaders(contactFormRateLimiter.getStatus(clientIP))
    );
    
  } catch (error) {
    console.error('Contact form error:', error);
    
    // Don't reveal internal errors to clients
    return createSecureResponse(
      JSON.stringify({
        success: false,
        error: 'Error interno del servidor. Por favor, intentá nuevamente.',
      }),
      500
    );
  }
};

/**
 * Handle other HTTP methods
 */
export const GET: APIRoute = () => {
  return createSecureResponse(
    JSON.stringify({
      error: 'Método no permitido. Solo se permiten requests POST.',
    }),
    405,
    { Allow: 'POST' }
  );
};

// Export other methods with same handler
export const PUT = GET;
export const DELETE = GET;
export const PATCH = GET;