import { vi } from 'vitest';

// Mock browser APIs
global.matchMedia = vi.fn(() => ({
  matches: false,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock Canvas API
global.HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillStyle: '',
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  createLinearGradient: vi.fn(() => ({
    addColorStop: vi.fn(),
  })),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
}));

// Mock performance API
global.performance = {
  ...global.performance,
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByName: vi.fn(() => []),
  getEntriesByType: vi.fn(() => []),
  timing: {
    navigationStart: 0,
    loadEventEnd: 1000,
    domContentLoadedEventEnd: 500,
  } as PerformanceTiming,
};

// Mock window.requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => {
  setTimeout(cb, 16);
  return 1;
});

global.cancelAnimationFrame = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

global.localStorage = localStorageMock;

// Mock gtag
global.gtag = vi.fn();

// Mock import.meta.env
vi.mock('astro:env', () => ({
  DEV: true,
  PROD: false,
  PUBLIC_ENABLE_ANALYTICS: 'false',
}));

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
});