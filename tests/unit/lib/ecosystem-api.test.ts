import { describe, expect, it } from 'vitest';
import type { EcosystemApiSourceEntry } from '@/lib/ecosystem-api';
import {
  buildEcosystemApiPayload,
  ECOSYSTEM_API_PATH,
} from '@/lib/ecosystem-api';

const text = (base: string) => ({ es: `${base} es`, en: `${base} en` });

const entries: EcosystemApiSourceEntry[] = [
  {
    id: 'beta-help',
    data: {
      name: 'Beta Help',
      url: 'https://example.com/b/',
      category: 'matching',
      order: 10,
      logo: '/images/ecosystem/beta/logo.webp',
      logoAuthorization: 'pending_contact',
      tagline: text('tagline'),
      what: text('what'),
      how: text('how'),
      integrations: {
        publicApi: 'yes',
        apiDocsUrl: 'https://example.com/docs',
        developersUrl: '/developers',
        notes: text('notes'),
      },
    },
  },
  {
    id: 'corag',
    data: {
      name: 'Corag',
      url: 'https://ayuda.corag.app',
      category: 'matching',
      featured: true,
      order: 0,
      logo: '/images/ecosystem/corag/logo.webp',
      logoAuthorization: 'authorized',
      tagline: text('tagline'),
      what: text('what'),
      how: text('how'),
      overview: text('overview'),
      features: [text('feature')],
      tools: [text('tool')],
      audience: text('audience'),
      coverage: text('coverage'),
      limits: text('limits'),
      integrations: { publicApi: 'yes', publicMcp: 'yes' },
    },
  },
  {
    id: 'gone-app',
    data: {
      name: 'Gone App',
      url: 'https://example.com/gone',
      category: 'pets',
      active: false,
      tagline: text('tagline'),
      what: text('what'),
      how: text('how'),
    },
  },
];

describe('buildEcosystemApiPayload', () => {
  const payload = buildEcosystemApiPayload(entries, '2026-08-18T00:00:00.000Z');

  it('drops inactive apps and sorts featured first', () => {
    expect(payload.apps.map((a) => a.id)).toEqual(['corag', 'beta-help']);
    expect(payload.counts.apps).toBe(2);
  });

  it('advertises its own canonical endpoint', () => {
    expect(payload.endpoint.endsWith(ECOSYSTEM_API_PATH)).toBe(true);
    expect(payload.version).toBe(1);
    expect(payload.generatedAt).toBe('2026-08-18T00:00:00.000Z');
  });

  it('carries every bilingual detail field', () => {
    const corag = payload.apps[0];
    expect(corag.tagline).toEqual(text('tagline'));
    expect(corag.overview).toEqual(text('overview'));
    expect(corag.features).toEqual([text('feature')]);
    expect(corag.tools).toEqual([text('tool')]);
    expect(corag.audience).toEqual(text('audience'));
    expect(corag.coverage).toEqual(text('coverage'));
    expect(corag.limits).toEqual(text('limits'));
    expect(corag.integrations.publicMcp).toBe('yes');
  });

  it('falls back overview → what and defaults availability to unknown', () => {
    const beta = payload.apps[1];
    expect(beta.overview).toEqual(text('what'));
    expect(beta.integrations.publicMcp).toBe('unknown');
    expect(beta.integrations.notes).toEqual(text('notes'));
  });

  it('resolves site-relative developers links to absolute URLs', () => {
    const beta = payload.apps[1];
    expect(beta.integrations.developersUrl).toMatch(
      /^https:\/\/.+\/developers$/
    );
  });

  it('only exposes logos their owners authorized', () => {
    const [corag, beta] = payload.apps;
    expect(corag.logo).toMatch(
      /^https:\/\/.+\/images\/ecosystem\/corag\/logo\.webp$/
    );
    expect(beta.logo).toBeUndefined();
  });

  it('lists every category with a bilingual label and a consistent count', () => {
    expect(payload.categories.map((c) => c.id)).toEqual([
      'matching',
      'damage',
      'logistics',
      'pets',
      'people',
    ]);
    for (const category of payload.categories) {
      expect(category.label.es).toBeTruthy();
      expect(category.label.en).toBeTruthy();
      expect(category.lead.es).toBeTruthy();
      expect(category.lead.en).toBeTruthy();
      expect(category.count).toBe(payload.counts.byCategory[category.id]);
    }
    expect(payload.counts.byCategory.matching).toBe(2);
    expect(payload.counts.byCategory.pets).toBe(0);
  });

  it('ships the page-level bilingual context', () => {
    expect(payload.description.es).toBeTruthy();
    expect(payload.description.en).toBeTruthy();
    expect(payload.disclosure.es).toBeTruthy();
    expect(payload.disclosure.en).toBeTruthy();
    expect(payload.page.es).toContain('/ecosystem');
    expect(payload.page.en).toContain('/en/ecosystem');
    expect(payload.markdownTwins.es.endsWith('/ecosystem.md')).toBe(true);
  });
});
