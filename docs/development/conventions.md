# Development Conventions

## Overview

This document outlines the development conventions, coding standards, and best practices for the Moura.ar v3 project. Following these conventions ensures code consistency, maintainability, and team collaboration.

## File Organization & Naming

### **Directory Structure**

```
src/
├── components/          # UI components (Astro)
├── lib/                # Reusable utilities & libraries
├── services/           # Business logic services
├── core/               # Application foundation
├── pages/              # Routes & API endpoints
├── content/            # Content collections
├── layouts/            # Page layouts
├── schemas/            # Validation schemas
├── types/              # Type definitions
├── data/               # Static data
└── styles/             # Global styles
```

### **File Naming Conventions**

| Type                      | Convention       | Example               |
| ------------------------- | ---------------- | --------------------- |
| **Astro Components**      | PascalCase.astro | `ContactForm.astro`   |
| **TypeScript Files**      | camelCase.ts     | `userService.ts`      |
| **Type Definition Files** | kebab-case.ts    | `user-types.ts`       |
| **Test Files**            | \*.test.ts       | `userService.test.ts` |
| **Configuration Files**   | kebab-case.ts    | `cache-config.ts`     |
| **Utility Files**         | camelCase.ts     | `textParser.ts`       |

### **Directory Naming**

- Use **lowercase** with **hyphens** for directories
- Group related functionality: `lib/security/`, `services/contact/`
- Keep directory names descriptive but concise

## Import Conventions

### **Path Alias Usage**

Always use path aliases instead of relative imports:

```typescript
// ✅ Good - Use path aliases
import { parseText } from '@lib/validation/textParser';
import { analytics } from '@lib/analytics/umami-analytics';
import { validateForm } from '@services/contact/validator';
import { ServiceContainer } from '@core/container/ServiceContainer';

// ❌ Bad - Avoid relative imports
import { parseText } from '../../../lib/validation/textParser';
import { analytics } from '../../lib/analytics/umami-analytics';
```

### **Available Path Aliases**

```typescript
// tsconfig.json & vitest.config.ts
{
  "@/*": ["src/*"],
  "@components/*": ["src/components/*"],
  "@layouts/*": ["src/layouts/*"],
  "@pages/*": ["src/pages/*"],
  "@styles/*": ["src/styles/*"],
  "@assets/*": ["src/assets/*"],
  "@types/*": ["src/types/*"],
  "@lib/*": ["src/lib/*"],           // 🆕 Libraries
  "@services/*": ["src/services/*"], // 🆕 Services
  "@core/*": ["src/core/*"]          // 🆕 Core
}
```

### **Import Order**

Organize imports in the following order:

```typescript
// 1. External packages
import { defineConfig } from 'astro/config';
import { z } from 'zod';

// 2. Astro framework imports
import { Image } from 'astro:assets';
import type { APIRoute } from 'astro';

// 3. Internal imports (by layer)
import type { Config } from '@core/types/config'; // Core first
import { logger } from '@lib/logger/Logger'; // Libraries second
import { contactService } from '@services/contact/api'; // Services third
import ContactForm from '@components/ui/ContactForm.astro'; // Components last

// 4. Relative imports (avoid when possible)
import './component.css';
```

## TypeScript Conventions

### **Type Definitions**

```typescript
// ✅ Good - Descriptive interface names
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  projectType: string[];
}

// ✅ Good - Use type for unions/primitives
export type Theme = 'light' | 'dark';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// ✅ Good - Generic type naming
export interface CacheAdapter<T = unknown> {
  get(key: string): T | null;
  set(key: string, value: T): void;
}
```

### **Function Signatures**

```typescript
// ✅ Good - Explicit return types
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ✅ Good - Async functions with Promise types
export async function fetchProjects(): Promise<Project[]> {
  // Implementation
}

// ✅ Good - Optional parameters at the end
export function createLogger(component: string, level: LogLevel = 'info'): Logger {
  // Implementation
}
```

### **Error Handling**

```typescript
// ✅ Good - Typed error handling
export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public code: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// ✅ Good - Result type pattern
export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

export async function safeOperation(): Promise<Result<Data>> {
  try {
    const data = await riskyOperation();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```

## Component Conventions

### **Astro Component Structure**

```astro
---
// 1. Imports
import type { Props } from './types';
import { parseText } from '@lib/validation/textParser';
import Layout from '@layouts/Layout.astro';

// 2. Interface definition
interface Props {
  title: string;
  content?: string;
}

// 3. Props destructuring
const { title, content = '' } = Astro.props;

// 4. Component logic
const processedContent = parseText(content);
---

<!-- 5. Template -->
<Layout>
  <h1>{title}</h1>
  {processedContent && <div set:html={processedContent} />}
</Layout>

<style>
  /* 6. Scoped styles */
  h1 {
    @apply text-2xl font-bold text-primary;
  }
</style>

<script>
  // 7. Client-side scripts (if needed)
  console.log('Component loaded');
</script>
```

### **Component Props**

```typescript
// ✅ Good - Descriptive prop interfaces
interface ContactFormProps {
  /** The form's submit endpoint URL */
  action?: string;
  /** Whether to show the project type selector */
  showProjectTypes?: boolean;
  /** Callback fired on successful submission */
  onSuccess?: (data: ContactFormData) => void;
}

// ✅ Good - Use optional props with defaults
const { action = '/api/contact', showProjectTypes = true, onSuccess } = Astro.props;
```

## Service Layer Conventions

### **Service Organization**

```typescript
// services/contact/ContactService.ts

export class ContactService {
  constructor(
    private readonly logger: Logger,
    private readonly validator: Validator,
    private readonly emailService: EmailService
  ) {}

  async submitForm(data: ContactFormData): Promise<ContactResult> {
    // 1. Validate input
    const validation = await this.validator.validate(data);
    if (!validation.success) {
      throw new ValidationError('Invalid form data', validation.errors);
    }

    // 2. Business logic
    const sanitizedData = this.sanitizeData(data);

    // 3. External service calls
    const result = await this.emailService.send(sanitizedData);

    // 4. Logging
    this.logger.info('Contact form submitted', {
      email: data.email,
      success: result.success,
    });

    return result;
  }

  private sanitizeData(data: ContactFormData): ContactFormData {
    // Implementation
  }
}
```

### **Service Interface Design**

```typescript
// ✅ Good - Clear service interfaces
export interface AnalyticsService {
  track(event: string, data?: Record<string, unknown>): void;
  identify(userId: string, traits?: Record<string, unknown>): void;
  page(name: string, properties?: Record<string, unknown>): void;
}

// ✅ Good - Service factory pattern
export function createContactService(config: ContactConfig): ContactService {
  const logger = createLogger('ContactService');
  const validator = new ContactValidator(config.validation);
  const emailService = new EmailService(config.email);

  return new ContactService(logger, validator, emailService);
}
```

## Library Conventions

### **Library Structure**

```typescript
// lib/cache/CacheManager.ts

// 1. Type definitions
export interface CacheEntry<T = unknown> {
  value: T;
  timestamp: number;
  ttl?: number;
}

export enum CacheLevel {
  MEMORY = 'memory',
  LOCAL_STORAGE = 'localStorage',
  SESSION_STORAGE = 'sessionStorage',
}

// 2. Main class
export class CacheManager {
  // Implementation
}

// 3. Factory functions
export function createCacheManager(config?: CacheConfig): CacheManager {
  return new CacheManager(config);
}

// 4. Utility functions
export function isExpired(entry: CacheEntry): boolean {
  return entry.ttl ? Date.now() - entry.timestamp > entry.ttl : false;
}
```

### **Pure Functions**

```typescript
// ✅ Good - Pure functions in libraries
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// ✅ Good - Predictable utility functions
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | undefined;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
```

## Testing Conventions

### **Test Organization**

```
src/
├── lib/
│   └── security/
│       ├── __tests__/
│       │   ├── security.test.ts
│       │   └── setup.ts
│       ├── security.ts
│       └── jwt.ts
```

### **Test Structure**

```typescript
// lib/security/__tests__/security.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { validateOrigin } from '@lib/security/security';

describe('Security Utilities', () => {
  describe('validateOrigin', () => {
    it('should validate allowed origins', () => {
      const request = createMockRequest('https://moura.ar');
      const result = validateOrigin(request);
      expect(result).toBe(true);
    });

    it('should reject unauthorized origins', () => {
      const request = createMockRequest('https://malicious.com');
      const result = validateOrigin(request);
      expect(result).toBe(false);
    });
  });
});

function createMockRequest(origin: string): Request {
  return new Request('https://example.com', {
    headers: { Origin: origin },
  });
}
```

## Error Handling Conventions

### **Error Types**

```typescript
// core/types/errors.ts
export abstract class AppError extends Error {
  abstract readonly statusCode: number;
  abstract readonly code: string;

  constructor(
    message: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  readonly statusCode = 400;
  readonly code = 'VALIDATION_ERROR';
}

export class NotFoundError extends AppError {
  readonly statusCode = 404;
  readonly code = 'NOT_FOUND';
}
```

### **Error Handling Patterns**

```typescript
// ✅ Good - Consistent error handling in services
export async function submitContactForm(data: ContactFormData): Promise<ContactResult> {
  try {
    // Validate
    const validation = validateContactForm(data);
    if (!validation.success) {
      throw new ValidationError('Invalid form data', {
        errors: validation.errors,
      });
    }

    // Process
    return await processContactForm(data);
  } catch (error) {
    logger.error('Contact form submission failed', error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new InternalServerError('Contact form processing failed');
  }
}
```

## Documentation Conventions

### **JSDoc Standards**

````typescript
/**
 * Validates and sanitizes contact form data
 *
 * @param data - The raw form data to validate
 * @param options - Validation options
 * @returns Promise that resolves to validation result
 *
 * @throws {ValidationError} When required fields are missing
 * @throws {SecurityError} When suspicious content is detected
 *
 * @example
 * ```typescript
 * const result = await validateContactForm({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   message: 'Hello world'
 * })
 * ```
 */
export async function validateContactForm(
  data: ContactFormData,
  options: ValidationOptions = {}
): Promise<ValidationResult> {
  // Implementation
}
````

### **README Structure**

Each major module should have a README with:

```markdown
# Module Name

Brief description of the module's purpose.

## Usage

Basic usage examples with code snippets.

## API Reference

List of exported functions/classes with brief descriptions.

## Examples

Real-world usage examples.

## Testing

How to run tests for this module.
```

## Performance Conventions

### **Bundle Optimization**

```typescript
// ✅ Good - Dynamic imports for code splitting
const lazyLoadAnalytics = async () => {
  const { analytics } = await import('@lib/analytics/umami-analytics');
  return analytics;
};

// ✅ Good - Tree-shakable exports
export { CacheManager } from './CacheManager';
export { createCacheManager } from './factory';
export type { CacheConfig, CacheEntry } from './types';
```

### **Performance Best Practices**

- Use `Image` component for optimized image loading
- Implement lazy loading for non-critical components
- Cache expensive computations
- Minimize bundle size with strategic imports
- Use performance monitoring in production

These conventions ensure consistent, maintainable, and performant code across the entire project.
