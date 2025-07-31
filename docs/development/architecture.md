# Architecture Documentation

## Overview

Moura.ar v3 follows a **layered architecture** with clear separation of concerns, organized into logical modules that promote maintainability, testability, and scalability.

## Architecture Principles

### 1. **Separation of Concerns**
- **UI Layer**: Components focused solely on presentation
- **Business Logic**: Services handling domain operations  
- **Infrastructure**: Libraries providing technical capabilities
- **Core**: Application-wide utilities and configuration

### 2. **Dependency Flow**
```
UI Components → Services → Libraries → Core
     ↓              ↓          ↓        ↓
  Presentation → Business → Technical → Foundation
```

### 3. **Import Strategy**
- **Path Aliases**: Clean imports using `@lib/*`, `@services/*`, `@core/*`
- **No Circular Dependencies**: Strict unidirectional dependency flow
- **Framework Integration**: Astro-first with TypeScript strict mode

## Folder Structure

```
src/
├── components/           # UI Components (Astro)
│   ├── accessibility/   # A11y components  
│   ├── analytics/       # Analytics integration
│   ├── effects/         # Visual effects & animations
│   ├── sections/        # Page sections
│   ├── seo/            # SEO & metadata components
│   └── ui/             # Reusable UI components
├── lib/                 # 🆕 Core Libraries
│   ├── analytics/      # Analytics utilities
│   ├── cache/          # Multi-layer caching system
│   ├── logger/         # Structured logging
│   ├── security/       # Security utilities & JWT
│   └── validation/     # Input validation & parsing
├── services/           # 🆕 Business Logic
│   ├── analytics/      # Analytics service layer
│   ├── contact/        # Contact form business logic
│   └── content/        # Content management
├── core/               # 🆕 Application Foundation
│   ├── config/         # Configuration management
│   ├── container/      # Dependency injection
│   └── types/          # Core type definitions
├── pages/              # Astro pages & API routes
├── content/            # Content collections (MDX)
├── layouts/            # Page layouts
├── schemas/            # Zod validation schemas
├── types/              # Domain type definitions
├── data/               # Static data
└── styles/             # Global CSS
```

## Layer Responsibilities

### **UI Components (`components/`)**
- **Purpose**: Presentation layer
- **Responsibilities**: 
  - Render UI elements
  - Handle user interactions
  - Compose layouts
- **Dependencies**: Can import from `@lib/*`, `@services/*`, `@types/*`
- **Rules**: 
  - No business logic
  - Props-based configuration
  - Accessibility-first design

### **Libraries (`lib/`)**
- **Purpose**: Reusable technical utilities
- **Responsibilities**:
  - Cross-cutting concerns (logging, caching, security)
  - Framework-agnostic utilities
  - Performance optimizations
- **Dependencies**: Only other `@lib/*` modules and external packages
- **Rules**:
  - Pure functions when possible
  - Well-tested and documented
  - No UI or business logic

### **Services (`services/`)**
- **Purpose**: Business logic layer
- **Responsibilities**:
  - Domain operations
  - Data transformation
  - Integration with external APIs
- **Dependencies**: Can import from `@lib/*`, `@core/*`, schemas
- **Rules**:
  - Single responsibility per service
  - Error handling and validation
  - Interface-based design

### **Core (`core/`)**
- **Purpose**: Application foundation
- **Responsibilities**:
  - Configuration management
  - Dependency injection
  - Core type definitions
- **Dependencies**: Minimal - only external packages
- **Rules**:
  - Framework-agnostic
  - Environment-aware
  - Singleton patterns where appropriate

## Design Patterns

### **Dependency Injection**
```typescript
// core/container/ServiceContainer.ts
export interface ServiceContainer {
  cache: CacheManager
  logger: Logger
  analytics: AnalyticsService
}
```

### **Strategy Pattern**
```typescript
// lib/cache/CacheManager.ts
export enum CacheLevel {
  MEMORY = 'memory',
  LOCAL_STORAGE = 'localStorage', 
  SESSION_STORAGE = 'sessionStorage'
}
```

### **Factory Pattern**
```typescript
// lib/logger/Logger.ts
export function createLogger(component: string): Logger {
  return logger.child(component)
}
```

## Performance Considerations

### **Caching Strategy**
- **Memory Cache**: Fast access for frequently used data
- **Local Storage**: Persistent cache across sessions
- **Session Storage**: Temporary cache for current session

### **Bundle Optimization**
- **Code Splitting**: Manual chunks for vendor and animation code
- **Tree Shaking**: ES modules for optimal bundle size
- **Asset Optimization**: Image optimization with Astro's Image component

### **Loading Strategy**
- **Critical Path**: Inline critical CSS and JS
- **Progressive Enhancement**: Layer non-critical features
- **Prefetching**: Intelligent prefetching for navigation

## Security Architecture

### **Authentication Flow**
```
Client → Contact Form → JWT Creation → N8N Webhook → Processing
```

### **Input Validation**
- **Client-Side**: Basic validation for UX
- **Server-Side**: Comprehensive validation with Zod schemas
- **Sanitization**: XSS protection and input cleaning

### **Security Headers**
- Content Security Policy (CSP)
- CORS configuration
- Rate limiting for API endpoints

## Testing Strategy

### **Unit Tests**
- **Libraries**: Comprehensive testing of utility functions
- **Services**: Business logic validation
- **Components**: Accessibility and functionality testing

### **Integration Tests**
- **API Routes**: End-to-end request/response testing
- **Form Workflows**: Complete user journey testing

### **Performance Tests**
- **Bundle Size**: Automated bundle analysis
- **Load Times**: Core Web Vitals monitoring
- **Memory Usage**: Cache efficiency testing

## Migration & Evolution

### **Completed Refactoring (v3.1)**
- ✅ Moved `utils/` → `lib/` for better organization
- ✅ Moved `infrastructure/` → `lib/` for consistency  
- ✅ Created `services/` layer for business logic
- ✅ Established `core/` for application foundation
- ✅ Updated all import paths and configurations

### **Future Considerations**
- **Micro-frontends**: Potential for component federation
- **API Gateway**: Centralized API management
- **Event-Driven Architecture**: Publish/subscribe patterns
- **GraphQL Integration**: Unified data layer

## Conventions

### **Naming Conventions**
- **Files**: kebab-case for components, camelCase for utilities
- **Directories**: lowercase with hyphens
- **Exports**: Named exports preferred, default for single export

### **Import Order**
1. External packages
2. Astro framework imports  
3. Internal imports (by layer: `@core`, `@lib`, `@services`, `@components`)
4. Relative imports (avoid when possible)

### **Error Handling**
- **Libraries**: Return Result types or throw typed errors
- **Services**: Handle and transform errors appropriately
- **Components**: Display user-friendly error messages
- **API Routes**: Return appropriate HTTP status codes

## Documentation Standards

### **Code Documentation**
- **JSDoc**: Comprehensive function and class documentation
- **Type Definitions**: Self-documenting TypeScript interfaces
- **README Files**: Module-level documentation for complex areas

### **Architecture Documentation**
- **ADRs**: Architecture Decision Records for major changes
- **Migration Guides**: Step-by-step upgrade instructions
- **API Documentation**: OpenAPI specs for public endpoints

This architecture provides a solid foundation for scaling the application while maintaining code quality, developer experience, and performance.