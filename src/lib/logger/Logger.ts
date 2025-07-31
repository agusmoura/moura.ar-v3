/**
 * Logger - Structured logging system with environment awareness
 * Provides consistent logging across the application with proper formatting
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  levelName: string;
  component: string;
  message: string;
  metadata?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  traceId?: string;
}

export interface LoggerConfig {
  level: LogLevel;
  environment: 'development' | 'production' | 'test';
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  component: string;
}

export class Logger {
  private config: LoggerConfig;
  private buffer: LogEntry[] = [];
  private maxBufferSize = 100;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      environment: 'development',
      enableConsole: true,
      enableRemote: false,
      component: 'App',
      ...config,
    };

    // Auto-detect environment if not specified
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      this.config.environment = import.meta.env.DEV ? 'development' : 'production';
    }
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  error(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    const errorInfo = error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      : undefined;

    this.log(LogLevel.ERROR, message, metadata, errorInfo);
  }

  private log(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>,
    error?: { name: string; message: string; stack?: string }
  ): void {
    // Check log level threshold
    if (level < this.config.level) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      levelName: LogLevel[level],
      component: this.config.component,
      message,
      metadata,
      error,
      traceId: this.generateTraceId(),
    };

    // Add to buffer
    this.buffer.push(entry);
    if (this.buffer.length > this.maxBufferSize) {
      this.buffer.shift();
    }

    // Output to console in development
    if (this.config.enableConsole && this.config.environment === 'development') {
      this.logToConsole(entry);
    }

    // Send to remote in production
    if (this.config.enableRemote && this.config.environment === 'production') {
      this.logToRemote(entry);
    }
  }

  private logToConsole(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const prefix = `[${timestamp}] ${entry.levelName} [${entry.component}]`;

    const style = this.getConsoleStyle(entry.level);
    const message = `%c${prefix}%c ${entry.message}`;

    const args: any[] = [message, style, 'color: inherit'];

    if (entry.metadata) {
      args.push('\n📊 Metadata:', entry.metadata);
    }

    if (entry.error) {
      args.push('\n❌ Error:', entry.error);
    }

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(...args);
        break;
      case LogLevel.INFO:
        console.info(...args);
        break;
      case LogLevel.WARN:
        console.warn(...args);
        break;
      case LogLevel.ERROR:
        console.error(...args);
        break;
    }
  }

  private getConsoleStyle(level: LogLevel): string {
    const baseStyle = 'font-weight: bold; padding: 2px 6px; border-radius: 3px;';

    switch (level) {
      case LogLevel.DEBUG:
        return `${baseStyle} background: #6b7280; color: white;`;
      case LogLevel.INFO:
        return `${baseStyle} background: #3b82f6; color: white;`;
      case LogLevel.WARN:
        return `${baseStyle} background: #f59e0b; color: white;`;
      case LogLevel.ERROR:
        return `${baseStyle} background: #ef4444; color: white;`;
      default:
        return baseStyle;
    }
  }

  private logToRemote(entry: LogEntry): void {
    // Send to remote logging service (e.g., Sentry, LogRocket, etc.)
    if (!this.config.remoteEndpoint) return;

    fetch(this.config.remoteEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    }).catch((error) => {
      // Fallback to console if remote logging fails
      console.error('Failed to send log to remote:', error);
    });
  }

  private generateTraceId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Create child logger with additional context
  child(component: string, metadata?: Record<string, unknown>): Logger {
    const childLogger = new Logger({
      ...this.config,
      component: `${this.config.component}.${component}`,
    });

    // Override log method to include parent metadata
    const originalLog = childLogger.log.bind(childLogger);
    childLogger.log = (level, message, childMetadata?, error?) => {
      const combinedMetadata = {
        ...metadata,
        ...childMetadata,
      };
      originalLog(level, message, combinedMetadata, error);
    };

    return childLogger;
  }

  // Performance measurement utility
  time<T>(label: string, operation: () => T): T {
    const start = performance.now();
    const result = operation();
    const duration = performance.now() - start;

    this.debug(`⏱️ ${label}`, { duration: `${duration.toFixed(2)}ms` });

    return result;
  }

  async timeAsync<T>(label: string, operation: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await operation();
    const duration = performance.now() - start;

    this.debug(`⏱️ ${label}`, { duration: `${duration.toFixed(2)}ms` });

    return result;
  }

  // Get recent log entries
  getRecentLogs(count: number = 50): LogEntry[] {
    return this.buffer.slice(-count);
  }

  // Clear log buffer
  clearLogs(): void {
    this.buffer = [];
  }

  // Get logger statistics
  getStats(): {
    bufferSize: number;
    levelCounts: Record<string, number>;
    recentActivity: string;
  } {
    const levelCounts: Record<string, number> = {};

    this.buffer.forEach((entry) => {
      const levelName = LogLevel[entry.level];
      levelCounts[levelName] = (levelCounts[levelName] || 0) + 1;
    });

    const recentActivity =
      this.buffer.length > 0 ? this.buffer[this.buffer.length - 1].timestamp : 'No recent activity';

    return {
      bufferSize: this.buffer.length,
      levelCounts,
      recentActivity,
    };
  }
}

// Global logger instance
export const logger = new Logger({
  component: 'MouraAR',
  level:
    typeof import.meta !== 'undefined' && import.meta.env?.DEV ? LogLevel.DEBUG : LogLevel.INFO,
});

// Component-specific logger factory
export function createLogger(component: string, metadata?: Record<string, unknown>): Logger {
  return logger.child(component, metadata);
}
