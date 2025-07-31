# Documentation Hub

Welcome to the Moura.ar v3 documentation! This guide will help you find the information you need.

## 📚 Documentation Structure

### 🚀 Getting Started

- **[Installation Guide](./setup/installation.md)** - Set up your development environment
- **[Environment Configuration](./setup/environment.md)** - Configure environment variables and settings

### 📖 Usage Guides

- **[Available Commands](./usage/commands.md)** - Complete command reference
- **[Analytics System](./usage/analytics.md)** - Analytics configuration and usage

### 🔌 API Reference

- **[Contact Form API](./api/contact-form.md)** - Contact form endpoint documentation

### 🏗️ Development

- **[Architecture Guide](./development/architecture.md)** - System design and principles
- **[Development Conventions](./development/conventions.md)** - Coding standards and patterns
- **[Component Guide](./development/components.md)** - UI component documentation
- **[Testing Guide](./development/testing.md)** - Testing strategies and examples

### 🤝 Contributing

- **[Developer Onboarding](./contributing/onboarding.md)** - Getting started as a developer
- **[Git Workflow](./contributing/git-workflow.md)** - Git hooks and workflow guidelines

### 📋 Architecture Decisions

- **[ADR-001: Architecture Refactor](./adr/001-architecture-refactor.md)** - Layered architecture decision

## 🎯 Quick Navigation

**I want to...**

- **Get started quickly** → [Installation Guide](./setup/installation.md)
- **Understand the architecture** → [Architecture Guide](./development/architecture.md)
- **Learn coding conventions** → [Development Conventions](./development/conventions.md)
- **Work with the contact form** → [Contact Form API](./api/contact-form.md)
- **Set up analytics** → [Analytics System](./usage/analytics.md)
- **Contribute to the project** → [Developer Onboarding](./contributing/onboarding.md)

## 📊 Project Overview

**Moura.ar v3** is a modern personal portfolio built with:

- **Astro v5** with SSR
- **Tailwind CSS v4**
- **TypeScript** strict mode
- **Layered Architecture** with clear separation of concerns
- **Comprehensive Testing** with Vitest
- **N8N Integration** for contact form automation

### Architecture Highlights

```
src/
├── lib/         # Core utilities & libraries
├── services/    # Business logic layer
├── core/        # Application foundation
├── components/  # UI components (Astro)
└── pages/       # Routes & API endpoints
```

## 🔍 Finding Information

### By Role

- **Frontend Developer** → [Components](./development/components.md), [Conventions](./development/conventions.md)
- **Backend Developer** → [Architecture](./development/architecture.md), [API Reference](./api/contact-form.md)
- **DevOps Engineer** → [Environment Setup](./setup/environment.md), [Git Workflow](./contributing/git-workflow.md)
- **Project Manager** → [Architecture Overview](./development/architecture.md), [Testing Guide](./development/testing.md)

### By Task

- **Setting up locally** → [Installation](./setup/installation.md) → [Environment](./setup/environment.md)
- **Making changes** → [Conventions](./development/conventions.md) → [Testing](./development/testing.md)
- **Deploying** → [Commands](./usage/commands.md) → [Environment](./setup/environment.md)
- **Understanding codebase** → [Architecture](./development/architecture.md) → [Components](./development/components.md)

## 📝 Documentation Standards

All documentation follows these principles:

- **Actionable** - Clear steps and examples
- **Current** - Updated with latest changes
- **Organized** - Logical structure and navigation
- **Accessible** - Easy to find and understand

### Last Updated

- **Architecture**: 2025-07-31 (v3.1 refactor)
- **Components**: 2025-07-31 (current structure)
- **API**: 2025-07-31 (latest endpoints)

---

**Need help?** Check the [Onboarding Guide](./contributing/onboarding.md) or refer to the specific documentation section above.
