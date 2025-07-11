import { describe, it, expect } from 'vitest';
import { parseText } from './textParser';

describe('textParser', () => {
  describe('parseText', () => {
    it('should parse text with double brackets', () => {
      const input = 'This is [[highlighted]] text';
      const result = parseText(input);
      
      expect(result).toBe('This is <span class="text-accent-light">highlighted</span> text');
    });

    it('should parse multiple highlighted sections', () => {
      const input = 'First [[highlight]] and second [[highlight]]';
      const result = parseText(input);
      
      expect(result).toBe('First <span class="text-accent-light">highlight</span> and second <span class="text-accent-light">highlight</span>');
    });

    it('should handle empty brackets', () => {
      const input = 'Empty [[]] brackets';
      const result = parseText(input);
      
      expect(result).toBe('Empty <span class="text-accent-light"></span> brackets');
    });

    it('should handle text without brackets', () => {
      const input = 'Plain text without highlights';
      const result = parseText(input);
      
      expect(result).toBe('Plain text without highlights');
    });

    it('should handle nested brackets correctly', () => {
      const input = 'Nested [[outer [[inner]] text]] brackets';
      const result = parseText(input);
      
      // Should only process the outermost brackets
      expect(result).toBe('Nested <span class="text-accent-light">outer [[inner</span> text]] brackets');
    });

    it('should handle single brackets', () => {
      const input = 'Single [bracket] text';
      const result = parseText(input);
      
      expect(result).toBe('Single [bracket] text');
    });

    it('should handle empty string', () => {
      const input = '';
      const result = parseText(input);
      
      expect(result).toBe('');
    });

    it('should handle special characters in brackets', () => {
      const input = 'Special [[characters & symbols!]] text';
      const result = parseText(input);
      
      expect(result).toBe('Special <span class="text-accent-light">characters & symbols!</span> text');
    });

    it('should handle multiline text', () => {
      const input = 'Line 1 [[highlight]]\nLine 2 [[another]]';
      const result = parseText(input);
      
      expect(result).toBe('Line 1 <span class="text-accent-light">highlight</span>\nLine 2 <span class="text-accent-light">another</span>');
    });
  });
});