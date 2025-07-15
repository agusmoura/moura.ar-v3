import { describe, it, expect } from 'vitest';
import { 
  UTMParamsSchema,
  N8NPayloadSchema,
  validateContactForm,
  validateHoneypot,
  SPAM_KEYWORDS,
  PROJECT_TYPES 
} from '@/schemas/contact';
import { createContactJWT, isJWTExpired } from '@/utils/jwt';
import { containsSpamKeywords, sanitizeForJSON } from '@/utils/security';

describe('Contact Form Schema Validation', () => {
  describe('ContactFormSchema', () => {
    it('should validate correct form data', () => {
      const validData = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        message: 'Este es un mensaje de prueba de más de 20 caracteres',
        projectType: ['website', 'ui-ux'],
        budget: '5000'
      };

      const result = validateContactForm(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Juan Pérez');
        expect(result.data.email).toBe('juan@example.com');
        expect(result.data.projectType).toEqual(['website', 'ui-ux']);
      }
    });

    it('should reject invalid name', () => {
      const invalidData = {
        name: 'X', // Too short
        email: 'juan@example.com',
        message: 'Este es un mensaje de prueba de más de 20 caracteres',
        projectType: ['website']
      };

      const result = validateContactForm(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El nombre debe tener al menos 2 caracteres');
      }
    });

    it('should reject invalid email', () => {
      const invalidData = {
        name: 'Juan Pérez',
        email: 'invalid-email',
        message: 'Este es un mensaje de prueba de más de 20 caracteres',
        projectType: ['website']
      };

      const result = validateContactForm(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Ingresá una dirección de email válida');
      }
    });

    it('should reject short message', () => {
      const invalidData = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        message: 'Corto', // Too short
        projectType: ['website']
      };

      const result = validateContactForm(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El mensaje debe tener al menos 20 caracteres');
      }
    });

    it('should reject empty project types', () => {
      const invalidData = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        message: 'Este es un mensaje de prueba de más de 20 caracteres',
        projectType: [] // Empty array
      };

      const result = validateContactForm(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Seleccioná al menos un tipo de proyecto');
      }
    });
  });

  describe('UTMParamsSchema', () => {
    it('should validate UTM parameters', () => {
      const validUTM = {
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'test-campaign',
        referrer: 'https://google.com'
      };

      const result = UTMParamsSchema.safeParse(validUTM);
      expect(result.success).toBe(true);
    });

    it('should handle optional UTM parameters', () => {
      const partialUTM = {
        utm_source: 'google'
      };

      const result = UTMParamsSchema.safeParse(partialUTM);
      expect(result.success).toBe(true);
    });
  });

  describe('N8NPayloadSchema', () => {
    it('should validate complete N8N payload', () => {
      const validPayload = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        message: 'Este es un mensaje de prueba',
        projectType: 'website, ui-ux',
        utm: {
          utm_source: 'google',
          utm_medium: 'cpc'
        },
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'moura.ar',
          userAgent: 'Mozilla/5.0...',
          ip: '192.168.1.1',
          origin: 'https://moura.ar'
        }
      };

      const result = N8NPayloadSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });
  });

  describe('Honeypot Validation', () => {
    it('should detect bot activity', () => {
      const botData = {
        website: 'http://spam.com', // Honeypot filled
        email_confirm: '',
        phone: '',
        url: '',
        company: ''
      };

      const result = validateHoneypot(botData);
      expect(result.success).toBe(false);
    });

    it('should pass clean honeypot data', () => {
      const cleanData = {
        website: '',
        email_confirm: '',
        phone: '',
        url: '',
        company: ''
      };

      const result = validateHoneypot(cleanData);
      expect(result.success).toBe(true);
    });
  });
});

describe('JWT Utilities', () => {

  it('should create valid JWT token', () => {
    const token = createContactJWT();
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // JWT has 3 parts
  });

  it('should detect expired tokens', () => {
    // Create a token that expires immediately
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL21vdXJhLmFyIiwiYXVkIjoibW91cmEtY29udGFjdC1mb3JtLWFwaSIsImlhdCI6MTY0MDk5NTIwMCwiZXhwIjoxNjQwOTk1MjMwLCJqdGkiOiJ0ZXN0LWp0aSJ9.test';
    
    const isExpired = isJWTExpired(expiredToken);
    expect(isExpired).toBe(true);
  });
});

describe('Security Utilities', () => {
  describe('containsSpamKeywords', () => {
    it('should detect spam keywords', () => {
      const spamMessage = 'Get rich quick with bitcoin investment!';
      const result = containsSpamKeywords(spamMessage, SPAM_KEYWORDS);
      expect(result).toBe(true);
    });

    it('should pass clean messages', () => {
      const cleanMessage = 'I need help with my website development project';
      const result = containsSpamKeywords(cleanMessage, SPAM_KEYWORDS);
      expect(result).toBe(false);
    });
  });

  describe('sanitizeForJSON', () => {
    it('should sanitize dangerous characters', () => {
      const dangerousString = 'Hello "World"\nNew line\tTab\\Backslash';
      const sanitized = sanitizeForJSON(dangerousString);
      // Control characters are removed first, then remaining chars are escaped
      expect(sanitized).toBe('Hello \\"World\\"New lineTab\\\\Backslash');
    });

    it('should handle empty strings', () => {
      const result = sanitizeForJSON('');
      expect(result).toBe('');
    });

    it('should handle undefined/null values', () => {
      const result = sanitizeForJSON(undefined as string);
      expect(result).toBe('');
    });
  });
});

describe('Project Types', () => {
  it('should have all expected project types', () => {
    const expectedTypes = [
      'website',
      'web-app',
      'ui-ux',
      'backend',
      'ai',
      'mobile',
      'ecommerce',
      'consulting'
    ];

    expectedTypes.forEach(type => {
      expect(PROJECT_TYPES).toHaveProperty(type);
    });
  });

  it('should have Spanish names for all types', () => {
    Object.values(PROJECT_TYPES).forEach(name => {
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(0);
    });
  });
});

describe('Integration Tests', () => {
  it('should handle complete form submission flow', () => {
    // Simulate form data
    const formData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message for the contact form with sufficient length',
      projectType: ['website', 'ui-ux']
    };

    // Validate form
    const validation = validateContactForm(formData);
    expect(validation.success).toBe(true);

    // Check honeypot
    const honeypot = {
      website: '',
      email_confirm: '',
      phone: '',
      url: '',
      company: ''
    };
    const honeypotCheck = validateHoneypot(honeypot);
    expect(honeypotCheck.success).toBe(true);

    // Check spam
    const isSpam = containsSpamKeywords(formData.message, SPAM_KEYWORDS);
    expect(isSpam).toBe(false);

    // Create JWT
    const token = createContactJWT();
    expect(token).toBeDefined();
    expect(isJWTExpired(token)).toBe(false);
  });
});