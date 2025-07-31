# Moura.ar v3 🚀

Modern personal portfolio with layered architecture, space-themed animations, and N8N contact form integration.

## 🚀 Quick Start

```bash
# Install dependencies (use Bun!)
bun install

# Start development server
bun run dev

# Build for production
bun run build
```

## 🛠️ Tech Stack

- **Astro v5** - Modern web framework with SSR
- **Tailwind CSS v4** - CSS-based utility framework
- **TypeScript** - Strict type safety
- **Bun** - Fast runtime and package manager
- **N8N + JWT** - Contact form automation

## 🏗️ Architecture

Clean layered architecture with separation of concerns:

```
src/
├── lib/         # Core utilities & libraries
├── services/    # Business logic layer
├── core/        # Application foundation
├── components/  # UI components (Astro)
└── pages/       # Routes & API endpoints
```

Uses path aliases for clean imports:

```typescript
import { validateForm } from '@lib/validation/formValidator';
import { contactService } from '@services/contact/api';
```

## 🔧 Environment Setup

```bash
# Required for contact form
N8N_WEBHOOK_URL=https://n8n.moura.ar/webhook-test/moura-contact-form
N8N_JWT_SECRET=your-jwt-secret-phrase

# Optional
PUBLIC_ENABLE_ANALYTICS=false
```

## 📋 Essential Commands

```bash
# Development
bun run dev              # Start development server
bun run "dev external"   # External access

# Quality & Testing
bun run lint             # ESLint checks
bun run check            # TypeScript validation
bun run test             # Run tests

# Production
bun run build            # Build for production
bun run preview          # Preview build
```

## 🚀 Features

- **Multi-layer Caching** - Memory, localStorage, sessionStorage
- **Space Animations** - Custom particle system with physics
- **Security** - JWT authentication, input validation, rate limiting
- **Performance** - Code splitting, image optimization, <10s builds
- **Quality** - 15 unit tests, TypeScript strict mode, ESLint

## 📚 Documentation

**Quick Links:**

- [Setup Guide](./docs/setup/) - Detailed installation and configuration
- [Usage Guide](./docs/usage/) - Commands and analytics
- [API Reference](./docs/api/) - Contact form API documentation
- [Development](./docs/development/) - Architecture, conventions, components
- [Contributing](./docs/contributing/) - Onboarding and workflow

**For Developers:**

- [Architecture Guide](./docs/development/architecture.md) - System design and principles
- [Development Conventions](./docs/development/conventions.md) - Coding standards
- [Onboarding Guide](./docs/contributing/onboarding.md) - Getting started as a developer

## 🧪 Quality Metrics

- ✅ **15/15 tests passing** with Vitest
- ✅ **TypeScript strict mode** with path aliases
- ✅ **Build time**: ~10 seconds total
- ✅ **Bundle optimization**: <75KB main chunk
- ✅ **Security validation**: JWT + rate limiting

---

**Built with modern architecture principles** - Scalable, maintainable, and performant with comprehensive testing and documentation.

📖 [View All Documentation](./docs/) | 🏗️ [Architecture Details](./docs/development/architecture.md) | 🚀 [Get Started](./docs/setup/installation.md)
