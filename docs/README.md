# Documentation Index - Moura.ar v3

Welcome to the comprehensive documentation for the Moura.ar v3 portfolio website. This documentation provides complete information about the project architecture, components, APIs, and development processes.

## 📚 Documentation Structure

### 🎯 [Project Index](PROJECT_INDEX.md)

**Main project overview and architecture**

- Project structure and technology stack
- Development workflow and commands
- Configuration and environment setup
- Security features and performance optimizations
- Design system and development standards

### 📡 [API Documentation](API_DOCUMENTATION.md)

**Contact Form API reference**

- Endpoint specifications and request/response formats
- Security features (rate limiting, bot detection, spam filtering)
- N8N webhook integration with JWT authentication
- Testing examples and troubleshooting guide
- Error handling and monitoring

### 🧩 [Component Guide](COMPONENT_GUIDE.md)

**Complete component reference**

- All 24+ components with props and usage examples
- Component categories (Analytics, Accessibility, Effects, Sections, SEO, UI)
- Best practices for component development
- Responsive design patterns and accessibility features

### 📊 [Analytics System](../ANALYTICS.md)

**Advanced Umami analytics implementation**

- Comprehensive tracking system for forms, navigation, and performance
- Event catalog with 15+ tracked interactions
- Privacy-compliant, cookie-free analytics
- Implementation examples and monitoring setup

## 🚀 Quick Start

### Essential Files

- [README.md](../README.md) - Project quick start guide
- [CLAUDE.md](../CLAUDE.md) - AI assistant instructions
- [TODO.md](../TODO.md) - Project roadmap and tasks

### Development Setup

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Run quality checks
bun run lint && bun run check
```

### Key Commands

```bash
bun run dev              # Development server
bun run build            # Production build
bun run test             # Run tests
bun run analyze          # Bundle analysis
```

## 🏗️ Architecture Overview

### Framework Stack

- **Astro v5**: SSR with Node.js adapter
- **Tailwind CSS v4**: CSS-based configuration
- **TypeScript**: Strict type checking
- **Bun**: Runtime and package manager

### Key Features

- 🌌 **Space-themed animations** with particle physics
- 📧 **Smart contact form** with N8N integration
- 📊 **Advanced analytics** with Umami tracking
- ♿ **Accessibility-first** design (WCAG compliant)
- 🔒 **Security-focused** (rate limiting, input sanitization)
- ⚡ **Performance-optimized** (code splitting, image optimization)

### Project Structure

```
src/
├── components/
│   ├── accessibility/    # A11y components
│   ├── analytics/        # Umami integration
│   ├── effects/          # Space animations
│   ├── sections/         # Page sections
│   ├── seo/             # SEO components
│   └── ui/              # UI elements
├── content/projects/     # Project MDX files
├── pages/api/           # API endpoints
├── utils/               # Utility functions
└── schemas/             # Validation schemas
```

## 🔧 Configuration

### Environment Variables

```bash
# Contact Form
N8N_WEBHOOK_URL=https://n8n.moura.ar/webhook-test/moura-contact-form
N8N_JWT_SECRET=your-jwt-secret

# Analytics (optional)
PUBLIC_ENABLE_ANALYTICS=false
```

### TypeScript Paths

```typescript
@/*           → src/*
@components/* → src/components/*
@layouts/*    → src/layouts/*
@utils/*      → src/utils/*
```

## 🧪 Testing & Quality

### Available Tests

```bash
bun run test            # All tests
bun run test:contact    # Contact form tests
```

### Quality Checks

```bash
bun run lint            # ESLint
bun run format          # Prettier
bun run check           # Astro + TypeScript
```

### Security Features

- Rate limiting (5 req/hour per IP)
- Bot detection with honeypot fields
- Spam filtering with keyword detection
- Input sanitization and XSS prevention
- CORS protection and origin validation

## 📈 Performance

### Optimizations

- Code splitting (vendor + animation chunks)
- Image optimization with Astro's `<Image>`
- CSS minification with LightningCSS
- Prefetch strategy for viewport-based loading
- Bundle analysis with vite-bundle-visualizer

### Monitoring

- Umami analytics for performance tracking
- Error tracking and logging
- Core Web Vitals monitoring
- Form conversion funnel analysis

## 🔄 Development Workflow

### Branch Strategy

```
master (production) ← feature/* → dev (testing)
```

### Commit Convention

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation
- `refactor:` Code restructuring
- `perf:` Performance improvements

### Code Standards

- TypeScript strict mode (no `any`)
- ESLint compliance required
- Prettier formatting enforced
- WCAG accessibility compliance

## 🌐 Deployment

### Production Environment

- Coolify for deployment automation
- Environment variables secured
- HTTPS enforcement
- CDN integration for assets

### Health Monitoring

```bash
# Health check endpoint
curl https://moura.ar/api/health
```

## 📞 Support & Resources

### External Documentation

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS v4](https://tailwindcss.com)
- [N8N Documentation](https://docs.n8n.io)
- [Umami Analytics](https://umami.is)

### Project Links

- **Live Site**: [moura.ar](https://moura.ar)
- **Analytics**: [analytics.moura.ar](https://analytics.moura.ar)
- **N8N Instance**: [n8n.moura.ar](https://n8n.moura.ar)

---

## 📋 Documentation Checklist

- ✅ **Project Index** - Complete architecture overview
- ✅ **API Documentation** - Contact form endpoint reference
- ✅ **Component Guide** - All 24+ components documented
- ✅ **Analytics System** - Comprehensive tracking documentation
- ✅ **README Integration** - Links to quick start guide
- ✅ **TODO Integration** - Project roadmap reference

**Documentation Version**: 1.0.0  
**Last Updated**: 2025-07-31  
**Coverage**: 100% of project components and APIs
