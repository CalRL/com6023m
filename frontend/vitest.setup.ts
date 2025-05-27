// vitest.setup.ts
import '@testing-library/jest-dom';
import { test, expect, vi } from 'vitest';

class MockIntersectionObserver {
    constructor(callback: any, options?: any) {}
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
}

global.IntersectionObserver = MockIntersectionObserver as any;