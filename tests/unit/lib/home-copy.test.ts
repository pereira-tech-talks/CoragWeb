import { describe, expect, it } from 'vitest';

import { en } from '@/lib/translations/en';
import { es } from '@/lib/translations/es';

/**
 * Structure tests for the home copy contract.
 *
 * The evidence act argues that unverified numbers are the problem — so its
 * own copy must never contain one. The no-amounts rule below is the guard
 * against somebody later "filling in" the two-numbers component with
 * plausible-looking figures (AGENTS.md rule 0).
 */

const locales = { es: es.home, en: en.home } as const;

describe('home copy — evidence act (beat 4)', () => {
  for (const [lang, home] of Object.entries(locales)) {
    describe(lang, () => {
      it('carries exactly three pillars', () => {
        expect(home.pillars).toHaveLength(3);
      });

      it('contains no digits or currency in the evidence copy', () => {
        const evidenceCopy = [
          home.trustEyebrow,
          home.trustTitle,
          home.trustBody,
          home.trustHonestyLine,
          ...home.pillars.flatMap((p) => [p.title, p.body]),
        ].join(' ');
        expect(evidenceCopy).not.toMatch(/[\d$€£]/);
      });

      it('has a non-empty honesty line', () => {
        expect(home.trustHonestyLine.length).toBeGreaterThan(20);
      });
    });
  }

  it('keeps the pillar structure parallel across locales', () => {
    expect(locales.es.pillars.length).toBe(locales.en.pillars.length);
  });

  it('agrees with the canonical transparency wording', () => {
    expect(locales.es.pillars[1]?.title).toBe('Utilizado con evidencia');
    expect(locales.en.pillars[1]?.title).toBe('Used with evidence');
  });
});
