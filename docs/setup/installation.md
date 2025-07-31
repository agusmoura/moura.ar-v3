# Installation Guide

## Prerequisites

- **Bun** - Fast runtime and package manager ([Install Bun](https://bun.sh/))
- **Node.js 18+** - For compatibility
- **Git** - Version control

## Quick Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd moura.ar-v3
```

### 2. Install Dependencies

```bash
# Always use Bun (not npm, yarn, or pnpm!)
bun install
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit with your values
nano .env
```

### 4. Start Development Server

```bash
bun run dev
```

Visit `http://localhost:4321` to see your application running!

## Detailed Setup

### Development Environment

#### Required Tools

- **Bun** - Primary runtime and package manager
- **TypeScript** - Already configured with strict mode
- **ESLint** - Code quality checking
- **Prettier** - Code formatting

#### Recommended IDE Setup

- **VS Code** with these extensions:
  - Astro
  - TypeScript and JavaScript Language Features
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense

#### IDE Configuration

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[astro]": {
    "editor.defaultFormatter": "astro-build.astro-vscode"
  },
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "astro.typescript.verbatimModuleSyntax": true
}
```

### Project Structure Overview

Once installed, you'll have this structure:

```
moura.ar-v3/
├── src/
│   ├── lib/         # Core utilities & libraries
│   ├── services/    # Business logic services
│   ├── core/        # Application foundation
│   ├── components/  # UI components (Astro)
│   ├── pages/       # Routes & API endpoints
│   └── content/     # Content collections (MDX)
├── docs/            # Documentation (you're here!)
├── public/          # Static assets
└── package.json     # Dependencies and scripts
```

### Verify Installation

Run these commands to ensure everything is working:

```bash
# Check TypeScript compilation
bun run check

# Run linting
bun run lint

# Run tests
bun run test

# Build project
bun run build
```

All commands should complete without errors.

## Troubleshooting

### Common Issues

#### Bun Not Found

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Restart shell or reload PATH
source ~/.bashrc  # or ~/.zshrc
```

#### Port Already in Use

```bash
# Use different port
bun run dev --port 3000

# Or kill process using port 4321
lsof -ti:4321 | xargs kill -9
```

#### TypeScript Errors

```bash
# Clear cache and reinstall
rm -rf node_modules bun.lockb
bun install

# Regenerate TypeScript types
bun run dev  # This generates .astro/types.d.ts
```

#### Build Failures

```bash
# Clean build directory
rm -rf dist

# Check for TypeScript errors
bun run check

# Try build again
bun run build
```

### Environment-Specific Setup

#### Windows Users

- Use WSL2 for better compatibility
- Ensure proper line endings: `git config core.autocrlf false`

#### macOS Users

- Install Xcode Command Line Tools: `xcode-select --install`
- Use Homebrew for additional tools if needed

#### Linux Users

- Ensure you have build essentials: `sudo apt-get install build-essential`

## Next Steps

After successful installation:

1. **[Configure Environment](./environment.md)** - Set up environment variables
2. **[Learn Available Commands](../usage/commands.md)** - Essential development commands
3. **[Read Architecture Guide](../development/architecture.md)** - Understand the codebase structure
4. **[Check Onboarding Guide](../contributing/onboarding.md)** - Developer workflow and conventions

## Need Help?

- Check the [troubleshooting section](#troubleshooting) above
- Review [common commands](../usage/commands.md)
- Read the [onboarding guide](../contributing/onboarding.md)
- Check existing [GitHub issues](https://github.com/your-repo/issues)
