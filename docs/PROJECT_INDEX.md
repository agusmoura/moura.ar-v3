# Moura.ar v3 - Project Documentation Index

## 🎯 Project Overview

**Moura.ar v3** is a modern, high-performance personal portfolio website built with cutting-edge web technologies. It features a space-themed design, comprehensive analytics, and a sophisticated contact form system with N8N integration.

### Key Features

- ⚡ **Blazing Fast**: Built with Astro v5 for optimal performance
- 🎨 **Space-Themed Design**: Custom particle animations and orbital effects
- 📊 **Advanced Analytics**: Self-hosted Umami with comprehensive tracking
- 📧 **Smart Contact Form**: JWT-secured N8N integration with anti-spam
- 🌍 **i18n Ready**: Prepared for multi-language support
- ♿ **Accessibility First**: WCAG compliant with screen reader support
- 🔒 **Security Focused**: Rate limiting, CORS protection, and input sanitization

## 📁 Project Structure

```
moura.ar-v3/
├── 📄 Documentation Files
│   ├── README.md               # Quick start guide
│   ├── CLAUDE.md              # AI assistant guidelines
│   ├── ANALYTICS.md           # Analytics system documentation
│   └── TODO.md                # Project roadmap and tasks
│
├── 🗂️ src/
│   ├── 🧩 components/         # Reusable UI components
│   │   ├── accessibility/    # A11y components
│   │   ├── analytics/        # Umami integration
│   │   ├── effects/          # Space animations
│   │   ├── sections/         # Page sections
│   │   ├── seo/             # SEO components
│   │   └── ui/              # UI elements
│   │
│   ├── 📝 content/           # Content management
│   │   └── projects/        # Project MDX files
│   │
│   ├── 🖼️ layouts/          # Page templates
│   │
│   ├── 📄 pages/            # Routes and endpoints
│   │   ├── api/            # API endpoints
│   │   └── projects/       # Project pages
│   │
│   ├── 🔧 utils/            # Utility functions
│   ├── 📐 schemas/          # Validation schemas
│   ├── 🎨 styles/           # Global styles
│   └── 🔤 types/            # TypeScript definitions
│
└── ⚙️ Configuration
    ├── astro.config.mjs     # Astro configuration
    ├── tailwind.config.js   # Tailwind CSS v4
    ├── tsconfig.json        # TypeScript config
    └── package.json         # Dependencies

```

## 🚀 Technology Stack

### Core Framework

- **Astro v5**: Static site generator with SSR support
- **Node.js Adapter**: Server-side rendering in standalone mode
- **Bun Runtime**: Fast JavaScript runtime and package manager

### Styling & UI

- **Tailwind CSS v4**: Utility-first CSS framework (CSS-based config)
- **OKLCH Color Space**: Advanced color system for consistency
- **Custom Animations**: Space-themed particle effects and orbits

### Development Tools

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Vitest**: Testing framework

### External Integrations

- **N8N Webhook**: Contact form automation
- **JWT Authentication**: Secure API communication
- **Umami Analytics**: Privacy-focused analytics platform

## 📋 Commands Reference

### Development

```bash
bun run dev              # Start dev server (localhost:4321)
bun run "dev external"   # Dev server with network access
```

### Quality & Testing

```bash
bun run lint            # Run ESLint
bun run format          # Format with Prettier
bun run check           # Astro + TypeScript checks
bun run test            # Run all tests
bun run test:contact    # Test contact form specifically
```

### Build & Deploy

```bash
bun run build           # Production build
bun run preview         # Preview production build
bun run "build:test"    # Build and start server
bun run start           # Start production server
bun run analyze         # Bundle size analysis
```

## 🔧 Configuration

### Environment Variables

```bash
# Required for Contact Form
N8N_WEBHOOK_URL=https://n8n.moura.ar/webhook-test/moura-contact-form
N8N_JWT_SECRET=your-jwt-secret-phrase

# Optional Analytics
PUBLIC_ENABLE_ANALYTICS=false
```

### TypeScript Path Aliases

```typescript
@/*           → src/*
@components/* → src/components/*
@layouts/*    → src/layouts/*
@pages/*      → src/pages/*
@styles/*     → src/styles/*
@assets/*     → src/assets/*
@types/*      → src/types/*
```

## 🏗️ Architecture

### Rendering Strategy

- **SSR Mode**: Server-side rendering with Node.js adapter
- **Prefetch**: Viewport-based prefetching for optimal performance
- **Image Optimization**: Astro's `<Image>` component with automatic optimization

### Component Architecture

- **Astro Components**: Preferred for static content
- **TypeScript**: Full type safety across the application
- **MDX Support**: Rich content with component integration

### Performance Optimizations

- **Code Splitting**: Manual vendor and animation chunks
- **CSS Minification**: LightningCSS for optimal output
- **Console Stripping**: Debug statements removed in production
- **Bundle Analysis**: vite-bundle-visualizer integration

## 🔒 Security Features

### Contact Form Protection

- **Rate Limiting**: 5 requests per hour per IP
- **Honeypot Fields**: Bot detection mechanism
- **Spam Filtering**: Keyword and pattern detection
- **Input Sanitization**: XSS prevention
- **CORS Protection**: Origin validation

### API Security

- **JWT Authentication**: Secure N8N communication
- **HTTPS Only**: Enforced in production
- **Error Handling**: Safe error messages without leaking internals

## 📊 Analytics System

### Tracked Metrics

- **Form Interactions**: Field focus, errors, completion time
- **Navigation**: Scroll depth, time on page, click tracking
- **Conversions**: Contact form submissions, CV downloads
- **Performance**: Page load times, error tracking

### Privacy Compliance

- ✅ GDPR Compliant
- ✅ Cookie-free tracking
- ✅ Self-hosted solution
- ✅ Anonymous data only

## 🎨 Design System

### Color Palette (OKLCH)

- **Primary Colors**: Space-themed gradients
- **Accent Colors**: High contrast for accessibility
- **Dark Mode**: Full dark theme support

### Typography

- **Font Stack**: System fonts for performance
- **Responsive Sizing**: Fluid typography scale
- **Readability**: Optimized line heights and spacing

### Animations

- **Space Background**: Particle system with gravity
- **Orbital Effects**: Planet and tech stack orbits
- **Scroll Animations**: Intersection Observer based
- **Performance**: GPU-accelerated transforms

## 🔄 Development Workflow

### Branch Strategy

```
master (production) ← feature/* → dev (testing)
```

### Commit Convention

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `perf:` Performance improvements
- `test:` Testing
- `build:` Build system
- `ci:` CI configuration
- `chore:` Maintenance

### Code Quality Standards

- TypeScript strict mode (no `any`)
- ESLint compliance required
- Prettier formatting enforced
- Test coverage for critical paths

## 📚 Additional Resources

### Documentation

- [README.md](../README.md) - Quick start guide
- [CLAUDE.md](../CLAUDE.md) - AI assistant instructions
- [ANALYTICS.md](../ANALYTICS.md) - Analytics implementation
- [TODO.md](../TODO.md) - Project roadmap

### External Links

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS v4](https://tailwindcss.com)
- [N8N Documentation](https://docs.n8n.io)
- [Umami Analytics](https://umami.is)

---

**Last Updated**: 2025-07-31
**Version**: 3.0.0
**Maintainer**: Agustín Moura
