# Git Hooks Setup Documentation

## Overview

This project uses Husky v9 for Git hooks management with the following configuration:

## Installation & Setup

### Prerequisites

- Bun runtime (installed at `~/.bun/bin/bun`)
- Git repository initialized

### Initial Setup

```bash
# Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Install project dependencies
bun install

# Initialize git hooks (done automatically via "prepare" script)
bun run prepare
```

## Git Hooks Configuration

### Pre-commit Hook (`.husky/pre-commit`)

Runs before each commit to ensure code quality:

1. **Format Code**: `bun run format` - Formats code using Prettier (blocks commit on failure)
2. **Lint Code**: `bun run lint --max-warnings=50` - Runs ESLint (allows up to 50 warnings)
3. **Type Check**: `bun run check` - Validates TypeScript and Astro types (allows warnings, shows info)

### Commit Message Hook (`.husky/commit-msg`)

Validates commit messages follow conventional commit format:

- Uses `@commitlint/config-conventional` rules
- Enforces commit types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- Maximum header length: 80 characters
- No sentence case or punctuation at end

**Valid examples:**

```
feat: add contact form validation
fix: resolve mobile navigation issue
docs: update API documentation
```

**Invalid examples:**

```
Add contact form (missing type)
feat: Add contact form. (has punctuation)
FEAT: add form (wrong case)
```

### Pre-push Hook (`.husky/pre-push`)

Runs before pushing to remote to ensure quality:

1. **Run Tests**: `bun run test:run` - Executes all test suites
2. **Build Project**: `bun run build` - Ensures project builds successfully

## Troubleshooting

### Common Issues

1. **"bun: command not found"** ✅ **FIXED**

   - All git hooks now include `export PATH="$HOME/.bun/bin:$PATH"`
   - If still failing, try:

   ```bash
   # Reload bash profile
   source ~/.bashrc
   # Or manually add to PATH
   export PATH="$HOME/.bun/bin:$PATH"
   ```

2. **"commitlint: command not found"**

   - Uses local installation: `./node_modules/.bin/commitlint`
   - Ensure dependencies are installed: `bun install`

3. **Permission denied errors**

   ```bash
   chmod +x .husky/pre-commit .husky/commit-msg .husky/pre-push
   ```

4. **Line ending issues (Windows)**
   ```bash
   sed -i 's/\r$//' .husky/pre-commit .husky/commit-msg .husky/pre-push
   ```

### Manual Testing

Test hooks individually:

```bash
# Test pre-commit hook
./.husky/pre-commit

# Test commit-msg hook (valid)
echo "feat: test message" > temp_msg.txt
./.husky/commit-msg temp_msg.txt
rm temp_msg.txt

# Test commit-msg hook (invalid)
echo "invalid message" > temp_msg.txt
./.husky/commit-msg temp_msg.txt  # Should fail
rm temp_msg.txt

# Test pre-push hook
./.husky/pre-push
```

### Bypassing Hooks (Emergency Only)

```bash
# Skip pre-commit and commit-msg hooks
git commit --no-verify -m "emergency: critical fix"

# Skip pre-push hook
git push --no-verify
```

## Best Practices

1. **Fix Issues Before Committing**: Address linting and type errors before committing
2. **Write Quality Commit Messages**: Follow conventional commit format
3. **Test Locally**: Run tests before pushing to avoid CI failures
4. **Don't Skip Hooks**: Only use `--no-verify` in true emergencies

## Configuration Files

- **Husky Config**: `package.json` - "prepare" script initializes hooks
- **Commitlint Config**: `commitlint.config.js` - Conventional commit rules
- **ESLint Config**: `eslint.config.js` - Code quality rules
- **Prettier Config**: `.prettierrc.json` - Code formatting rules

## Git Configuration

The project uses:

- **Hooks Path**: `.husky` (configured via `git config core.hooksPath .husky`)
- **Hook Templates**: Located in `.husky/_/`

## Maintenance

### Updating Husky

```bash
bun update husky
bun run prepare  # Reinitialize hooks
```

### Adding New Hooks

```bash
echo "#!/usr/bin/env sh\necho 'New hook'" > .husky/new-hook
chmod +x .husky/new-hook
```
