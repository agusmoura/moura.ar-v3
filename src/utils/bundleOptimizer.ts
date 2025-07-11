/**
 * Bundle optimization utilities for reducing JavaScript payload
 */

export interface BundleOptimizationOptions {
  enableLazyLoading: boolean;
  enableCodeSplitting: boolean;
  enableTreeShaking: boolean;
  chunkSizeLimit: number;
  preloadCriticalChunks: boolean;
}

export class BundleOptimizer {
  private static readonly DEFAULT_OPTIONS: BundleOptimizationOptions = {
    enableLazyLoading: true,
    enableCodeSplitting: true,
    enableTreeShaking: true,
    chunkSizeLimit: 50000, // 50KB
    preloadCriticalChunks: true,
  };

  private options: BundleOptimizationOptions;

  constructor(options: Partial<BundleOptimizationOptions> = {}) {
    this.options = { ...BundleOptimizer.DEFAULT_OPTIONS, ...options };
  }

  /**
   * Lazy load a module with error handling and retry logic
   */
  public async lazyLoadModule<T>(
    importFunction: () => Promise<T>,
    moduleName: string,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const module = await importFunction();
        
        // Track successful load
        this.trackModuleLoad(moduleName, attempt);
        
        return module;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        console.warn(`Failed to load module ${moduleName} (attempt ${attempt}/${maxRetries}):`, lastError);
        
        // Exponential backoff
        if (attempt < maxRetries) {
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    // All retries failed
    this.trackModuleError(moduleName, lastError!);
    throw new Error(`Failed to load module ${moduleName} after ${maxRetries} attempts: ${lastError!.message}`);
  }

  /**
   * Preload critical chunks for better performance
   */
  public preloadCriticalChunks(chunkUrls: string[]): void {
    if (!this.options.preloadCriticalChunks) return;

    chunkUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'modulepreload';
      link.href = url;
      document.head.appendChild(link);
    });
  }

  /**
   * Monitor bundle size and warn if exceeding limits
   */
  public monitorBundleSize(): void {
    if (!('performance' in window)) return;

    const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const navigationEntry = entries[0];

    if (navigationEntry) {
      const transferSize = navigationEntry.transferSize;
      const encodedBodySize = navigationEntry.encodedBodySize;
      
      if (transferSize > this.options.chunkSizeLimit) {
        console.warn(`Bundle size warning: ${transferSize} bytes exceeds recommended limit of ${this.options.chunkSizeLimit} bytes`);
        
        // Report to analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'bundle_size_warning', {
            bundle_size: transferSize,
            encoded_size: encodedBodySize,
            limit: this.options.chunkSizeLimit,
          });
        }
      }
    }
  }

  /**
   * Optimize component loading with intersection observer
   */
  public createLazyComponentLoader(
    selector: string,
    loadFunction: () => Promise<void>,
    options: IntersectionObserverInit = {}
  ): IntersectionObserver {
    const defaultOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
      ...options,
    };

    const observer = new IntersectionObserver(async (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          try {
            await loadFunction();
            observer.unobserve(entry.target);
          } catch (error) {
            console.error('Failed to load lazy component:', error);
          }
        }
      }
    }, defaultOptions);

    const elements = document.querySelectorAll(selector);
    elements.forEach(element => observer.observe(element));

    return observer;
  }

  /**
   * Create optimized dynamic imports with better error handling
   */
  public createOptimizedImport<T>(
    importPath: string,
    options: {
      retryCount?: number;
      timeout?: number;
      fallback?: () => T;
    } = {}
  ): () => Promise<T> {
    const { retryCount = 3, timeout = 10000, fallback } = options;

    return async (): Promise<T> => {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Import timeout: ${importPath}`)), timeout);
      });

      try {
        const importPromise = this.lazyLoadModule(
          () => import(importPath),
          importPath,
          retryCount
        );

        return await Promise.race([importPromise, timeoutPromise]);
      } catch (error) {
        if (fallback) {
          console.warn(`Using fallback for ${importPath}:`, error);
          return fallback();
        }
        throw error;
      }
    };
  }

  /**
   * Analyze current bundle and provide optimization suggestions
   */
  public analyzeBundlePerformance(): {
    recommendations: string[];
    metrics: Record<string, number>;
  } {
    const recommendations: string[] = [];
    const metrics: Record<string, number> = {};

    // Check for large resources
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const largeResources = resources.filter(resource => resource.transferSize > 100000); // 100KB+

    if (largeResources.length > 0) {
      recommendations.push('Consider code splitting for large resources');
      metrics.largeResourceCount = largeResources.length;
    }

    // Check for unused chunks
    const scriptElements = document.querySelectorAll('script[src]');
    const loadedScripts = Array.from(scriptElements).map(script => (script as HTMLScriptElement).src);
    
    if (loadedScripts.length > 10) {
      recommendations.push('Consider lazy loading for non-critical scripts');
      metrics.scriptCount = loadedScripts.length;
    }

    // Check memory usage
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      
      if (memoryUsage > 0.8) {
        recommendations.push('High memory usage detected - consider optimizing components');
        metrics.memoryUsage = memoryUsage;
      }
    }

    return { recommendations, metrics };
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private trackModuleLoad(moduleName: string, attempt: number): void {
    console.log(`✅ Module loaded: ${moduleName} (attempt ${attempt})`);
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'module_load_success', {
        module_name: moduleName,
        attempt_count: attempt,
      });
    }
  }

  private trackModuleError(moduleName: string, error: Error): void {
    console.error(`❌ Module failed to load: ${moduleName}`, error);
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'module_load_error', {
        module_name: moduleName,
        error_message: error.message,
      });
    }
  }
}

// Export singleton instance
export const bundleOptimizer = new BundleOptimizer();

// Utility functions for common optimization patterns
export const optimizedImport = bundleOptimizer.createOptimizedImport.bind(bundleOptimizer);
export const lazyLoadModule = bundleOptimizer.lazyLoadModule.bind(bundleOptimizer);
export const createLazyLoader = bundleOptimizer.createLazyComponentLoader.bind(bundleOptimizer);

// Auto-analyze bundle performance on load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      bundleOptimizer.monitorBundleSize();
      const analysis = bundleOptimizer.analyzeBundlePerformance();
      
      if (analysis.recommendations.length > 0) {
        console.group('📊 Bundle Optimization Recommendations');
        analysis.recommendations.forEach(rec => console.log(`💡 ${rec}`));
        console.groupEnd();
      }
    }, 2000);
  });
}