// Test setup file for vitest
import { beforeAll } from 'vitest';

beforeAll(() => {
  // Set up environment variables for tests
  process.env.N8N_JWT_SECRET = 'test-secret-key-for-unit-tests';
  process.env.N8N_WEBHOOK_URL = 'https://test-webhook.example.com';

  // Mock global functions that might be used in tests
  if (!global.crypto) {
    Object.defineProperty(global, 'crypto', {
      value: {
        randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
      },
      writable: true,
      configurable: true,
    });
  }
});
