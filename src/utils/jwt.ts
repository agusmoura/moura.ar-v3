import jwt from 'jsonwebtoken';
import { JWTPayloadSchema, type JWTPayload } from '@/schemas/contact';

/**
 * Creates a JWT token for N8N webhook authentication
 * Implements the exact payload specification required by N8N
 */
export function createContactJWT(): string {
  const secret = import.meta.env.N8N_JWT_SECRET;
  
  if (!secret) {
    throw new Error('N8N_JWT_SECRET environment variable is not configured');
  }

  const now = Math.floor(Date.now() / 1000);
  
  const payload: JWTPayload = {
    iss: 'https://moura.ar',
    aud: 'moura-contact-form-api',
    iat: now,
    exp: now + 30, // 30 seconds expiration as required
    jti: crypto.randomUUID(), // Unique identifier for this request
  };

  // Validate payload structure before signing
  const validationResult = JWTPayloadSchema.safeParse(payload);
  if (!validationResult.success) {
    throw new Error(`Invalid JWT payload: ${validationResult.error.message}`);
  }

  try {
    return jwt.sign(payload, secret, {
      algorithm: 'HS256',
      noTimestamp: true, // We're providing iat manually
    });
  } catch (error) {
    throw new Error(`Failed to create JWT token: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validates a JWT token (useful for testing)
 */
export function validateContactJWT(token: string): JWTPayload {
  const secret = import.meta.env.N8N_JWT_SECRET;
  
  if (!secret) {
    throw new Error('N8N_JWT_SECRET environment variable is not configured');
  }

  try {
    const decoded = jwt.verify(token, secret) as JWTPayload;
    
    // Validate the payload structure
    const validationResult = JWTPayloadSchema.safeParse(decoded);
    if (!validationResult.success) {
      throw new Error(`Invalid JWT payload structure: ${validationResult.error.message}`);
    }

    return validationResult.data;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error(`Invalid JWT token: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Checks if a JWT token is expired
 */
export function isJWTExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as JWTPayload | null;
    if (!decoded || !decoded.exp) return true;
    
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch {
    return true;
  }
}

/**
 * Gets the remaining time in seconds before JWT expires
 */
export function getJWTTimeToExpiry(token: string): number {
  try {
    const decoded = jwt.decode(token) as JWTPayload | null;
    if (!decoded || !decoded.exp) return 0;
    
    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, decoded.exp - now);
  } catch {
    return 0;
  }
}