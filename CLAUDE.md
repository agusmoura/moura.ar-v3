# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Moura.ar v3**, a personal portfolio website built with Astro v5, featuring a contact form with N8N integration and JWT authentication. The site includes space-themed animations, project showcases, and comprehensive UTM tracking.

## Technology Stack

- **Framework**: Astro v5 (SSR with Node.js adapter)
- **Styling**: Tailwind CSS v4 (new CSS-based system)
- **Runtime**: Bun (NOT npm, yarn, or pnpm)
- **Language**: TypeScript with strict configuration
- **Contact Form**: N8N integration with JWT authentication
- **Animations**: Custom space-themed background effects
- **Bundle Analysis**: vite-bundle-visualizer

## Tailwind Configuration

- Este proyecto usa Tailwind 4. No utiliza la configuracion de tailwind config. Todo se condfigura desde css

## Essential Commands

```bash
# Development
bun run dev              # Start development server
bun run "dev external"   # Start dev server with external access

# Code Quality
bun run lint             # Run ESLint
bun run format           # Format code with Prettier
bun run check            # Run Astro check + TypeScript check

# Build & Deploy
bun run build            # Build for production
bun run preview          # Preview production build
bun run "build:test"     # Build and start server
bun run start            # Start production server

# Analysis
bun run analyze          # Analyze bundle size
```

## Runtime Requirements

**CRITICAL**: Always use Bun as the runtime:
- Install dependencies: `bun add` or `bun add -D`
- Run binaries: `bunx --bun <command>`
- NEVER use `npm`, `yarn`, `pnpm`, or `npx`

## Project Structure

```
src/
├── components/
│   ├── effects/       # Space-themed animations
│   ├── sections/      # Main page sections
│   ├── seo/          # SEO components
│   └── ui/           # UI components
├── content/
│   └── projects/     # Project MDX files
├── layouts/          # Page layouts
├── pages/
│   ├── api/          # API routes (contact form)
│   └── projects/     # Project pages
├── styles/           # Global CSS
├── types/            # TypeScript definitions
└── utils/            # Utility functions
```

## TypeScript Configuration

The project uses strict TypeScript with path aliases:
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@layouts/*` → `src/layouts/*`
- `@pages/*` → `src/pages/*`
- `@styles/*` → `src/styles/*`
- `@assets/*` → `src/assets/*`
- `@types/*` → `src/types/*`

## Key Features

### Contact Form API (`src/pages/api/contact.ts`)
- JWT authentication with N8N webhook
- Comprehensive validation and sanitization
- Bot detection with honeypot fields
- UTM parameter tracking
- Spam keyword filtering

### Space Background Effects
- Custom particle system with gravity simulation
- Mouse interaction effects
- Configurable star density and animation speeds
- Performance-optimized rendering

### Project Content System
- MDX-based project files in `src/content/projects/`
- Dynamic routing via `[slug].astro`
- Rich metadata support

## Environment Variables

Required for contact form:
```bash
N8N_WEBHOOK_URL=https://n8n.moura.ar/webhook-test/moura-contact-form
N8N_JWT_SECRET=your-jwt-secret-phrase
```

Optional:
```bash
PUBLIC_ENABLE_ANALYTICS=false
```

## Development Standards

### Commit Messages
Follow conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes  
- `docs:` - Documentation changes
- `style:` - Code formatting
- `refactor:` - Code restructuring
- `perf:` - Performance improvements
- `test:` - Testing
- `build:` - Build system changes
- `ci:` - CI configuration
- `chore:` - Maintenance tasks

### Code Quality
- All code must pass `bun run lint` and `bun run check`
- Use TypeScript strict mode - no `any` types
- Prefer `.astro` components over framework-specific components
- Always use Bun for package management and script execution

### Performance Considerations
- Images optimized with Astro's `<Image>` component
- Manual chunk splitting for vendor and animation code
- CSS minification with LightningCSS
- Console/debugger statements removed in production builds

## Testing

```bash
# Health check endpoint
curl http://localhost:4321/api/health

# Contact form testing
curl -X POST http://localhost:4321/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message"}'
```

## Common Issues

1. **Bundle Analysis**: Use `bun run analyze` to inspect bundle size
2. **Development Server**: Use `bun run "dev external"` for external device access
3. **TypeScript Errors**: Run `bun run check` before committing
4. **Contact Form**: Ensure N8N environment variables are set

## Architecture Notes

- **SSR Configuration**: Uses Node.js adapter in standalone mode
- **Routing**: File-based routing with dynamic project pages
- **State Management**: Minimal client-side JavaScript, mostly server-rendered
- **SEO**: Comprehensive meta tags and Rich Results implementation
- **Performance**: Prefetch strategy enabled for viewport-based loading

## Analytics Configuration

- The site does not use Google Analytics
- Using a self-hosted Umami analytics server located at https://analytics.moura.ar/
- Tracking script for this site: `<script defer src="https://analytics.moura.ar/script.js" data-website-id="388f61d9-d676-4279-a193-9e87a38e3c4b"></script>`