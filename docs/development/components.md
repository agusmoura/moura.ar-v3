# Component Guide - Moura.ar v3

## Overview

This guide documents all components in the Moura.ar v3 portfolio, their props, usage patterns, and integration examples.

## Component Categories

### 📊 Analytics Components

#### `UmamiTracker`

**Location**: `src/components/analytics/UmamiTracker.astro`
**Purpose**: Integrates Umami analytics tracking script
**Usage**: Included in main Layout

```astro
<UmamiTracker />
```

### ♿ Accessibility Components

#### `SkipLink`

**Location**: `src/components/accessibility/SkipLink.astro`
**Purpose**: Provides keyboard navigation skip to main content
**Props**: None

```astro
<SkipLink />
```

#### `ScreenReaderOnly`

**Location**: `src/components/accessibility/ScreenReaderOnly.astro`
**Purpose**: Visually hidden content for screen readers
**Props**: None

```astro
<ScreenReaderOnly>
  <span>Additional context for screen readers</span>
</ScreenReaderOnly>
```

#### `FocusManager`

**Location**: `src/components/accessibility/FocusManager.astro`
**Purpose**: Manages keyboard focus and navigation
**Props**: None

### 🌌 Effect Components

#### `SpaceBackground`

**Location**: `src/components/effects/SpaceBackground.astro`
**Purpose**: Animated space background with stars and physics
**Props**:

| Prop                   | Type    | Default | Description                     |
| ---------------------- | ------- | ------- | ------------------------------- |
| `starDensity`          | number  | 0.00008 | Stars per pixel                 |
| `allStarsTwinkle`      | boolean | true    | Enable star twinkling           |
| `twinkleProbability`   | number  | 0.7     | Chance of star twinkling        |
| `minTwinkleSpeed`      | number  | 0.5     | Minimum twinkle animation speed |
| `maxTwinkleSpeed`      | number  | 1       | Maximum twinkle animation speed |
| `shootingStarsEnabled` | boolean | false   | Enable shooting stars           |
| `gravityEnabled`       | boolean | false   | Enable gravity simulation       |
| `mouseGravityEnabled`  | boolean | false   | Enable mouse gravity effect     |

```astro
<SpaceBackground starDensity={0.0001} shootingStarsEnabled={true} mouseGravityEnabled={true} />
```

#### `HeroOrbit`

**Location**: `src/components/effects/HeroOrbit.astro`
**Purpose**: Orbital animation effect for hero section
**Props**: None

```astro
<HeroOrbit />
```

#### `PlanetOrbit`

**Location**: `src/components/effects/PlanetOrbit.astro`
**Purpose**: Planet orbital animation effect
**Props**: None

#### `TechStackOrbit`

**Location**: `src/components/effects/TechStackOrbit.astro`
**Purpose**: Orbital display of technology stack icons
**Props**: None

#### `ScrollAnimations`

**Location**: `src/components/effects/ScrollAnimations.astro`
**Purpose**: Manages scroll-triggered animations
**Props**: None

### 📑 Section Components

#### `Hero`

**Location**: `src/components/sections/Hero.astro`
**Purpose**: Main hero section with title and tagline
**Props**: None
**Features**:

- Responsive typography
- AOS animations
- Integrated HeroOrbit effect

```astro
<Hero />
```

#### `HeroAlt`

**Location**: `src/components/sections/HeroAlt.astro`
**Purpose**: Alternative hero section layout
**Props**: None

#### `About`

**Location**: `src/components/sections/About.astro`
**Purpose**: About section with personal information
**Props**: None
**Features**:

- Philosophy cards
- Personal carousel
- Tech stack orbit

#### `Projects`

**Location**: `src/components/sections/Projects.astro`
**Purpose**: Project showcase section
**Props**: None
**Features**:

- Dynamic project loading from content
- Bento grid layout
- Project filtering

#### `Contact`

**Location**: `src/components/sections/Contact.astro`
**Purpose**: Contact form section
**Props**: None
**Features**:

- Form validation
- Project type selection
- Budget selection
- UTM tracking
- Anti-spam measures

### 🔍 SEO Components

#### `SEO`

**Location**: `src/components/seo/SEO.astro`
**Purpose**: Meta tags and SEO optimization
**Props**:

| Prop          | Type   | Required | Description      |
| ------------- | ------ | -------- | ---------------- |
| `title`       | string | ❌       | Page title       |
| `description` | string | ❌       | Page description |
| `image`       | string | ❌       | OG image URL     |
| `canonical`   | string | ❌       | Canonical URL    |

```astro
<SEO title="Portfolio - Agustín Moura" description="Full-stack developer and UX/UI designer" />
```

#### `RichResults`

**Location**: `src/components/seo/RichResults.astro`
**Purpose**: Structured data for search engines
**Props**: None

### 🎨 UI Components

#### `AnimatedLogo`

**Location**: `src/components/ui/AnimatedLogo.astro`
**Purpose**: Animated brand logo
**Props**: None

#### `BentoProjectCard`

**Location**: `src/components/ui/BentoProjectCard.astro`
**Purpose**: Project card for bento grid layout
**Props**:

| Prop          | Type     | Required | Description           |
| ------------- | -------- | -------- | --------------------- |
| `title`       | string   | ✅       | Project title         |
| `description` | string   | ✅       | Project description   |
| `slug`        | string   | ✅       | Project URL slug      |
| `featured`    | boolean  | ❌       | Featured project flag |
| `image`       | string   | ❌       | Project image URL     |
| `tags`        | string[] | ❌       | Technology tags       |

```astro
<BentoProjectCard
  title="E-commerce Platform"
  description="Modern online store"
  slug="ecommerce-project"
  featured={true}
  tags={['React', 'Node.js', 'MongoDB']}
/>
```

#### `ProjectCard`

**Location**: `src/components/ui/ProjectCard.astro`
**Purpose**: Standard project card component
**Props**: Similar to BentoProjectCard

#### `PhilosophyCard`

**Location**: `src/components/ui/PhilosophyCard.astro`
**Purpose**: Card displaying work philosophy principles
**Props**:

| Prop          | Type   | Required | Description            |
| ------------- | ------ | -------- | ---------------------- |
| `title`       | string | ✅       | Philosophy title       |
| `description` | string | ✅       | Philosophy description |
| `icon`        | string | ❌       | Icon identifier        |

#### `PersonalCarousel`

**Location**: `src/components/ui/PersonalCarousel.astro`
**Purpose**: Carousel of personal information cards
**Props**: None
**Features**:

- Touch/swipe support
- Auto-rotation
- Responsive design

#### `DesktopSideNav`

**Location**: `src/components/ui/DesktopSideNav.astro`
**Purpose**: Desktop navigation sidebar
**Props**: None
**Features**:

- Smooth scroll navigation
- Active section highlighting
- Social links

#### `MobileNav`

**Location**: `src/components/ui/MobileNav.astro`
**Purpose**: Mobile navigation menu
**Props**: None
**Features**:

- Hamburger menu
- Overlay navigation
- Touch-optimized

#### `Footer`

**Location**: `src/components/ui/Footer.astro`
**Purpose**: Site footer
**Props**: None
**Features**:

- Copyright info
- Social links
- Built with section

## Usage Patterns

### Layout Integration

Most components are integrated through the main Layout:

```astro
---
import Layout from '@/layouts/Layout.astro';
import Hero from '@/components/sections/Hero.astro';
import About from '@/components/sections/About.astro';
import Projects from '@/components/sections/Projects.astro';
import Contact from '@/components/sections/Contact.astro';
---

<Layout>
  <Hero />
  <About />
  <Projects />
  <Contact />
</Layout>
```

### Component Composition

Components can be composed for complex features:

```astro
<section class="space-section">
  <SpaceBackground starDensity={0.0001} mouseGravityEnabled={true} />
  <div class="content">
    <TechStackOrbit />
    <!-- Section content -->
  </div>
</section>
```

### Responsive Design

All components follow mobile-first responsive design:

```astro
<!-- Components automatically adapt to screen size -->
<DesktopSideNav />
<!-- Hidden on mobile -->
<MobileNav />
<!-- Hidden on desktop -->
```

### Accessibility

Components include ARIA attributes and keyboard navigation:

```astro
<button aria-label="Open navigation menu" aria-expanded={isOpen}> Menu </button>
```

## Best Practices

### 1. **Import Order**

```astro
---
// 1. Astro/framework imports
import { Image } from 'astro:assets';

// 2. Layout imports
import Layout from '@/layouts/Layout.astro';

// 3. Component imports (grouped by type)
import Hero from '@/components/sections/Hero.astro';
import SpaceBackground from '@/components/effects/SpaceBackground.astro';
import ProjectCard from '@/components/ui/ProjectCard.astro';

// 4. Utils and types
import type { Project } from '@/types/project';
---
```

### 2. **Component Props**

- Use TypeScript interfaces for props
- Provide sensible defaults
- Document complex props

### 3. **Performance**

- Lazy load heavy components
- Use Astro's built-in optimizations
- Minimize client-side JavaScript

### 4. **Styling**

- Use Tailwind CSS classes
- Follow mobile-first approach
- Maintain consistent spacing

## Component Development

### Creating New Components

1. **Choose appropriate directory**:

   - `/effects/` - Visual effects and animations
   - `/sections/` - Page sections
   - `/ui/` - Reusable UI elements
   - `/accessibility/` - A11y specific components

2. **Follow naming convention**:

   - PascalCase for component files
   - Descriptive names (e.g., `ContactForm.astro`)

3. **Component structure**:

```astro
---
// 1. Define Props interface
interface Props {
  title: string;
  variant?: 'primary' | 'secondary';
}

// 2. Destructure props with defaults
const { title, variant = 'primary' } = Astro.props;

// 3. Component logic
const classes = variant === 'primary' ? 'bg-primary' : 'bg-secondary';
---

<!-- 4. Component template -->
<div class={classes}>
  <h2>{title}</h2>
  <slot />
</div>

<!-- 5. Scoped styles if needed -->
<style>
  /* Component-specific styles */
</style>
```

### Testing Components

- Visual testing in different viewports
- Keyboard navigation testing
- Screen reader compatibility
- Performance profiling

---

**Last Updated**: 2025-07-31
**Component Count**: 24
