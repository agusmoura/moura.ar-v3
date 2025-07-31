# Available Commands

Complete reference for all available npm scripts and development commands.

## Development Commands

### Start Development Server

```bash
# Start development server (localhost only)
bun run dev

# Start with external access (accessible from other devices)
bun run "dev external"
```

**What it does:**

- Starts Astro development server with hot reloading
- Enables TypeScript checking
- Activates Tailwind CSS compilation
- Serves on `http://localhost:4321` (or external IP with external flag)

### Build & Preview

```bash
# Build for production
bun run build

# Preview production build locally
bun run preview

# Build and immediately start production server
bun run "build:test"

# Start production server (after build)
bun run start
```

**Build Process:**

1. TypeScript compilation and type checking
2. Astro component processing
3. Tailwind CSS optimization and purging
4. Asset optimization and bundling
5. Static page pre-rendering
6. Server bundle creation

## Code Quality Commands

### Linting & Formatting

```bash
# Run ESLint for code quality checks
bun run lint

# Format code with Prettier
bun run format

# Run Astro check + TypeScript validation
bun run check
```

**What gets checked:**

- **ESLint**: Code quality, best practices, potential bugs
- **Prettier**: Code formatting consistency
- **TypeScript**: Type safety and compilation errors
- **Astro**: Component syntax and framework-specific issues

### Pre-commit Quality Pipeline

```bash
# Run complete quality check (recommended before commits)
bun run lint && bun run check && bun run test && bun run build
```

## Testing Commands

### Unit Testing

```bash
# Run all tests
bun run test

# Run tests once (CI mode)
bun run test:run

# Run tests with coverage report
bun run test:run --coverage

# Run specific test file
bun run test src/lib/security/__tests__/security.test.ts
```

**Test Framework:**

- **Vitest** - Fast unit testing framework
- **Coverage**: V8 coverage reporting
- **Location**: Tests in `__tests__/` directories or `.test.ts` files

### Test Categories

- **Security Tests**: Input validation, JWT handling, rate limiting
- **Component Tests**: UI component functionality
- **Service Tests**: Business logic validation
- **Integration Tests**: API endpoint testing

## Analysis & Optimization

### Bundle Analysis

```bash
# Analyze bundle size and composition
bun run analyze
```

**Analysis Output:**

- Bundle size breakdown by chunk
- Dependency analysis
- Code splitting visualization
- Performance recommendations

### Performance Monitoring

```bash
# Build with performance monitoring
bun run build

# Check build output for:
# - Bundle sizes
# - Asset optimization
# - Chunk splitting effectiveness
```

## Development Workflow

### Typical Development Session

```bash
# 1. Start development
bun run dev

# 2. Make changes and test
bun run test

# 3. Check code quality
bun run lint
bun run check

# 4. Before committing
bun run format
bun run test:run
bun run build
```

### Git Integration

```bash
# Pre-commit hooks (automatically run)
# - ESLint
# - Prettier
# - TypeScript check

# Manual pre-push checks
bun run test:run && bun run build
```

## Environment-Specific Commands

### Development Environment

```bash
# Hot reloading with file watching
bun run dev

# Debug mode with additional logging
DEBUG=true bun run dev
```

### Production Environment

```bash
# Optimized production build
NODE_ENV=production bun run build

# Start production server
bun run start
```

### CI/CD Pipeline

```bash
# Complete CI pipeline
bun install
bun run lint
bun run check
bun run test:run
bun run build
```

## Specialized Commands

### Astro-Specific

```bash
# Run Astro CLI directly
bun run astro --help

# Generate TypeScript types
bun run astro check

# Add Astro integration
bun run astro add <integration>
```

### Package Management

```bash
# Install dependencies
bun install

# Add new dependency
bun add <package>

# Add development dependency
bun add -D <package>

# Update dependencies
bun update
```

## Troubleshooting Commands

### Common Issues

#### Build Failures

```bash
# Clean build and retry
rm -rf dist node_modules
bun install
bun run build
```

#### TypeScript Errors

```bash
# Regenerate Astro types
rm -rf .astro
bun run dev  # Regenerates types

# Force TypeScript check
bun run check
```

#### Test Failures

```bash
# Run tests with verbose output
bun run test --verbose

# Run specific test with debugging
bun run test --inspect-brk src/path/to/test.ts
```

#### Performance Issues

```bash
# Analyze bundle for optimization opportunities
bun run analyze

# Profile build performance
time bun run build
```

## Command Aliases & Shortcuts

### Custom Shortcuts (add to your shell)

```bash
# Add to ~/.bashrc or ~/.zshrc
alias mdev="bun run dev"
alias mbuild="bun run build"
alias mtest="bun run test"
alias mcheck="bun run lint && bun run check && bun run test"
```

### Package.json Scripts Reference

```json
{
  "scripts": {
    "dev": "bunx --bun astro dev",
    "dev external": "bunx --bun astro dev --host",
    "build": "bunx --bun astro build",
    "start": "node ./dist/server/entry.mjs",
    "preview": "bunx --bun astro preview",
    "build:test": "bunx --bun astro build && bun run start",
    "lint": "eslint .",
    "format": "prettier --write .",
    "check": "astro check && tsc --noEmit",
    "analyze": "bunx --bun vite-bundle-visualizer",
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

## Performance Tips

### Development Optimization

```bash
# Use external flag only when needed (slower startup)
bun run dev  # Faster for local-only development
bun run "dev external"  # When testing on other devices

# Skip type checking during development (faster)
# (TypeScript checking still runs in IDE)
```

### Build Optimization

```bash
# Production build with maximum optimization
NODE_ENV=production bun run build

# Parallel testing and building
bun run test:run & bun run build
```

## Next Steps

- **[Environment Setup](../setup/environment.md)** - Configure environment variables
- **[Development Conventions](../development/conventions.md)** - Learn coding standards
- **[Architecture Guide](../development/architecture.md)** - Understand the codebase
- **[Testing Guide](../development/testing.md)** - Learn testing practices

## Related Documentation

- **[Installation Guide](../setup/installation.md)** - Set up development environment
- **[Component Guide](../development/components.md)** - UI component development
- **[API Documentation](../api/contact-form.md)** - API endpoint testing
- **[Git Workflow](../contributing/git-workflow.md)** - Version control commands
- **[Onboarding Guide](../contributing/onboarding.md)** - Developer workflow overview
