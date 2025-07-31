import { describe, it, expect } from 'vitest';
import { validateOrigin } from '@lib/security/security';

describe('Origin Validation', () => {
  // Helper to create a mock request with origin header
  const createMockRequest = (origin: string | null) => {
    const headers = new Headers();
    if (origin) {
      headers.set('origin', origin);
    }
    return new Request('https://example.com', { headers });
  };

  describe('Production Origins', () => {
    it('should allow moura.ar', () => {
      const request = createMockRequest('https://moura.ar');
      expect(validateOrigin(request)).toBe(true);
    });

    it('should allow www.moura.ar', () => {
      const request = createMockRequest('https://www.moura.ar');
      expect(validateOrigin(request)).toBe(true);
    });

    it('should reject unknown production domains', () => {
      const request = createMockRequest('https://malicious.com');
      expect(validateOrigin(request)).toBe(false);
    });

    it('should reject when no origin header', () => {
      const request = createMockRequest(null);
      expect(validateOrigin(request)).toBe(false);
    });
  });

  describe('Development Origins', () => {
    it('should allow localhost on standard ports', () => {
      const ports = [3000, 3001, 4321, 4322, 4323];
      ports.forEach((port) => {
        const request = createMockRequest(`http://localhost:${port}`);
        expect(validateOrigin(request)).toBe(true);
      });
    });

    it('should allow localhost on any port', () => {
      const request = createMockRequest('http://localhost:8080');
      expect(validateOrigin(request)).toBe(true);
    });

    it('should allow localhost with https', () => {
      const request = createMockRequest('https://localhost:4321');
      expect(validateOrigin(request)).toBe(true);
    });

    it('should allow 192.168.x.x network on development ports', () => {
      const validOrigins = [
        'http://192.168.1.1:4321',
        'http://192.168.0.4:4321',
        'http://192.168.100.200:3000',
        'https://192.168.1.100:4322',
      ];

      validOrigins.forEach((origin) => {
        const request = createMockRequest(origin);
        expect(validateOrigin(request)).toBe(true);
      });
    });

    it('should allow 10.x.x.x network on development ports', () => {
      const validOrigins = [
        'http://10.0.0.1:4321',
        'http://10.1.1.1:3000',
        'http://10.255.255.255:4322',
      ];

      validOrigins.forEach((origin) => {
        const request = createMockRequest(origin);
        expect(validateOrigin(request)).toBe(true);
      });
    });

    it('should allow 172.16-31.x.x network on development ports', () => {
      const validOrigins = [
        'http://172.16.0.1:4321',
        'http://172.20.1.1:3000',
        'http://172.31.255.255:4322',
      ];

      validOrigins.forEach((origin) => {
        const request = createMockRequest(origin);
        expect(validateOrigin(request)).toBe(true);
      });
    });

    it('should reject local IPs on non-development ports', () => {
      const invalidOrigins = [
        'http://192.168.1.1:80',
        'http://192.168.1.1:443',
        'http://192.168.1.1:8080',
        'http://10.0.0.1:9000',
        'http://172.16.0.1:5000',
      ];

      invalidOrigins.forEach((origin) => {
        const request = createMockRequest(origin);
        expect(validateOrigin(request)).toBe(false);
      });
    });

    it('should reject invalid IP ranges', () => {
      const invalidOrigins = [
        'http://172.15.0.1:4321', // Below valid range
        'http://172.32.0.1:4321', // Above valid range
        'http://193.168.1.1:4321', // Not 192.168
        'http://11.0.0.1:4321', // Not 10.x
      ];

      invalidOrigins.forEach((origin) => {
        const request = createMockRequest(origin);
        expect(validateOrigin(request)).toBe(false);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed origins gracefully', () => {
      const invalidOrigins = [
        'not-a-url',
        'http://',
        'https:///',
        'ftp://example.com',
        'ws://localhost:4321',
      ];

      invalidOrigins.forEach((origin) => {
        const request = createMockRequest(origin);
        expect(validateOrigin(request)).toBe(false);
      });
    });

    it('should be case sensitive for domains', () => {
      const request = createMockRequest('https://MOURA.AR');
      expect(validateOrigin(request)).toBe(false);
    });

    it('should handle ports correctly', () => {
      const request = createMockRequest('https://moura.ar:443');
      expect(validateOrigin(request)).toBe(false); // Should match exactly
    });
  });
});
