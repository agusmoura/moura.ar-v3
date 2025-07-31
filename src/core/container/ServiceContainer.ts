/**
 * Service Container - Dependency Injection Container
 * Manages service instances and dependencies across the application
 */

export interface ServiceContainer {
  // Core services
  cache: CacheManager;
  logger: Logger;
  config: ConfigurationService;

  // Business services
  analytics: AnalyticsService;
  contact: ContactService;
  content: ContentService;

  // Effect services
  physics: SpacePhysicsEngine;
  interaction: InteractionManager;
}

// Service interfaces
export interface CacheManager {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

export interface Logger {
  debug(message: string, metadata?: Record<string, unknown>): void;
  info(message: string, metadata?: Record<string, unknown>): void;
  warn(message: string, metadata?: Record<string, unknown>): void;
  error(message: string, error?: Error, metadata?: Record<string, unknown>): void;
}

export interface ConfigurationService {
  get<T>(key: string): T;
  getEnvironment(): 'development' | 'production' | 'test';
  isDevelopment(): boolean;
  isProduction(): boolean;
}

export interface AnalyticsService {
  track(event: string, data?: Record<string, unknown>): void;
  identify(userId: string, traits?: Record<string, unknown>): void;
  page(name: string, properties?: Record<string, unknown>): void;
}

export interface ContactService {
  submitForm(data: ContactFormData): Promise<ContactResult>;
  validateForm(data: unknown): Promise<ContactFormData>;
}

export interface ContentService {
  getProjects(): Promise<Project[]>;
  getProject(slug: string): Promise<Project | null>;
  searchProjects(query: string): Promise<Project[]>;
}

export interface SpacePhysicsEngine {
  createStarField(config: StarFieldConfig): Star[];
  updatePhysics(stars: Star[], deltaTime: number): void;
  applyGravity(stars: Star[], center: Point, strength: number): void;
  applyBlackHole(stars: Star[], center: Point, config: BlackHoleConfig): void;
}

export interface InteractionManager {
  handleMouseMove(event: MouseEvent): void;
  handleClick(event: MouseEvent): void;
  handleResize(): void;
  cleanup(): void;
}

// Type definitions
export interface Point {
  x: number;
  y: number;
}

export interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinklePhase: number;
  velocity?: Point;
  mass?: number;
}

export interface StarFieldConfig {
  density: number;
  twinkleProbability: number;
  minTwinkleSpeed: number;
  maxTwinkleSpeed: number;
}

export interface BlackHoleConfig {
  eventHorizonRadius: number;
  spiralStrength: number;
  rotationSpeed: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  projectType: string[];
  utmParams?: UTMParams;
}

export interface ContactResult {
  success: boolean;
  message: string;
  id?: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  links?: {
    live?: string;
    github?: string;
    figma?: string;
  };
  images: any;
  featured?: boolean;
}

export interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

// Service container implementation
class ServiceContainerImpl implements ServiceContainer {
  private static instance: ServiceContainerImpl;
  private services = new Map<string, any>();

  static getInstance(): ServiceContainerImpl {
    if (!ServiceContainerImpl.instance) {
      ServiceContainerImpl.instance = new ServiceContainerImpl();
    }
    return ServiceContainerImpl.instance;
  }

  register<T>(name: keyof ServiceContainer, service: T): void {
    this.services.set(name, service);
  }

  get<T>(name: keyof ServiceContainer): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not registered`);
    }
    return service;
  }

  // Service accessors
  get cache(): CacheManager {
    return this.get('cache');
  }

  get logger(): Logger {
    return this.get('logger');
  }

  get config(): ConfigurationService {
    return this.get('config');
  }

  get analytics(): AnalyticsService {
    return this.get('analytics');
  }

  get contact(): ContactService {
    return this.get('contact');
  }

  get content(): ContentService {
    return this.get('content');
  }

  get physics(): SpacePhysicsEngine {
    return this.get('physics');
  }

  get interaction(): InteractionManager {
    return this.get('interaction');
  }
}

export const serviceContainer = ServiceContainerImpl.getInstance();
