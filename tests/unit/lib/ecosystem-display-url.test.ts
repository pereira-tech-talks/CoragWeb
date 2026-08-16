import { describe, expect, it } from 'vitest';

import { formatEcosystemDisplayUrl } from '@/lib/ecosystem';

describe('formatEcosystemDisplayUrl', () => {
  it('strips protocol, www, and trailing slash', () => {
    expect(formatEcosystemDisplayUrl('https://www.example.com/')).toBe(
      'example.com'
    );
  });

  it('keeps a meaningful path', () => {
    expect(formatEcosystemDisplayUrl('https://soygogo.com/pereira-ayuda')).toBe(
      'soygogo.com/pereira-ayuda'
    );
  });

  it('falls back for non-URL strings', () => {
    expect(formatEcosystemDisplayUrl('not-a-url')).toBe('not-a-url');
  });
});
