import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  EVENTS,
  getAnalyticsContext,
  getPageSection,
  normalizePathname,
  PII_DENYLIST_KEYS,
  resetOutboundTracking,
  resetScrollDepthBinding,
  sanitizeEventData,
  shouldTrackScrollDepth,
  trackEvent,
  trackScrollDepth,
} from '@/lib/analytics';

describe('analytics helpers', () => {
  beforeEach(() => {
    resetScrollDepthBinding();
    resetOutboundTracking();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    delete (window as { umami?: unknown }).umami;
  });

  describe('getPageSection', () => {
    it('returns home for root paths', () => {
      expect(getPageSection('/')).toBe('home');
      expect(getPageSection('/en')).toBe('home');
      expect(getPageSection('/en/')).toBe('home');
    });

    it('returns first segment for nested routes', () => {
      expect(getPageSection('/blog/my-post')).toBe('blog');
      expect(getPageSection('/en/blog/tag/donations')).toBe('blog');
      expect(getPageSection('/how-it-works')).toBe('how-it-works');
    });
  });

  describe('getAnalyticsContext', () => {
    it('merges lang and section', () => {
      expect(getAnalyticsContext('es', '/blog/how-to-donate-safely')).toEqual({
        lang: 'es',
        section: 'blog',
      });
      expect(getAnalyticsContext('en', '/en/transparency')).toEqual({
        lang: 'en',
        section: 'transparency',
      });
    });
  });

  describe('normalizePathname', () => {
    it('strips /en prefix', () => {
      expect(normalizePathname('/en/blog')).toBe('/blog');
      expect(normalizePathname('/blog')).toBe('/blog');
    });
  });

  describe('shouldTrackScrollDepth', () => {
    it('enables on long-form routes', () => {
      expect(shouldTrackScrollDepth('/blog/how-to-donate-safely')).toBe(true);
      expect(shouldTrackScrollDepth('/en/blog/how-to-donate-safely')).toBe(
        true
      );
      expect(shouldTrackScrollDepth('/about')).toBe(true);
      expect(shouldTrackScrollDepth('/how-it-works')).toBe(true);
      expect(shouldTrackScrollDepth('/en/transparency')).toBe(true);
    });

    it('disables on listing pages', () => {
      expect(shouldTrackScrollDepth('/blog')).toBe(false);
      expect(shouldTrackScrollDepth('/blog/tag/donations')).toBe(false);
      expect(shouldTrackScrollDepth('/')).toBe(false);
    });
  });

  describe('sanitizeEventData', () => {
    it('strips PII-like keys', () => {
      const result = sanitizeEventData({
        slug: 'post',
        email: 'user@example.com',
        user_name: 'Jane',
        message_body: 'hello',
      });
      expect(result).toEqual({ slug: 'post' });
    });

    it('returns undefined when all keys are denied', () => {
      expect(sanitizeEventData({ email: 'a@b.c' })).toBeUndefined();
    });
  });

  describe('PII denylist coverage', () => {
    it('includes common PII field names', () => {
      expect(PII_DENYLIST_KEYS).toContain('email');
      expect(PII_DENYLIST_KEYS).toContain('name');
      expect(PII_DENYLIST_KEYS).toContain('message');
    });
  });

  describe('trackEvent', () => {
    it('no-ops when umami is not loaded', () => {
      expect(() =>
        trackEvent(EVENTS.NAV_CLICK, { item: 'blog' })
      ).not.toThrow();
    });

    it('calls umami.track with sanitized payload', () => {
      const track = vi.fn();
      (window as { umami?: { track: typeof track } }).umami = { track };

      trackEvent(EVENTS.CONTACT_FORM_SUBMIT, {
        reason: 'general',
        email: 'blocked@example.com',
      });

      expect(track).toHaveBeenCalledWith(EVENTS.CONTACT_FORM_SUBMIT, {
        reason: 'general',
      });
    });
  });

  describe('trackScrollDepth', () => {
    it('does not double-bind listeners', () => {
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        configurable: true,
        value: 2000,
      });
      Object.defineProperty(window, 'innerHeight', {
        configurable: true,
        value: 800,
      });
      Object.defineProperty(window, 'scrollY', {
        configurable: true,
        writable: true,
        value: 0,
      });

      const addSpy = vi.spyOn(window, 'addEventListener');
      trackScrollDepth();
      trackScrollDepth();
      expect(addSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('EVENTS catalog', () => {
    it('uses snake_case names only', () => {
      for (const value of Object.values(EVENTS)) {
        expect(value).toMatch(/^[a-z][a-z0-9_]*$/);
      }
    });
  });
});
