# Developer Onboarding Guide

## Welcome! 👋

This guide will help you get up to speed with the Moura.ar v3 project architecture, conventions, and development workflow.

## Quick Start

### Prerequisites

- **Bun** - Fast runtime and package manager
- **Node.js 18+** - For compatibility
- **Git** - Version control

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd moura.ar-v3

# Install dependencies (use Bun, not npm!)
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
bun run dev
```

## 🏗️ Architecture Overview

The project uses a **layered architecture** with clear separation of concerns:

```
src/
├── lib/                # 🔧 Technical utilities & libraries
├── services/           # 💼 Business logic & domain operations
├── core/               # 🏛️ Application foundation & config
├── components/         # 🎨 UI components (Astro)
├── pages/              # 🌐 Routes & API endpoints
└── content/            # 📄 Content collections (MDX)
```

### Key Principles

1. **Dependency Flow**: UI → Services → Libraries → Core
2. **Path Aliases**: Use `@lib/*`, `@services/*`, `@core/*` instead of relative imports
3. **Single Responsibility**: Each layer has a clear purpose
4. **Interface-Based**: Well-defined contracts between layers

## 🎯 Understanding the Layers

### **lib/** - Technical Foundation

**Purpose**: Reusable utilities and cross-cutting concerns

**What goes here**:

- Security utilities (`@lib/security/`)
- Caching system (`@lib/cache/`)
- Logging (`@lib/logger/`)
- Validation (`@lib/validation/`)
- Analytics (`@lib/analytics/`)

**Example**:

```typescript
// lib/validation/textParser.ts
export function parseText(input: string): string {
  // Pure utility function
  return sanitizeAndFormat(input);
}
```

### **services/** - Business Logic

**Purpose**: Domain operations and business rules

**What goes here**:

- Contact form processing (`@services/contact/`)
- Analytics tracking (`@services/analytics/`)
- Content management (`@services/content/`)

**Example**:

```typescript
// services/contact/ContactService.ts
export class ContactService {
  async submitForm(data: ContactFormData): Promise<ContactResult> {
    // Business logic here
    const validation = await this.validateForm(data);
    return this.processSubmission(validation.data);
  }
}
```

### **core/** - Application Foundation

**Purpose**: App-wide configuration and infrastructure

**What goes here**:

- Dependency injection (`@core/container/`)
- Configuration (`@core/config/`)
- Core types (`@core/types/`)

**Example**:

```typescript
// core/container/ServiceContainer.ts
export interface ServiceContainer {
  cache: CacheManager;
  logger: Logger;
  analytics: AnalyticsService;
}
```

## 🛠️ Development Workflow

### 1. **Feature Development**

```bash
# Create feature branch from master
git checkout master
git pull origin master
git checkout -b feature/your-feature-name

# Develop your feature
# Commit changes
git add .
git commit -m "feat: add your feature description"

# Push and create PR to dev first
git push origin feature/your-feature-name
```

### 2. **Code Quality Checks**

```bash
# Before committing, always run:
bun run lint       # ESLint checks
bun run format     # Prettier formatting
bun run check      # TypeScript + Astro validation
bun run test       # Unit tests
```

### 3. **Testing Strategy**

```bash
# Run all tests
bun run test

# Run with coverage
bun run test:run --coverage

# Run specific test file
bun run test src/lib/security/__tests__/security.test.ts
```

## 📝 Common Tasks

### Adding a New Utility Function

```typescript
// 1. Create in appropriate lib/ subdirectory
// lib/validation/emailValidator.ts
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 2. Add unit tests
// lib/validation/__tests__/emailValidator.test.ts
import { validateEmail } from '@lib/validation/emailValidator';

describe('validateEmail', () => {
  it('should validate correct email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });
});

// 3. Use in components with path alias
import { validateEmail } from '@lib/validation/emailValidator';
```

### Adding a New Service

```typescript
// 1. Create service class
// services/analytics/AnalyticsService.ts
export class AnalyticsService {
  constructor(private config: AnalyticsConfig) {}

  track(event: string, data?: Record<string, unknown>): void {
    // Implementation
  }
}

// 2. Add to service container
// core/container/ServiceContainer.ts
export interface ServiceContainer {
  analytics: AnalyticsService; // Add here
}

// 3. Use in components
import { serviceContainer } from '@core/container/ServiceContainer';
const analytics = serviceContainer.analytics;
```

### Creating a New Component

```astro
---
// components/ui/NewComponent.astro
import type { Props } from './types';
import { parseText } from '@lib/validation/textParser';

interface Props {
  title: string;
  content?: string;
}

const { title, content = '' } = Astro.props;
const processedContent = parseText(content);
---

<div class="new-component">
  <h2>{title}</h2>
  {processedContent && <div set:html={processedContent} />}
</div>

<style>
  .new-component {
    @apply p-4 rounded-lg bg-surface;
  }
</style>
```

## 🔍 Debugging Guide

### Common Issues & Solutions

#### Import Path Issues

```typescript
// ❌ Don't use relative imports
import { parseText } from '../../../lib/validation/textParser';

// ✅ Use path aliases
import { parseText } from '@lib/validation/textParser';
```

#### TypeScript Errors

```bash
# Check TypeScript configuration
bun run check

# If imports not resolving, check:
# 1. tsconfig.json has correct path aliases
# 2. File exists at expected location
# 3. Export/import syntax is correct
```

#### Build Issues

```bash
# Clean build and reinstall
rm -rf node_modules dist
bun install
bun run build
```

### Debugging Tools

- **Browser DevTools**: For client-side debugging
- **Console Logging**: Use `@lib/logger/Logger` for structured logging
- **Bundle Analysis**: `bun run analyze` for bundle size issues
- **Test Debugging**: Use Vitest's debugging features

## 📚 Essential Resources

### Internal Documentation

- **[Architecture Guide](../development/architecture.md)** - Deep dive into architecture decisions
- **[Development Conventions](../development/conventions.md)** - Coding standards and patterns
- **[ADR-001](../adr/001-architecture-refactor.md)** - Architecture refactoring decisions

### External Resources

- **[Astro Documentation](https://docs.astro.build/)** - Framework reference
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Styling reference
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - Type system reference
- **[Vitest Documentation](https://vitest.dev/)** - Testing framework

## 🚨 Important Rules

### **ALWAYS Use Bun**

```bash
# ✅ Correct
bun install
bun add package-name
bun run dev

# ❌ Never use
npm install
yarn add package-name
pnpm install
```

### **ALWAYS Use Path Aliases**

```typescript
// ✅ Correct
import { validateForm } from '@lib/validation/formValidator';
import { contactService } from '@services/contact/api';

// ❌ Avoid
import { validateForm } from '../../../lib/validation/formValidator';
import { contactService } from '../../services/contact/api';
```

### **ALWAYS Test Your Changes**

```bash
# Before every commit
bun run lint && bun run check && bun run test && bun run build
```

### **NEVER Commit Directly to master/dev**

Always use feature branches and pull requests for code review.

## 🎓 Learning Path

### Week 1: Fundamentals

- [ ] Set up development environment
- [ ] Read architecture documentation
- [ ] Explore codebase structure
- [ ] Run and understand tests
- [ ] Make your first small change

### Week 2: Hands-on Development

- [ ] Add a new utility function to `lib/`
- [ ] Create a simple component
- [ ] Modify existing service logic
- [ ] Write unit tests for your changes

### Week 3: Advanced Topics

- [ ] Understand dependency injection pattern
- [ ] Work with content collections
- [ ] Implement new API endpoint
- [ ] Optimize performance

### Week 4: Mastery

- [ ] Review and improve existing code
- [ ] Contribute to documentation
- [ ] Mentor other developers
- [ ] Propose architectural improvements

## 🤝 Getting Help

### Code Review Process

1. Create descriptive PR title and description
2. Request review from team members
3. Address feedback promptly
4. Ensure all CI checks pass

### Ask Questions

- **Architecture**: Ask about layer responsibilities and dependencies
- **Conventions**: Reference the conventions documentation
- **Performance**: Use bundle analyzer and performance tools
- **Testing**: Follow existing test patterns

### Contributing Guidelines

1. Follow existing code patterns
2. Write tests for new functionality
3. Update documentation for significant changes
4. Use descriptive commit messages
5. Keep PRs focused and small

## 🎉 Welcome to the Team!

This architecture promotes:

- **🧩 Modularity**: Clear separation of concerns
- **🔧 Maintainability**: Easy to modify and extend
- **🚀 Performance**: Optimized for speed and efficiency
- **🛡️ Quality**: Comprehensive testing and validation
- **📖 Documentation**: Well-documented and easy to understand

Happy coding! If you have questions, don't hesitate to ask the team.
