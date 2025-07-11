export interface ErrorContext {
  component: string;
  action: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
  userAgent: string;
  url: string;
}

export interface ErrorReport {
  error: Error;
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: ErrorReport[] = [];
  private isReporting = false;

  private constructor() {
    this.setupGlobalHandlers();
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private setupGlobalHandlers(): void {
    // Handle uncaught JavaScript errors
    window.addEventListener('error', (event) => {
      const error = event.error || new Error(event.message);
      this.handleError(error, {
        component: 'Global',
        action: 'uncaught_error',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      this.handleError(error, {
        component: 'Global',
        action: 'unhandled_promise_rejection',
        metadata: {
          reason: event.reason,
        },
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    });
  }

  public handleError(error: Error, context: ErrorContext, severity: ErrorReport['severity'] = 'medium'): void {
    const errorReport: ErrorReport = {
      error,
      context,
      severity,
      recoverable: this.isRecoverable(error, severity),
    };

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Error handled:', errorReport);
    }

    // Add to queue for reporting
    this.errorQueue.push(errorReport);

    // Report analytics
    this.reportToAnalytics(errorReport);

    // Process queue
    this.processErrorQueue();
  }

  private isRecoverable(error: Error, severity: ErrorReport['severity']): boolean {
    // Critical errors are typically not recoverable
    if (severity === 'critical') return false;

    // Common recoverable errors
    const recoverablePatterns = [
      /network/i,
      /fetch/i,
      /timeout/i,
      /loading/i,
      /swiper/i,
    ];

    return recoverablePatterns.some(pattern => pattern.test(error.message));
  }

  private reportToAnalytics(errorReport: ErrorReport): void {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: `${errorReport.context.component}: ${errorReport.error.message}`,
        fatal: errorReport.severity === 'critical',
        custom_map: {
          custom_parameter_1: errorReport.context.action,
          custom_parameter_2: errorReport.severity,
        },
      });
    }

    // Custom analytics endpoint (if needed)
    if (import.meta.env.PROD && import.meta.env.PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(import.meta.env.PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'error',
          data: {
            message: errorReport.error.message,
            stack: errorReport.error.stack,
            context: errorReport.context,
            severity: errorReport.severity,
          },
        }),
      }).catch(() => {
        // Silently fail - don't create error loops
      });
    }
  }

  private async processErrorQueue(): Promise<void> {
    if (this.isReporting || this.errorQueue.length === 0) return;

    this.isReporting = true;

    try {
      // Process high severity errors first
      const criticalErrors = this.errorQueue.filter(e => e.severity === 'critical');
      const highErrors = this.errorQueue.filter(e => e.severity === 'high');
      const mediumErrors = this.errorQueue.filter(e => e.severity === 'medium');
      const lowErrors = this.errorQueue.filter(e => e.severity === 'low');

      // Process in order of severity
      for (const errorReport of [...criticalErrors, ...highErrors, ...mediumErrors, ...lowErrors]) {
        await this.processError(errorReport);
      }

      // Clear processed errors
      this.errorQueue = [];
    } finally {
      this.isReporting = false;
    }
  }

  private async processError(errorReport: ErrorReport): Promise<void> {
    // Log for debugging
    console.warn(`Processing error: ${errorReport.context.component} - ${errorReport.error.message}`);

    // Store in localStorage for debugging
    if (import.meta.env.DEV) {
      const errorLog = JSON.parse(localStorage.getItem('error_log') || '[]');
      errorLog.push({
        ...errorReport,
        error: {
          message: errorReport.error.message,
          stack: errorReport.error.stack,
        },
      });
      
      // Keep only last 50 errors
      if (errorLog.length > 50) {
        errorLog.splice(0, errorLog.length - 50);
      }
      
      localStorage.setItem('error_log', JSON.stringify(errorLog));
    }

    // Recovery attempts for recoverable errors
    if (errorReport.recoverable) {
      await this.attemptRecovery(errorReport);
    }
  }

  private async attemptRecovery(errorReport: ErrorReport): Promise<void> {
    const { component, action } = errorReport.context;

    try {
      // Component-specific recovery strategies
      if (component === 'PersonalCarousel' && action === 'swiper_load_failed') {
        // Try to reload Swiper
        await this.retryComponentLoad('swiper');
      }

      if (component === 'SpaceBackground' && action === 'canvas_init_failed') {
        // Try to reinitialize canvas
        await this.retryComponentLoad('canvas');
      }

      // Generic network recovery
      if (errorReport.error.message.includes('network') || errorReport.error.message.includes('fetch')) {
        await this.retryNetworkRequest(errorReport);
      }
    } catch (recoveryError) {
      // Recovery failed, log but don't throw
      console.warn('Recovery attempt failed:', recoveryError);
    }
  }

  private async retryComponentLoad(componentType: string): Promise<void> {
    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Emit custom event for component to handle
    window.dispatchEvent(new CustomEvent('component-retry', {
      detail: { componentType }
    }));
  }

  private async retryNetworkRequest(errorReport: ErrorReport): Promise<void> {
    // Exponential backoff for network retries
    const retryDelay = Math.min(1000 * Math.pow(2, 3), 10000); // Max 10 seconds
    await new Promise(resolve => setTimeout(resolve, retryDelay));

    // Emit retry event
    window.dispatchEvent(new CustomEvent('network-retry', {
      detail: { context: errorReport.context }
    }));
  }

  // Public API for components
  public reportComponentError(
    component: string,
    action: string,
    error: Error,
    metadata?: Record<string, unknown>,
    severity: ErrorReport['severity'] = 'medium'
  ): void {
    this.handleError(error, {
      component,
      action,
      metadata,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }, severity);
  }

  public getErrorLog(): ErrorReport[] {
    return [...this.errorQueue];
  }

  public clearErrorLog(): void {
    this.errorQueue = [];
    if (import.meta.env.DEV) {
      localStorage.removeItem('error_log');
    }
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Global error reporting function
export function reportError(
  component: string,
  action: string,
  error: Error,
  metadata?: Record<string, unknown>,
  severity: ErrorReport['severity'] = 'medium'
): void {
  errorHandler.reportComponentError(component, action, error, metadata, severity);
}

// Type declarations for global gtag
declare global {
  function gtag(...args: unknown[]): void;
}