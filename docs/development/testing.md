# Testing Guide

Comprehensive testing strategies and practices for Moura.ar v3.

## Testing Philosophy

- **Prevention over Detection**: Build quality in, don't test it in
- **Risk-Based Testing**: Focus on critical paths and high-impact areas
- **Fast Feedback**: Quick test execution for development workflow
- **Comprehensive Coverage**: Unit, integration, and E2E testing

## Testing Stack

### Core Framework
- **Vitest** - Fast unit testing framework with Hot Module Replacement
- **V8 Coverage** - Native Node.js coverage reporting
- **TypeScript** - Full type safety in tests
- **Bun Runtime** - Fast test execution

### Testing Types
```bash
# Unit Tests - Fast, isolated component/function testing
src/lib/**/__tests__/*.test.ts

# Integration Tests - Service and API endpoint testing
src/services/**/__tests__/*.test.ts

# Component Tests - UI component behavior
src/components/**/__tests__/*.test.ts
```

## Current Test Suite

### Security Tests (15 tests)
Located in `src/lib/security/__tests__/security.test.ts`

**Coverage Areas:**
- **Input Validation** (5 tests)
  - Email format validation
  - Required field validation
  - String length limits
  - HTML/script injection prevention
  - Special character handling

- **JWT Authentication** (4 tests)
  - Token generation with correct payload
  - Token expiration handling
  - Invalid secret detection
  - Malformed token rejection

- **Rate Limiting** (3 tests)
  - Request counting per IP
  - Rate limit enforcement (5 requests/hour)
  - Rate limit reset behavior

- **Bot Detection** (3 tests)
  - Honeypot field detection
  - Spam keyword filtering
  - Suspicious pattern recognition

### Test Results
```bash
✅ All 15 tests passing
✅ Coverage: Security utilities (100%)
✅ Execution time: <500ms
✅ Type safety: Full TypeScript coverage
```

## Running Tests

### Basic Commands
```bash
# Run all tests (watch mode)
bun run test

# Run tests once (CI mode)
bun run test:run

# Run with coverage
bun run test:run --coverage

# Run specific test file
bun run test src/lib/security/__tests__/security.test.ts

# Run tests matching pattern
bun run test --run --grep "validation"
```

### Advanced Options
```bash
# Watch specific files
bun run test --watch src/lib/

# Debug mode with verbose output
bun run test --verbose --no-coverage

# Run tests in parallel (default)
bun run test --threads

# Generate detailed coverage report
bun run test:run --coverage --reporter=html
```

## Writing Tests

### Test Structure
```typescript
// src/lib/example/__tests__/example.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { exampleFunction } from '../exampleFunction'

describe('exampleFunction', () => {
  beforeEach(() => {
    // Setup before each test
  })

  afterEach(() => {
    // Cleanup after each test
  })

  it('should handle valid input correctly', () => {
    // Arrange
    const input = 'valid-input'
    
    // Act
    const result = exampleFunction(input)
    
    // Assert
    expect(result).toBe('expected-output')
  })

  it('should throw error for invalid input', () => {
    // Test error conditions
    expect(() => exampleFunction(null)).toThrow('Invalid input')
  })
})
```

### Security Test Example
```typescript
// Example from src/lib/security/__tests__/security.test.ts
describe('Input Validation', () => {
  it('should reject invalid email formats', () => {
    const invalidEmails = [
      'invalid-email',
      '@domain.com',
      'user@',
      'user@domain',
      'user space@domain.com'
    ]

    invalidEmails.forEach(email => {
      expect(() => validateEmail(email)).toThrow('Invalid email format')
    })
  })

  it('should prevent XSS injection attempts', () => {
    const maliciousInputs = [
      '<script>alert("xss")</script>',
      'javascript:alert("xss")',
      '<img src="x" onerror="alert(1)">'
    ]

    maliciousInputs.forEach(input => {
      expect(() => validateInput(input)).toThrow('Invalid characters detected')
    })
  })
})
```

### API Testing
```typescript
// Testing API endpoints
describe('Contact Form API', () => {
  it('should accept valid contact form submission', async () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello world'
    }

    const response = await POST('/api/contact', {
      body: JSON.stringify(validData),
      headers: { 'Content-Type': 'application/json' }
    })

    expect(response.status).toBe(200)
  })

  it('should reject spam submissions', async () => {
    const spamData = {
      name: 'Spammer',
      email: 'spam@spam.com',
      message: 'Buy now! Click here! Free money!'
    }

    const response = await POST('/api/contact', {
      body: JSON.stringify(spamData),
      headers: { 'Content-Type': 'application/json' }
    })

    expect(response.status).toBe(400)
    expect(response.json()).toEqual({
      error: 'Spam content detected'
    })
  })
})
```

## Testing Best Practices

### Test Organization
- **One test file per module**: `module.ts` → `__tests__/module.test.ts`
- **Descriptive test names**: Use complete sentences describing behavior
- **Group related tests**: Use `describe` blocks for logical grouping
- **Setup/teardown**: Use `beforeEach`/`afterEach` for test isolation

### Test Quality
- **AAA Pattern**: Arrange, Act, Assert for clear test structure
- **Edge Cases**: Test boundary conditions and error scenarios
- **Mock External Dependencies**: Isolate units under test
- **Fast Execution**: Keep tests under 100ms each when possible

### Coverage Goals
- **Unit Tests**: 80%+ coverage for core business logic
- **Integration Tests**: 70%+ coverage for service interactions
- **Critical Paths**: 100% coverage for security and payment flows
- **Edge Cases**: Comprehensive coverage of error conditions

## Continuous Integration

### Test Pipeline
```yaml
# CI/CD test stages
stages:
  - install: bun install
  - lint: bun run lint
  - typecheck: bun run check
  - test: bun run test:run --coverage
  - build: bun run build
```

### Quality Gates
- **All tests must pass**: No failing tests in main branch
- **Coverage thresholds**: Minimum coverage requirements enforced
- **Type safety**: No TypeScript errors allowed
- **Performance**: Test suite runs in <30 seconds

### Pre-commit Hooks
```bash
# Automatically run before each commit
- bun run lint
- bun run check
- bun run test:run --silent
```

## Debugging Tests

### Common Issues

#### Test Failures
```bash
# Run failing test with verbose output
bun run test --verbose failing-test.test.ts

# Debug specific test
bun run test --no-coverage --reporter=verbose

# Run with stack traces
bun run test --stack-trace
```

#### Environment Issues
```bash
# Clear test cache
rm -rf node_modules/.vitest

# Reinstall dependencies
bun install

# Check Vitest configuration
bun run vitest --config
```

#### Timeout Issues
```typescript
// Increase timeout for slow tests
it('slow operation', async () => {
  // Test code
}, 10000) // 10 second timeout
```

### Debug Configuration
```typescript
// vitest.config.ts debugging
export default defineConfig({
  test: {
    // Enable debugging
    logHeapUsage: true,
    reporter: 'verbose',
    
    // Timeout configuration
    testTimeout: 10000,
    hookTimeout: 10000
  }
})
```

## Performance Testing

### Current Metrics
- **Test Execution**: <500ms for full suite
- **Coverage Generation**: <2 seconds
- **Memory Usage**: <100MB peak
- **Parallel Execution**: Enabled (4 threads)

### Optimization Strategies
- **Parallel Execution**: Tests run in parallel by default
- **Smart Caching**: Vitest caches test results between runs
- **Selective Testing**: Run only changed tests during development
- **Minimal Mocking**: Use real implementations when fast enough

## Future Testing Enhancements

### Planned Additions
- **E2E Testing**: Add Playwright for browser automation
- **Visual Testing**: Screenshot comparison for UI components
- **Performance Tests**: Load testing for API endpoints
- **Accessibility Testing**: Automated a11y validation

### Integration Targets
- **Component Library**: Test all UI components individually
- **API Endpoints**: Comprehensive endpoint testing
- **Business Logic**: Full service layer coverage
- **Error Handling**: Complete error scenario testing

## Testing Commands Reference

### Development Workflow
```bash
# Quick test during development
bun run test --watch

# Full validation before commit
bun run test:run --coverage && bun run build

# Test specific feature
bun run test --run --grep "contact form"

# Generate coverage report
bun run test:run --coverage --reporter=html
```

### CI/CD Integration
```bash
# Complete test pipeline
bun run lint && bun run check && bun run test:run && bun run build

# Coverage reporting
bun run test:run --coverage --reporter=json --outputFile=coverage.json
```

## Need Help?

- **Test Writing**: Check existing tests in `src/lib/security/__tests__/`
- **Vitest Documentation**: [vitest.dev](https://vitest.dev/)
- **Coverage Reports**: Generated in `coverage/` directory
- **CI Issues**: Check GitHub Actions workflow logs

## Next Steps

After understanding testing:

1. **[Review Architecture](./architecture.md)** - Understand system design
2. **[Learn Conventions](./conventions.md)** - Follow coding standards  
3. **[Study Components](./components.md)** - UI component patterns
4. **[Check API Docs](../api/contact-form.md)** - API testing examples

## Related Documentation

- **[Installation Guide](../setup/installation.md)** - Set up testing environment
- **[Development Conventions](./conventions.md)** - Code quality standards
- **[Onboarding Guide](../contributing/onboarding.md)** - Developer workflow
- **[Commands Reference](../usage/commands.md)** - Testing commands