import type { APIRoute } from 'astro';
import jwt from 'jsonwebtoken';

// Tipos para el formulario
interface FormFields {
  name: string;
  email: string;
  message: string;
  projectType: string;
  budget: string;
}

interface UTMData {
  [key: string]: string;
}

// Validadores básicos
const validateField = {
  name: (value: string) => {
    if (!value || value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
    if (value.length > 50) return 'El nombre es muy largo (máximo 50 caracteres)';
    if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]+$/.test(value.trim())) {
      return 'El nombre solo puede contener letras, espacios, guiones y apostrofes';
    }
    return null;
  },
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) return 'Ingresá una dirección de email válida';
    if (value.length > 254) return 'El email es muy largo';
    return null;
  },
  message: (value: string) => {
    if (!value || value.trim().length < 20) {
      return `El mensaje debe tener al menos 20 caracteres (${value?.trim().length || 0}/20)`;
    }
    if (value.length > 500) return 'El mensaje es muy largo (máximo 500 caracteres)';
    return null;
  },
  projectType: (value: string) => {
    if (!value || value.trim().length === 0) return 'Seleccioná al menos un tipo de proyecto';
    return null;
  },
};

// Detección de honeypot y spam
function isBot(formData: FormData): boolean {
  // Honeypot fields - si están llenos, es un bot
  const honeypotFields = ['website', 'email_confirm', 'phone', 'url', 'company'];

  for (const field of honeypotFields) {
    const value = formData.get(field) as string;
    if (value && value.trim().length > 0) {
      return true;
    }
  }

  // Verificar contenido sospechoso en el mensaje
  const message = (formData.get('message') as string)?.toLowerCase() || '';
  const spamKeywords = [
    'bitcoin',
    'crypto',
    'investment',
    'loan',
    'viagra',
    'casino',
    'forex',
    'binary options',
  ];

  const foundSpamKeyword = spamKeywords.find((keyword) => message.includes(keyword));
  if (foundSpamKeyword) {
    return true;
  }

  return false;
}

// Función para sanitizar strings y evitar problemas de JSON
function sanitizeString(str: string): string {
  if (!str) return '';
  return str
    .trim()
    .replace(/\\/g, '\\\\') // Escapar backslashes
    .replace(/"/g, '\\"') // Escapar comillas dobles
    .replace(/\n/g, '\\n') // Escapar saltos de línea
    .replace(/\r/g, '\\r') // Escapar retornos de carro
    .replace(/\t/g, '\\t'); // Escapar tabs
}

// Crear JWT para autenticación con N8N
function createJWT(payload: Record<string, unknown>): string {
  const secret = import.meta.env.N8N_JWT_SECRET;

  if (!secret) {
    throw new Error('N8N_JWT_SECRET not configured');
  }

  return jwt.sign(payload, secret, {
    expiresIn: '5m',
    issuer: 'moura.ar',
    subject: 'contact-form',
  });
}

// Extraer UTM parameters del request y formData
function extractUTMParams(request: Request, formData?: FormData): Record<string, string> {
  const url = new URL(request.url);
  const utmParams: Record<string, string> = {};

  // UTM Parameters estándar
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id'];

  utmKeys.forEach((key) => {
    // Primero intentar obtener desde formData (campos hidden)
    let value = formData?.get(key) as string;

    // Si no está en formData, intentar desde URL
    if (!value) {
      value = url.searchParams.get(key) || '';
    }

    if (value && value.trim()) {
      utmParams[key] = value.trim();
    }
  });

  // Información adicional de tracking
  const referrer = request.headers.get('referer');
  if (referrer) {
    // Sanitizar el referrer para evitar problemas con comillas y caracteres especiales
    utmParams.referrer = sanitizeString(referrer);
  }

  return utmParams;
}

// Enviar datos a N8N con JWT
async function sendToN8N(
  formData: FormFields,
  utmData: UTMData,
  request: Request
): Promise<{ success: boolean; error?: string }> {
  try {
    const webhookUrl = import.meta.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      throw new Error('N8N_WEBHOOK_URL not configured');
    }

    // Preparar payload completo - con sanitización completa para evitar problemas de JSON
    const payload = {
      // Datos del formulario (completamente sanitizados)
      name: sanitizeString(formData.name || ''),
      email: sanitizeString(formData.email || ''),
      message: sanitizeString(formData.message || ''),
      projectType: sanitizeString(formData.projectType || ''),
      budget: sanitizeString(formData.budget || ''),

      // UTM tracking (sanitizado)
      utm: Object.fromEntries(
        Object.entries(utmData).map(([key, value]) => [
          key,
          typeof value === 'string' ? sanitizeString(value) : value,
        ])
      ),

      // Metadata adicional (sanitizada)
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'moura.ar',
        userAgent: sanitizeString(request.headers.get('user-agent') || 'unknown'),
        ip: sanitizeString(
          request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
        ),
        origin: sanitizeString(request.headers.get('origin') || 'unknown'),
      },
    };

    // Crear JWT token
    const token = createJWT({
      type: 'contact-form',
      timestamp: Date.now(),
    });

    // Validar que el payload se pueda serializar correctamente
    let jsonBody: string;
    try {
      jsonBody = JSON.stringify(payload);
      // Verificar que se pueda parsear de vuelta (validación doble)
      JSON.parse(jsonBody);
    } catch (jsonError) {
      console.error('JSON serialization error:', jsonError);
      throw new Error('Invalid payload data for JSON serialization');
    }

    // Enviar a N8N
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'User-Agent': 'moura.ar-contact-form/1.0',
      },
      body: jsonBody,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `N8N webhook failed: ${response.status} ${response.statusText} - ${errorText}`
      );
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

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse form data
    const formData = await request.formData();

    // Detección de bots - Si es bot, devolver éxito falso sin enviar nada
    if (isBot(formData)) {
      // Devolver respuesta exitosa para confundir al bot
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Mensaje enviado correctamente. Te responderemos en menos de 24 horas.',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Extraer campos del formulario
    const fields = {
      name: (formData.get('name') as string)?.trim() || '',
      email: (formData.get('email') as string)?.trim() || '',
      message: (formData.get('message') as string)?.trim() || '',
      projectType: (formData.get('project-type') as string)?.trim() || '',
      budget: (formData.get('budget') as string)?.trim() || '',
    };

    // Validar campos
    const errors: Record<string, string> = {};

    const nameError = validateField.name(fields.name);
    if (nameError) errors.name = nameError;

    const emailError = validateField.email(fields.email);
    if (emailError) errors.email = emailError;

    const messageError = validateField.message(fields.message);
    if (messageError) errors.message = messageError;

    const projectTypeError = validateField.projectType(fields.projectType);
    if (projectTypeError) errors.projectType = projectTypeError;

    // Si hay errores de validación, retornar
    if (Object.keys(errors).length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          errors,
          message: 'Por favor, corregí los errores en el formulario.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Extraer UTM parameters
    const utmData = extractUTMParams(request, formData);

    // Enviar a N8N
    const result = await sendToN8N(fields, utmData, request);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Error interno del servidor. Por favor, intentá nuevamente.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Respuesta exitosa
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Mensaje enviado correctamente. Te responderemos en menos de 24 horas.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Contact form error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error interno del servidor. Por favor, intentá nuevamente.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// Otros métodos HTTP
export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify({
      error: 'Método no permitido. Solo se permiten requests POST.',
    }),
    {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        Allow: 'POST',
      },
    }
  );
};
