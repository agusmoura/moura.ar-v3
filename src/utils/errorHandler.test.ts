import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ErrorHandler, reportError } from './errorHandler';

describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler;

  beforeEach(() => {
    errorHandler = ErrorHandler.getInstance();
    errorHandler.clearErrorLog();
    
    // Mock console methods
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  describe('getInstance', () => {
    it('should return a singleton instance', () => {
      const instance1 = ErrorHandler.getInstance();
      const instance2 = ErrorHandler.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('reportComponentError', () => {
    it('should handle component errors correctly', () => {
      const error = new Error('Test error');
      const component = 'TestComponent';
      const action = 'test_action';
      
      errorHandler.reportComponentError(component, action, error);
      
      const errorLog = errorHandler.getErrorLog();
      expect(errorLog).toHaveLength(1);
      expect(errorLog[0].error).toBe(error);
      expect(errorLog[0].context.component).toBe(component);
      expect(errorLog[0].context.action).toBe(action);
    });

    it('should classify errors by severity', () => {
      const error = new Error('Critical error');
      
      errorHandler.reportComponentError('Component', 'action', error, {}, 'critical');
      
      const errorLog = errorHandler.getErrorLog();
      expect(errorLog[0].severity).toBe('critical');
      expect(errorLog[0].recoverable).toBe(false);
    });

    it('should mark recoverable errors correctly', () => {
      const networkError = new Error('Network request failed');
      
      errorHandler.reportComponentError('Component', 'action', networkError, {}, 'medium');
      
      const errorLog = errorHandler.getErrorLog();
      expect(errorLog[0].recoverable).toBe(true);
    });
  });

  describe('reportError function', () => {
    it('should use the singleton instance', () => {
      const error = new Error('Test error');
      
      reportError('Component', 'action', error);
      
      const errorLog = errorHandler.getErrorLog();
      expect(errorLog).toHaveLength(1);
    });
  });

  describe('error classification', () => {
    it('should identify recoverable errors', () => {
      const recoverableErrors = [
        new Error('Network timeout'),
        new Error('Fetch failed'),
        new Error('Swiper initialization failed'),
      ];

      recoverableErrors.forEach((error, index) => {
        errorHandler.reportComponentError(`Component${index}`, 'action', error, {}, 'medium');
      });

      const errorLog = errorHandler.getErrorLog();
      expect(errorLog.every(log => log.recoverable)).toBe(true);
    });

    it('should identify non-recoverable errors', () => {
      const error = new Error('Syntax error');
      
      errorHandler.reportComponentError('Component', 'action', error, {}, 'critical');
      
      const errorLog = errorHandler.getErrorLog();
      expect(errorLog[0].recoverable).toBe(false);
    });
  });

  describe('clearErrorLog', () => {
    it('should clear the error log', () => {
      const error = new Error('Test error');
      errorHandler.reportComponentError('Component', 'action', error);
      
      expect(errorHandler.getErrorLog()).toHaveLength(1);
      
      errorHandler.clearErrorLog();
      
      expect(errorHandler.getErrorLog()).toHaveLength(0);
    });
  });

  describe('analytics reporting', () => {
    it('should call gtag when available', () => {
      const mockGtag = vi.fn();
      global.gtag = mockGtag;
      
      const error = new Error('Test error');
      errorHandler.reportComponentError('Component', 'action', error);
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'exception', expect.any(Object));
    });
  });
});